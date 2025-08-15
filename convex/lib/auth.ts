/**
 * Clerk authentication helper for Convex
 * Provides a drop-in replacement for @convex-dev/auth getAuthUserId
 */

import { GenericQueryCtx, GenericMutationCtx, GenericActionCtx } from "convex/server";
import { DataModel } from "../_generated/dataModel";

type AuthContext = GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel> | GenericActionCtx<DataModel>;

/**
 * Get the authenticated user ID from Clerk JWT token
 * Returns null if user is not authenticated
 * 
 * This function provides the same interface as @convex-dev/auth getAuthUserId
 * but works with Clerk authentication instead.
 */
export async function getAuthUserId(ctx: AuthContext): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject ?? null;
}

/**
 * Get the full user identity from Clerk JWT token
 * Returns null if user is not authenticated
 */
export async function getAuthUserIdentity(ctx: AuthContext) {
  return await ctx.auth.getUserIdentity();
}