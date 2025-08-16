"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { getAuthUserId } from "../lib/auth";

import { z } from "zod";
import { titleAgent } from "../agents/title";
import { financialAgent } from "../agents/finance";



// Action to start a conversation - Uses the existing agent
export const startFinancialConversation = action({
  args: {
    profileId: v.id("profiles"),
    message: v.string(),
  },
  handler: async (ctx, { profileId, message }): Promise<any> => {
    // Authentication checks (same as conversations.ts)
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify profile belongs to user
    const profile = await ctx.runQuery(api.profiles.getUserProfile);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found or access denied");
    }

    // Ask AI to generate a title
    const { thread: titleThread } = await titleAgent.createThread(ctx, {
      userId: userId,
      title: "Title",
      summary: "Generate a title for a thread",
    });
    const titleObject = await titleThread.generateObject({
      prompt: message,
      schema: z.object({
        title: z.string(),
      }),
    });

    const title = titleObject.object.title;

    await titleAgent.deleteThreadAsync(ctx, { threadId: titleThread.threadId });

    
    // Use the existing agent - create thread properly
    const { thread } = await financialAgent.createThread(ctx, {
      userId: userId,
      title,
      summary: `Financial conversation started with: ${message.substring(0, 100)}...`,
    });
    
    // Add user message with explicit role first
    const response = await thread.generateText({
      messages: [
        { role: "user", content: message }
      ],
    });

    return {
      threadId: thread.threadId,
      response: response.text,
      profileId: profileId, // Include for frontend reference
        threadTitle: title, // Return title for frontend
    };
  },
});

// Action to continue a conversation - Uses the existing agent
export const continueFinancialConversation = action({
  args: {
    threadId: v.string(),
    message: v.string(),
    profileId: v.id("profiles"),
  },
  handler: async (ctx, { threadId, message, profileId }) => {
    // Authentication checks
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify profile belongs to user
    const profile = await ctx.runQuery(api.profiles.getUserProfile);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found or access denied");
    }

    // Use the existing agent - continue existing thread
    const { thread } = await financialAgent.continueThread(ctx, { threadId });
    
    // Generate response using the agent thread with explicit user message
    const response = await thread.generateText({
      messages: [
        { role: "user", content: message }
      ],
    });

    // TODO: Re-implement auto-detection when thread metadata is working
    // For now, skip auto-detection to prevent crashes

    return {
      response: response.text,
      profileId: profileId, // Include for frontend reference
    };
  },
});

// Action to get conversation history from a thread
export const getThreadHistory = action({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, { threadId }) => {
    // Authentication check
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement proper agent thread history retrieval
    // For now, return placeholder to avoid errors
    return [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi! I'm Fourmi, your financial copilot. I can help you track your income, expenses, and loans. Just tell me about your financial situation!" }
    ];
  },
});