import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "./lib/auth";

// Query to get the latest insights for a profile
export const getLatestInsights = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, { profileId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Verify profile belongs to user
    const profile = await ctx.db.get(profileId);
    if (!profile || profile.userId !== userId) {
      return null;
    }

    // Get the most recent insights that haven't expired
    const insights = await ctx.db
      .query("insights")
      .withIndex("by_profile", (q) => q.eq("profileId", profileId))
      .filter((q) => q.gt(q.field("expiresAt"), Date.now()))
      .order("desc")
      .first();

    return insights;
  },
});

// Mutation to save generated insights
export const saveInsights = mutation({
  args: {
    profileId: v.id("profiles"),
    content: v.string(),
    metadata: v.object({
      generatedBy: v.literal("educational-agent"),
      focusArea: v.optional(v.string()),
      userSophisticationLevel: v.string(),
      financialHealthScore: v.optional(v.number()),
      dataSnapshot: v.object({
        monthlyBalance: v.number(),
        debtToIncomeRatio: v.number(),
        hasIncomes: v.boolean(),
        hasExpenses: v.boolean(),
        hasLoans: v.boolean(),
      }),
    }),
    expirationHours: v.optional(v.number()), // Default 24 hours
  },
  handler: async (ctx, { profileId, content, metadata, expirationHours = 24 }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify profile belongs to user
    const profile = await ctx.db.get(profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found or access denied");
    }

    // Calculate expiration time
    const expiresAt = Date.now() + (expirationHours * 60 * 60 * 1000);

    // Save insights
    const insightId = await ctx.db.insert("insights", {
      profileId,
      userId,
      content,
      metadata,
      createdAt: Date.now(),
      expiresAt,
      isActive: true,
    });

    return insightId;
  },
});

// Mutation to mark insights as outdated (when financial data changes significantly)
export const invalidateInsights = mutation({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, { profileId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Verify profile belongs to user
    const profile = await ctx.db.get(profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found or access denied");
    }

    // Mark all active insights as inactive
    const activeInsights = await ctx.db
      .query("insights")
      .withIndex("by_profile", (q) => q.eq("profileId", profileId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const insight of activeInsights) {
      await ctx.db.patch(insight._id, { isActive: false });
    }

    return { invalidated: activeInsights.length };
  },
});

// Query to get insights history for debugging/analytics
export const getInsightsHistory = query({
  args: { 
    profileId: v.id("profiles"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { profileId, limit = 10 }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Verify profile belongs to user
    const profile = await ctx.db.get(profileId);
    if (!profile || profile.userId !== userId) {
      return [];
    }

    const insights = await ctx.db
      .query("insights")
      .withIndex("by_profile", (q) => q.eq("profileId", profileId))
      .order("desc")
      .take(limit);

    return insights.map(insight => ({
      _id: insight._id,
      createdAt: insight.createdAt,
      expiresAt: insight.expiresAt,
      isActive: insight.isActive,
      metadata: insight.metadata,
      contentPreview: insight.content.substring(0, 100) + "...",
    }));
  },
});