import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Query to get all projects for a profile
export const listProjects = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, { profileId }) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_profile", (q) => q.eq("profileId", profileId))
      .order("desc")
      .collect();
    
    return projects;
  },
});

// Query to get a specific project
export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    return project;
  },
});

// Query to get projects by type
export const getProjectsByType = query({
  args: { 
    profileId: v.id("profiles"),
    type: v.union(
      v.literal("debt_consolidation"),
      v.literal("debt_payoff_strategy"), 
      v.literal("rent_vs_buy")
    )
  },
  handler: async (ctx, { profileId, type }) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_profile", (q) => q.eq("profileId", profileId))
      .filter((q) => q.eq(q.field("type"), type))
      .order("desc")
      .collect();
    
    return projects;
  },
});

// Query to get recently created projects (for auto-activation)
export const getRecentProjects = query({
  args: { 
    profileId: v.id("profiles"),
    maxAgeSeconds: v.number()
  },
  handler: async (ctx, { profileId, maxAgeSeconds }) => {
    const cutoffTime = Date.now() - (maxAgeSeconds * 1000);
    
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_profile", (q) => q.eq("profileId", profileId))
      .filter((q) => q.gte(q.field("created"), cutoffTime))
      .order("desc")
      .collect();
    
    return projects;
  },
});

// Mutation to create a new project
export const createProject = mutation({
  args: {
    profileId: v.id("profiles"),
    type: v.union(
      v.literal("debt_consolidation"),
      v.literal("debt_payoff_strategy"),
      v.literal("rent_vs_buy")
    ),
    name: v.string(),
    inputs: v.any(),
    results: v.optional(v.any()),
    status: v.optional(v.union(v.literal("draft"), v.literal("active"), v.literal("completed"))),
    state: v.optional(v.union(v.literal("FRESH"), v.literal("STALE"), v.literal("NEEDS_DATA"))),
  },
  handler: async (ctx, { profileId, type, name, inputs, results, status = "active", state = "NEEDS_DATA" }) => {
    const now = Date.now();
    
    const projectId = await ctx.db.insert("projects", {
      profileId,
      type,
      name,
      status,
      inputs,
      results,
      state,
      created: now,
      updated: now,
    });
    
    return projectId;
  },
});

// Mutation to update a project
export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    updates: v.object({
      name: v.optional(v.string()),
      status: v.optional(v.union(v.literal("draft"), v.literal("active"), v.literal("completed"))),
      inputs: v.optional(v.any()),
      results: v.optional(v.any()),
      state: v.optional(v.union(v.literal("FRESH"), v.literal("STALE"), v.literal("NEEDS_DATA"))),
    }),
  },
  handler: async (ctx, { projectId, updates }) => {
    const now = Date.now();
    
    await ctx.db.patch(projectId, {
      ...updates,
      updated: now,
    });
    
    return projectId;
  },
});

// Mutation to delete a project
export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await ctx.db.delete(projectId);
    return { success: true };
  },
});

// Mutation to set active project in conversation
export const setActiveProject = mutation({
  args: {
    conversationId: v.id("conversations"),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, { conversationId, projectId }) => {
    await ctx.db.patch(conversationId, {
      activeProjectId: projectId,
    });
    
    return { success: true };
  },
});

// Query to get active project for a conversation
export const getActiveProject = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    const conversation = await ctx.db.get(conversationId);
    
    if (!conversation?.activeProjectId) {
      return null;
    }
    
    const project = await ctx.db.get(conversation.activeProjectId);
    return project;
  },
});