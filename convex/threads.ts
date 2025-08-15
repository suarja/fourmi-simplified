"use node";

import { action, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { components } from "./_generated/api";
import { financialAgent } from "./agents";

// List all threads for the authenticated user
export const listUserThreads: any = action({
  args: {},
  handler: async (ctx): Promise<any> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      // Query threads using Convex Agents API
      const threads: any = await ctx.runQuery(
        components.agent.threads.listThreadsByUserId,
        { 
          userId: userId,
          paginationOpts: { cursor: null, numItems: 50 } // Get up to 50 recent threads
        }
      );

      // Transform thread data for frontend consumption
      return threads.page.map((thread: any) => ({
        threadId: thread.threadId,
        title: thread.title || "Financial Chat",
        summary: thread.summary || "",
        creationTime: thread.creationTime,
        lastUpdateTime: thread.lastUpdateTime,
      }));
    } catch (error) {
      console.error("Error listing user threads:", error);
      return []; // Return empty array on error to avoid breaking UI
    }
  },
});

// Get recent messages for a thread (for preview in sidebar)
export const getThreadMessages: any = action({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, { threadId }): Promise<any> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      // Get recent messages from the thread
      const { listMessages } = await import("@convex-dev/agent");
      
      const messages = await listMessages(ctx, components.agent, {
        threadId: threadId,
        excludeToolMessages: true, // Only show user/assistant messages
        paginationOpts: { cursor: null, numItems: 5 } // Get last 5 messages
      });

      return messages.page.map((message: any) => ({
        id: message._id,
        type: message.type,
        content: message.content,
        timestamp: message._creationTime,
      }));
    } catch (error) {
      console.error("Error getting thread messages:", error);
      return [];
    }
  },
});

// Update thread metadata (title, summary)
export const updateThreadMetadata: any = action({
  args: {
    threadId: v.string(),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, { threadId, title, summary }): Promise<any> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      // Continue the thread to get thread object
      const { thread } = await financialAgent.continueThread(ctx, { threadId });
      
      // Update metadata
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (summary !== undefined) updateData.summary = summary;
      
      await thread.updateMetadata({ patch: updateData });
      
      return { success: true };
    } catch (error) {
      console.error("Error updating thread metadata:", error);
      throw new Error("Failed to update thread");
    }
  },
});

// Delete a specific thread
export const deleteThread: any = action({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, { threadId }): Promise<any> => {
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

// Generate a meaningful title from the first message
export const generateThreadTitle: any = action({
  args: {
    message: v.string(),
  },
  handler: async (ctx, { message }): Promise<any> => {
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