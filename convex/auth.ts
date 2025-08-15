import { query } from "./_generated/server";
import { getAuthUserId } from "./lib/auth";

export const loggedInUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    
    // Find the profile associated with this Clerk user ID
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    return profile;
  },
});
