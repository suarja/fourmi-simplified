import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

// Tool to set active project in current conversation thread
export const setActiveProjectTool = createTool({
  description: "Set the active project for the current conversation thread. This will switch the UI to project canvas mode.",
  args: z.object({
    projectId: z.string().describe("The ID of the project to set as active"),
    threadId: z.string().describe("The current thread ID"),
  }),
  handler: async (ctx, { projectId, threadId }) => {
    try {
      // First ensure conversation exists for this thread
      const userProfile = await ctx.runQuery(api.profiles.getUserProfile);
      if (!userProfile) {
        throw new Error("User profile not found");
      }

      // Create/update conversation record
      await ctx.runMutation(api.conversations.upsertConversation, {
        profileId: userProfile._id as Id<"profiles">,
        threadId,
        title: "Financial Chat", // Will be updated by title agent
      });

      // Set the active project
      await ctx.runMutation(api.conversations.setActiveProjectByThread, {
        threadId,
        projectId: projectId as Id<"projects">,
      });

      return {
        success: true,
        message: "Project set as active. The UI will now show the project analysis.",
      };
    } catch (error) {
      console.error("Error setting active project:", error);
      return {
        success: false,
        message: "Failed to set active project",
      };
    }
  },
});

// Tool to clear active project (return to dashboard)
export const clearActiveProjectTool = createTool({
  description: "Clear the active project for the current conversation thread. This will switch the UI back to dashboard mode.",
  args: z.object({
    threadId: z.string().describe("The current thread ID"),
  }),
  handler: async (ctx, { threadId }) => {
    try {
      await ctx.runMutation(api.conversations.setActiveProjectByThread, {
        threadId,
        projectId: undefined,
      });

      return {
        success: true,
        message: "Returned to dashboard view.",
      };
    } catch (error) {
      console.error("Error clearing active project:", error);
      return {
        success: false,
        message: "Failed to clear active project",
      };
    }
  },
});