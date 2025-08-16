import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Get conversation by thread ID
export const getConversationByThread = query({
  args: { threadId: v.string() },
  handler: async (ctx, { threadId }) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_agent_thread", (q) => q.eq("agentThreadId", threadId))
      .first();
    
    return conversation;
  },
});

// Create or update conversation with thread context
export const upsertConversation = mutation({
  args: {
    profileId: v.id("profiles"),
    threadId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, { profileId, threadId, title }) => {
    const now = Date.now();
    
    // Check if conversation already exists
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_agent_thread", (q) => q.eq("agentThreadId", threadId))
      .first();
    
    if (existing) {
      // Update existing conversation
      await ctx.db.patch(existing._id, {
        title,
        lastMessage: now,
      });
      return existing._id;
    } else {
      // Create new conversation
      const conversationId = await ctx.db.insert("conversations", {
        profileId,
        title,
        created: now,
        lastMessage: now,
        agentThreadId: threadId,
      });
      return conversationId;
    }
  },
});

// Set active project for a conversation (by thread ID)
export const setActiveProjectByThread = mutation({
  args: {
    threadId: v.string(),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, { threadId, projectId }) => {
    // Find conversation by thread ID
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_agent_thread", (q) => q.eq("agentThreadId", threadId))
      .first();
    
    if (conversation) {
      await ctx.db.patch(conversation._id, {
        activeProjectId: projectId,
      });
      return { success: true, conversationId: conversation._id };
    } else {
      throw new Error("Conversation not found for thread ID");
    }
  },
});

// Get active project for a thread
export const getActiveProjectByThread = query({
  args: { threadId: v.string() },
  handler: async (ctx, { threadId }) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_agent_thread", (q) => q.eq("agentThreadId", threadId))
      .first();
    
    if (!conversation?.activeProjectId) {
      return null;
    }
    
    const project = await ctx.db.get(conversation.activeProjectId);
    return project;
  },
});