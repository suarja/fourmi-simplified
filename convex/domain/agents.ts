"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { getAuthUserId } from "../lib/auth";

import { z } from "zod";
import { titleAgent } from "../agents/title";
import { financialAgent } from "../agents/finance";
import { educationalInsightsAgent } from "../agents/educationalInsights";



// Action to start a conversation - Uses the existing agent
export const startFinancialConversation = action({
  args: {
    profileId: v.id("profiles"),
    message: v.string(),
  },
  handler: async (
    ctx,
    { profileId, message }: { profileId: string; message: string }
  ): Promise<{
    threadId: string;
    response: string;
    profileId: string;
    threadTitle: string;
  }> => {
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
      messages: [{ role: "user", content: message }],
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

    // Auto-detection: If response mentions a project was created, set it as active
    try {
      // Check if any projects were created recently (within last 10 seconds)
      const recentProjects = await ctx.runQuery(api.projects.getRecentProjects, {
        profileId: profileId,
        maxAgeSeconds: 10,
      });
      
      if (recentProjects.length > 0) {
        // Set the most recent project as active
        const latestProject = recentProjects[0];
        await ctx.runMutation(api.conversations.setActiveProjectByThread, {
          threadId,
          projectId: latestProject._id,
        });
        
        console.log(`🚀 Auto-activated project: ${latestProject.name} (${latestProject._id})`);
      }
    } catch (error) {
      console.error("Error in auto-detection:", error);
      // Don't fail the entire request if auto-detection fails
    }

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

// Action to generate educational insights using the specialized agent
export const generateEducationalInsights = action({
  args: {
    profileId: v.id("profiles"),
    focusArea: v.optional(v.string()), // Optional focus area (debt, budgeting, saving, investing)
  },
  handler: async (
    ctx,
    args: { profileId: string; focusArea?: string }
  ): Promise<{
    insights: string;
    timestamp: number;
    profileId: string;
    cached: boolean;
    expiresAt: number;
  }> => {
    const { profileId, focusArea } = args;
    // Authentication check
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify profile belongs to user
    const profile = await ctx.runQuery(api.profiles.getUserProfile);
    if (!profile || profile.userId !== userId || profile._id !== profileId) {
      throw new Error("Profile not found or access denied");
    }

    try {
      console.log("🧠 Generating new educational insights for profile:", profileId);
      
      // Use the educational insights agent for specialized insights generation
      const { thread } = await educationalInsightsAgent.createThread(ctx, {
        userId: userId,
        title: "Educational Insights",
        summary: "Generating personalized financial education content",
      });

      console.log("📝 Created educational agent thread:", thread.threadId);

      // Generate comprehensive educational insights using educational agent
      const prompt = focusArea 
        ? `Generate educational insights focused on ${focusArea}. 

IMPORTANT: Follow these steps exactly:
1. Use your tools to gather my financial context and assess my literacy level
2. After using tools, provide a comprehensive written response with personalized educational insights
3. Focus on being educational, actionable, and guilt-free
4. Include specific next steps I can take

I need actual written insights, not just tool calls. Please provide detailed, encouraging guidance based on my financial situation.`
        : `Generate personalized educational insights for my financial situation.

IMPORTANT: Follow these steps exactly:
1. Use gatherFinancialContext and assessFinancialLiteracy tools to understand my situation
2. After gathering context, provide a comprehensive written response with educational insights
3. Focus on being encouraging, actionable, and educational
4. Remove any guilt and focus on next steps
5. Include specific action items I can implement

I need actual written insights, not just tool calls. Please provide detailed, personalized guidance based on my complete financial picture.`;

      console.log("💬 Sending prompt to agent:", prompt.substring(0, 100) + "...");

      // First, let the agent gather context with tools
      const initialResponse = await thread.generateText({
        messages: [{ role: "user", content: prompt }],
        maxSteps: 5, // Allow tool calls
      });

      console.log("🔧 Tool gathering phase completed, finishReason:", initialResponse.finishReason);

      let response;
      
      // If the agent only made tool calls, prompt it to provide insights
      if (initialResponse.finishReason === 'tool-calls' && (!initialResponse.text || initialResponse.text.trim().length === 0)) {
        console.log("🔄 Agent made tool calls but no insights. Prompting for written response...");
        
        response = await thread.generateText({
          messages: [{ 
            role: "user", 
            content: "Based on the financial context you just gathered, please provide comprehensive written educational insights. I need detailed, personalized guidance about my financial situation - not just tool calls. Write a thorough response with specific recommendations and next steps." 
          }],
          maxSteps: 3, // Limit to prevent infinite loops
        });
      } else {
        response = initialResponse;
      }

      // Clean up the thread after use
      await educationalInsightsAgent.deleteThreadAsync(ctx, { threadId: thread.threadId });

      // Log detailed response information for debugging
      console.log("🔍 Response details:", {
        hasText: !!response.text,
        textLength: response.text?.length || 0,
        finishReason: response.finishReason,
        toolCallsCount: response.toolCalls?.length || 0,
        toolResultsCount: response.toolResults?.length || 0,
      });

      // Validate response
      if (!response || !response.text || response.text.trim().length === 0) {
        console.error("❌ Agent returned empty response:", response);
        console.error("❌ Tool calls:", response.toolCalls);
        console.error("❌ Tool results:", response.toolResults);
        throw new Error("The educational agent called tools but didn't provide written insights. This is a configuration issue - please try again or contact support.");
      }

      console.log(`✅ Educational insights generated successfully (${response.text.length} characters)`);

      // Get financial data for metadata
      const financialData = await ctx.runQuery(api.profiles.getFinancialData, {
        profileId: profileId as Id<"profiles">,
      });

      // Calculate financial metrics for metadata
      const { incomes, expenses, loans } = financialData;
      const totalMonthlyIncome = incomes.reduce((sum: number, income: any) => {
        return sum + (income.isMonthly ? income.amount : income.amount / 12);
      }, 0);
      const totalMonthlyExpenses = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
      const totalMonthlyLoanPayments = loans.reduce((sum: number, loan: any) => sum + loan.monthlyPayment, 0);
      const monthlyBalance = totalMonthlyIncome - totalMonthlyExpenses - totalMonthlyLoanPayments;
      const debtToIncomeRatio = totalMonthlyIncome > 0 ? (totalMonthlyLoanPayments / totalMonthlyIncome) * 100 : 0;

      // Determine sophistication level
      const sophisticationLevel = (() => {
        let score = 0;
        if (incomes.length > 0) score += 1;
        if (expenses.length > 0) score += 1;
        if (loans.length > 0) score += 1;
        if (monthlyBalance > 0) score += 2;
        if (debtToIncomeRatio < 30) score += 2;
        if (score <= 3) return "beginner";
        if (score <= 6) return "intermediate";
        return "advanced";
      })();

      // Save insights to database
      await ctx.runMutation(api.insights.saveInsights, {
        profileId: profileId as Id<"profiles">,
        content: response.text,
        metadata: {
          generatedBy: "educational-agent" as const,
          focusArea: focusArea,
          userSophisticationLevel: sophisticationLevel,
          dataSnapshot: {
            monthlyBalance: monthlyBalance / 100, // Convert to euros
            debtToIncomeRatio: Math.round(debtToIncomeRatio * 100) / 100,
            hasIncomes: incomes.length > 0,
            hasExpenses: expenses.length > 0,
            hasLoans: loans.length > 0,
          },
        },
      });

      const timestamp = Date.now();
      return {
        insights: response.text,
        timestamp,
        profileId: profileId,
        cached: false,
        expiresAt: timestamp + (24 * 60 * 60 * 1000) // 24 hours from now
      };
    } catch (error) {
      console.error("❌ Error generating educational insights:", error);
      
      // Return more specific error messages
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes("Profile not found")) {
        throw new Error("Please ensure your profile is set up correctly.");
      } else if (errorMessage.includes("financial data")) {
        throw new Error("I need some financial information to generate insights. Please add some income, expenses, or loans first.");
      } else if (errorMessage.includes("Agent is not defined") || errorMessage.includes("educationalInsightsAgent")) {
        throw new Error("Educational insights service is temporarily unavailable. Please try again in a moment.");
      } else if (errorMessage.includes("empty response") || errorMessage.includes("didn't generate")) {
        throw new Error("I couldn't generate insights right now. This might be due to insufficient financial data or a temporary service issue. Please try again.");
      } else {
        throw new Error("I'm having trouble generating insights right now. Please try again in a moment.");
      }
    }
  },
});

// Action to generate conversation starters based on user's financial state
export const generateConversationStarters = action({
  args: {
    profileId: v.id("profiles"),
    maxSuggestions: v.optional(v.number()),
    focusArea: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { profileId, maxSuggestions = 4, focusArea }
  ): Promise<{
    suggestions: string;
    timestamp: number;
    profileId: string;
  }> => {
    // Authentication check
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify profile belongs to user
    const profile = await ctx.runQuery(api.profiles.getUserProfile);
    if (!profile || profile.userId !== userId || profile._id !== profileId) {
      throw new Error("Profile not found or access denied");
    }

    try {
      // Create a single-use thread for conversation starters using educational agent
      const { thread } = await educationalInsightsAgent.createThread(ctx, {
        userId: userId,
        title: "Conversation Starters",
        summary: "Generating personalized conversation starters",
      });

      // Generate conversation starters using the agent's tools
      const prompt = `Generate ${maxSuggestions} personalized conversation starters for this user based on their financial situation${focusArea ? ` with focus on ${focusArea}` : ''}. Use the generateConversationStarters tool to create contextually relevant suggestions that will help them learn and improve their financial situation.`;

      const response = await thread.generateText({
        messages: [{ role: "user", content: prompt }],
      });

      // Clean up the thread after use
      await educationalInsightsAgent.deleteThreadAsync(ctx, { threadId: thread.threadId });

      return {
        suggestions: response.text,
        timestamp: Date.now(),
        profileId: profileId,
      };
    } catch (error) {
      console.error("Error generating conversation starters:", error);
      throw new Error("Failed to generate conversation starters. Please try again.");
    }
  },
});