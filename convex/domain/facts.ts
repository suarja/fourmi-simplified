import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../_generated/dataModel";
import { 
  isDuplicateIncome, 
  isDuplicateExpense, 
  isDuplicateLoan,
  findPotentialDuplicateIncome,
  validateAmount,
  validateInterestRate,
  validateLoanMonths
} from "../lib/validation";
import { calculateConfidence } from "../lib/extraction";

/**
 * Create a pending fact for user validation
 */
export const createPendingFact = mutation({
  args: {
    profileId: v.id("profiles"),
    conversationId: v.id("conversations"),
    type: v.union(v.literal("income"), v.literal("expense"), v.literal("loan")),
    data: v.any(),
    extractedFrom: v.string(),
    confidence: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify profile belongs to user
    const profile = await ctx.db.get(args.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found or access denied");
    }

    // Check for duplicates and determine suggested action
    let suggestedAction: "add" | "update" | "skip" = "add";
    let similarExistingId: string | undefined;
    let finalConfidence = args.confidence || 0.5;

    if (args.type === "income") {
      const existingIncomes = await ctx.db
        .query("incomes")
        .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
        .collect();

      if (isDuplicateIncome(args.data, existingIncomes)) {
        suggestedAction = "skip";
        finalConfidence = 0.9; // High confidence it's a duplicate
      } else {
        const similar = findPotentialDuplicateIncome(args.data, existingIncomes);
        if (similar) {
          suggestedAction = "update";
          similarExistingId = similar._id;
          finalConfidence = 0.7;
        }
      }
    } else if (args.type === "expense") {
      const existingExpenses = await ctx.db
        .query("expenses")
        .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
        .collect();

      if (isDuplicateExpense(args.data, existingExpenses)) {
        suggestedAction = "skip";
        finalConfidence = 0.9;
      }
    } else if (args.type === "loan") {
      const existingLoans = await ctx.db
        .query("loans")
        .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
        .collect();

      if (isDuplicateLoan(args.data, existingLoans)) {
        suggestedAction = "skip";
        finalConfidence = 0.9;
      }
    }

    // Calculate final confidence if not provided
    if (!args.confidence) {
      finalConfidence = calculateConfidence(args.data);
    }

    return await ctx.db.insert("pendingFacts", {
      profileId: args.profileId,
      conversationId: args.conversationId,
      type: args.type,
      data: args.data,
      confidence: finalConfidence,
      extractedFrom: args.extractedFrom,
      suggestedAction,
      similarExistingId,
      status: "pending",
      created: Date.now(),
    });
  },
});

/**
 * Get pending facts for a profile
 */
export const getPendingFacts = query({
  args: {
    profileId: v.id("profiles"),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify profile belongs to user
    const profile = await ctx.db.get(args.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Profile not found or access denied");
    }

    let query = ctx.db
      .query("pendingFacts")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .filter((q) => q.eq(q.field("status"), "pending"));

    if (args.conversationId) {
      const facts = await query.collect();
      return facts.filter(f => f.conversationId === args.conversationId);
    }

    return await query.collect();
  },
});

/**
 * Confirm a pending fact and add it to the database
 */
export const confirmPendingFact = mutation({
  args: {
    factId: v.id("pendingFacts"),
    data: v.optional(v.any()), // Allow user to modify data before confirming
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const fact = await ctx.db.get(args.factId);
    if (!fact) throw new Error("Fact not found");

    // Verify profile belongs to user
    const profile = await ctx.db.get(fact.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Access denied");
    }

    // Use provided data or original data
    const finalData = args.data || fact.data;

    // Validate data before adding
    if (fact.type === "income") {
      const validation = validateAmount(finalData.amount);
      if (!validation.valid) throw new Error(validation.error);

      await ctx.db.insert("incomes", {
        profileId: fact.profileId,
        label: finalData.label,
        amount: Math.round(finalData.amount * 100), // Convert to cents
        isMonthly: finalData.isMonthly,
      });
    } else if (fact.type === "expense") {
      const validation = validateAmount(finalData.amount);
      if (!validation.valid) throw new Error(validation.error);

      await ctx.db.insert("expenses", {
        profileId: fact.profileId,
        category: finalData.category,
        label: finalData.label,
        amount: Math.round(finalData.amount * 100), // Convert to cents
      });
    } else if (fact.type === "loan") {
      const amountValidation = validateAmount(finalData.monthlyPayment);
      if (!amountValidation.valid) throw new Error(amountValidation.error);

      const rateValidation = validateInterestRate(finalData.interestRate);
      if (!rateValidation.valid) throw new Error(rateValidation.error);

      const monthsValidation = validateLoanMonths(finalData.remainingMonths);
      if (!monthsValidation.valid) throw new Error(monthsValidation.error);

      await ctx.db.insert("loans", {
        profileId: fact.profileId,
        type: finalData.type,
        name: finalData.name,
        monthlyPayment: Math.round(finalData.monthlyPayment * 100),
        interestRate: finalData.interestRate,
        remainingBalance: Math.round(finalData.remainingBalance * 100),
        remainingMonths: finalData.remainingMonths,
      });
    }

    // Mark fact as confirmed
    await ctx.db.patch(args.factId, {
      status: "confirmed",
      reviewed: Date.now(),
    });

    return { success: true, type: fact.type };
  },
});

/**
 * Reject a pending fact
 */
export const rejectPendingFact = mutation({
  args: {
    factId: v.id("pendingFacts"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const fact = await ctx.db.get(args.factId);
    if (!fact) throw new Error("Fact not found");

    // Verify profile belongs to user
    const profile = await ctx.db.get(fact.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Access denied");
    }

    // Mark fact as rejected
    await ctx.db.patch(args.factId, {
      status: "rejected",
      reviewed: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Clean up old pending facts (older than 7 days)
 */
export const cleanupOldPendingFacts = mutation({
  args: {},
  handler: async (ctx) => {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    const oldFacts = await ctx.db
      .query("pendingFacts")
      .filter((q) => 
        q.and(
          q.eq(q.field("status"), "pending"),
          q.lt(q.field("created"), sevenDaysAgo)
        )
      )
      .collect();

    for (const fact of oldFacts) {
      await ctx.db.delete(fact._id);
    }

    return { deleted: oldFacts.length };
  },
});