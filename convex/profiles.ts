import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./lib/auth";

export const createProfile = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("solo"), v.literal("couple")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Check if user already has a profile
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      throw new Error("User already has a profile");
    }

    const profileId = await ctx.db.insert("profiles", {
      userId,
      name: args.name,
      type: args.type,
      created: Date.now(),
    });

    return profileId;
  },
});

export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return profile;
  },
});

export const addIncome = mutation({
  args: {
    profileId: v.id("profiles"),
    label: v.string(),
    amount: v.number(),
    isMonthly: v.boolean(),
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

    return await ctx.db.insert("incomes", {
      profileId: args.profileId,
      label: args.label,
      amount: Math.round(args.amount * 100), // Convert to cents
      isMonthly: args.isMonthly,
    });
  },
});

export const addExpense = mutation({
  args: {
    profileId: v.id("profiles"),
    category: v.string(),
    label: v.string(),
    amount: v.number(),
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

    return await ctx.db.insert("expenses", {
      profileId: args.profileId,
      category: args.category,
      label: args.label,
      amount: Math.round(args.amount * 100), // Convert to cents
    });
  },
});

export const addLoan = mutation({
  args: {
    profileId: v.id("profiles"),
    type: v.union(
      v.literal("credit_card"),
      v.literal("personal"),
      v.literal("mortgage"),
      v.literal("auto")
    ),
    name: v.string(),
    monthlyPayment: v.number(),
    interestRate: v.number(),
    remainingBalance: v.number(),
    remainingMonths: v.number(),
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

    return await ctx.db.insert("loans", {
      profileId: args.profileId,
      type: args.type,
      name: args.name,
      monthlyPayment: Math.round(args.monthlyPayment * 100), // Convert to cents
      interestRate: args.interestRate,
      remainingBalance: Math.round(args.remainingBalance * 100), // Convert to cents
      remainingMonths: args.remainingMonths,
    });
  },
});

export const getFinancialData = query({
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

    const [incomes, expenses, loans] = await Promise.all([
      ctx.db
        .query("incomes")
        .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
        .collect(),
      ctx.db
        .query("expenses")
        .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
        .collect(),
      ctx.db
        .query("loans")
        .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
        .collect(),
    ]);

    return { profile, incomes, expenses, loans };
  },
});

export const getMonthlyBalance = query({
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

    const [incomes, expenses, loans] = await Promise.all([
      ctx.db
        .query("incomes")
        .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
        .collect(),
      ctx.db
        .query("expenses")
        .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
        .collect(),
      ctx.db
        .query("loans")
        .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
        .collect(),
    ]);

    // Calculate monthly income (convert annual to monthly)
    const monthlyIncome = incomes.reduce((total, income) => {
      const monthlyAmount = income.isMonthly ? income.amount : income.amount / 12;
      return total + monthlyAmount;
    }, 0);

    // Calculate monthly expenses
    const monthlyExpenses = expenses.reduce((total, expense) => {
      return total + expense.amount;
    }, 0);

    // Calculate monthly loan payments
    const monthlyLoanPayments = loans.reduce((total, loan) => {
      return total + loan.monthlyPayment;
    }, 0);

    const balance = monthlyIncome - monthlyExpenses - monthlyLoanPayments;

    return {
      monthlyIncome: monthlyIncome / 100, // Convert back to euros
      monthlyExpenses: monthlyExpenses / 100,
      monthlyLoanPayments: monthlyLoanPayments / 100,
      balance: balance / 100,
      isPositive: balance > 0,
    };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});
