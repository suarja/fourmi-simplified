 import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createConversation = mutation({
  args: {
    profileId: v.id("profiles"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify profile belongs to user
    const profile = await ctx.db.get(args.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found or access denied");
    }

    const conversationId = await ctx.db.insert("conversations", {
      profileId: args.profileId,
      title: args.title,
      created: Date.now(),
      lastMessage: Date.now(),
      // agentThreadId will be created when first message is sent
    });

    return conversationId;
  },
});

export const getConversations = query({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify profile belongs to user
    const profile = await ctx.db.get(args.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found or access denied");
    }

    return await ctx.db
      .query("conversations")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .order("desc")
      .collect();
  },
});

export const addMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    type: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify conversation belongs to user
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const profile = await ctx.db.get(conversation.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Access denied");
    }

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      type: args.type,
      content: args.content,
      timestamp: Date.now(),
    });

    // Update conversation last message time
    await ctx.db.patch(args.conversationId, {
      lastMessage: Date.now(),
    });

    return messageId;
  },
});

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify conversation belongs to user
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const profile = await ctx.db.get(conversation.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Access denied");
    }

    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();
  },
});

export const getConversation = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const profile = await ctx.db.get(conversation.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Access denied");
    }

    return conversation;
  },
});

export const updateConversationThread = mutation({
  args: {
    conversationId: v.id("conversations"),
    agentThreadId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const profile = await ctx.db.get(conversation.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(args.conversationId, {
      agentThreadId: args.agentThreadId,
    });
  },
});

export const updateLastMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const profile = await ctx.db.get(conversation.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(args.conversationId, {
      lastMessage: Date.now(),
    });
  },
});

// Legacy conversation system - now only used for organization
// Agent threads handle the actual conversation flow
