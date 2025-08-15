"use node";

import { action, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./lib/auth";
import { components } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { listMessages } from "@convex-dev/agent";
import { financialAgent } from "./agents/finance";


// List all threads for the authenticated user
export const listUserThreads = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      // Query threads using Convex Agents API
      const threads  = await ctx.runQuery(
        components.agent.threads.listThreadsByUserId,
        { 
          userId: userId,
          paginationOpts: { cursor: null, numItems: 50 } // Get up to 50 recent threads
        }
      );

      console.log("Raw threads data:", JSON.stringify(threads, null, 2));
      console.log("Threads page length:", threads.page?.length);

      // Transform thread data for frontend consumption
      const transformedThreads = threads.page.map((thread: any) => {
        console.log("Processing thread:", JSON.stringify(thread, null, 2));
        return {
          threadId: thread._id, // Convex uses _id for threadId
          title: thread.title || "Financial Chat",
          summary: thread.summary || "",
          creationTime: thread._creationTime, // Convex uses _creationTime
          lastUpdateTime: thread._creationTime, // Use creation time if no lastUpdate
        };
      });

      console.log("Transformed threads:", JSON.stringify(transformedThreads, null, 2));
      return transformedThreads;
    } catch (error) {
      console.error("Error listing user threads:", error);
      return []; // Return empty array on error to avoid breaking UI
    }
  },
});

// Get all messages for a thread (for chat interface)
export const getThreadMessages = action({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, { threadId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      // Get recent messages from the thread using correct API
      const messages = await listMessages(ctx, components.agent, {
        threadId: threadId,
        excludeToolMessages: true, // Only show user/assistant messages
        paginationOpts: { cursor: null, numItems: 100 } // Get all messages for chat interface
      });

      console.log("Raw messages from thread:", JSON.stringify(messages, null, 2));

      return messages.page.map((message: any) => {
        // The role is nested inside message.message.role for agent messages
        const role = message.message?.role || message.role;
        
        // Content can be in different places depending on message type
        let content = "";
        if (message.message?.content) {
          if (Array.isArray(message.message.content)) {
            // Assistant messages have content as array with text objects
            content = message.message.content.map((c: any) => c.text).join("");
          } else {
            // User messages have content as string
            content = message.message.content;
          }
        } else {
          // Fallback to text field
          content = message.text || "";
        }
        
        return {
          id: message._id,
          type: role === "user" ? "user" : "assistant", // Convert role to type
          content: content,
          timestamp: message._creationTime,
        };
      });
    } catch (error) {
      console.error("Error getting thread messages:", error);
      return [];
    }
  },
});

// Update thread metadata (title, summary)
export const updateThreadMetadata = action({
  args: {
    threadId: v.string(),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, { threadId, title, summary }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      // Continue the thread to get thread object
      const { thread } = await financialAgent.continueThread(ctx, { threadId });
      
      // Update metadata
      const updateData: { title?: string; summary?: string; status?: string } = {};
      if (title !== undefined) updateData.title = title;
      if (summary !== undefined) updateData.summary = summary;
      
      await thread.updateMetadata({
        title: title,
        summary: summary,
        status: "active",
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error updating thread metadata:", error);
      throw new Error("Failed to update thread");
    }
  },
});

// Delete a specific thread
export const deleteThread = action({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, { threadId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      // Delete the thread using agent API
      await financialAgent.deleteThreadAsync(ctx, { threadId });
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting thread:", error);
      throw new Error("Failed to delete thread");
    }
  },
});

// Test function to check thread creation (for debugging)
export const testThreadCreation = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // List existing threads
    const existingThreads = await ctx.runQuery(
      components.agent.threads.listThreadsByUserId,
      { 
        userId: userId,
        paginationOpts: { cursor: null, numItems: 10 }
      }
    );

    console.log("TESTING: Existing threads for user:", userId);
    console.log("TESTING: Found", existingThreads.page.length, "threads");
    
    existingThreads.page.forEach((thread: any, index: number) => {
      console.log(`TESTING: Thread ${index + 1}:`, {
        threadId: thread.threadId,
        title: thread.title,
        summary: thread.summary,
        creationTime: thread.creationTime,
        lastUpdateTime: thread.lastUpdateTime
      });
    });

    return {
      userId,
      threadCount: existingThreads.page.length,
      threads: existingThreads.page.map((t: any) => ({
        threadId: t.threadId,
        title: t.title,
        summary: t.summary
      }))
    };
  },
});

// Generate a meaningful title from the first message
export const generateThreadTitle = action({
  args: {
    message: v.string(),
  },
  handler: async (ctx, { message }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      // Use AI to generate a concise title from the first message
      const { generateText } = await import("ai");
      const { openai } = await import("@ai-sdk/openai");

      const result = await generateText({
        model: openai("gpt-4o"),
        prompt: `Generate a short, descriptive title (max 4 words) for a financial conversation that starts with: "${message}"

Examples:
- "I earn 3000€ monthly" → "Monthly Income Discussion"
- "My rent is too high" → "Housing Cost Review"
- "Need help with budget" → "Budget Planning Help"
- "I have credit card debt" → "Credit Card Debt"

Title:`,
        maxTokens: 20,
      });

      const title = result.text.trim().replace(/['"]/g, ''); // Remove quotes
      return { title: title || "Financial Chat" };
    } catch (error) {
      console.error("Error generating thread title:", error);
      return { title: "Financial Chat" }; // Fallback title
    }
  },
});