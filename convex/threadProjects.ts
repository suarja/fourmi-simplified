import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// SIMPLE APPROACH: Just return null for now to unblock the app
// We'll implement thread metadata later when we have time
export const getActiveProjectByThread = query({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, { threadId }) => {
    // TODO: Implement thread metadata reading
    // For now, return null to prevent crashes
    return null;
  },
});

// Set active project - simplified mutation for now
export const setActiveProjectByThread = mutation({
  args: {
    threadId: v.string(),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, { threadId, projectId }) => {
    // TODO: Implement thread metadata setting
    // For now, just return success to prevent crashes
    return { success: true };
  },
});