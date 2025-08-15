"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { api, components } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { 
  extractFinancialDataTool, 
  getFinancialSummaryTool, 
  generateFinancialAdviceTool 
} from "./agents/financialTools";
import { z } from "zod";
// import { generateTitle } from "./lib/title";

const titleAgent = new Agent(components.agent, {
  name: "Title Agent",
  chat: openai("gpt-4o"),
  instructions: `You are a title agent. You are given a message and you need to generate a title for a thread.`,

});


// DECLARE AGENT AT MODULE LEVEL - Exportable for playground integration
export const financialAgent = new Agent(components.agent, {
  name: "Fourmi Financial Copilot",
  chat: openai("gpt-4o"),
  tools: {
    extractFinancialData: extractFinancialDataTool,
    getFinancialSummary: getFinancialSummaryTool,
    generateFinancialAdvice: generateFinancialAdviceTool,
  },
  instructions: `You are Fourmi, a friendly financial copilot helping users escape debt traps and build better budgets.

Your mission is to help users track their financial information and make informed decisions. You should:

1. **Extract financial information** from user messages using the extractFinancialData tool when they mention income, expenses, or loans
2. **Provide financial summaries** using the getFinancialSummary tool when they ask about their current situation  
3. **Generate personalized advice** using the generateFinancialAdvice tool based on their specific context
4. **Be encouraging and avoid financial jargon** - use clear, simple language
5. **Focus on practical steps** to improve their financial situation

**Available Tools:**
- extractFinancialData: Use when user mentions financial amounts (income, expenses, loans)
- getFinancialSummary: Use when user asks about their financial overview or current situation
- generateFinancialAdvice: Use when user needs personalized guidance or advice

**Important Guidelines:**
- ALWAYS use extractFinancialData when users mention specific amounts like "I earn 3000€" or "My rent is 800€"
- Be aggressive in detecting financial information - any mention of money should trigger extraction
- Show users exactly what was saved to their profile after extraction
- Be conversational and supportive - many users struggle with debt and need encouragement`,
});

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
    console.log("🔍 DEBUG - Creating new thread with message:", { role: "user", content: message });
    const response = await thread.generateText({
      messages: [
        { role: "user", content: message }
      ],
    });
    console.log("🔍 DEBUG - Generated response:", response.text);
    
    // The generateText should automatically save the assistant response
    // But let's ensure it's saved with correct format
    console.log("Generated response:", response.text);

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
    console.log("🔍 DEBUG - Continue thread with message:", { role: "user", content: message });
    const response = await thread.generateText({
      messages: [
        { role: "user", content: message }
      ],
    });
    console.log("🔍 DEBUG - Generated response:", response.text);
    
    // The generateText should automatically save the assistant response
    console.log("Generated response:", response.text);

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