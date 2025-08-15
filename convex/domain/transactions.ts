import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { validateAmount, validateInterestRate, validateLoanMonths } from "../lib/validation";

/**
 * Edit an income entry
 */
export const editIncome = mutation({
  args: {
    incomeId: v.id("incomes"),
    label: v.optional(v.string()),
    amount: v.optional(v.number()), // In euros, will be converted to cents
    isMonthly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const income = await ctx.db.get(args.incomeId);
    if (!income) throw new Error("Income not found");

    // Verify profile belongs to user
    const profile = await ctx.db.get(income.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Access denied");
    }

    const updates: any = {};
    
    if (args.label !== undefined) {
      updates.label = args.label;
    }
    
    if (args.amount !== undefined) {
      const validation = validateAmount(args.amount);
      if (!validation.valid) throw new Error(validation.error);
      updates.amount = Math.round(args.amount * 100); // Convert to cents
    }
    
    if (args.isMonthly !== undefined) {
      updates.isMonthly = args.isMonthly;
    }

    await ctx.db.patch(args.incomeId, updates);
    return { success: true };
  },
});

/**
 * Delete an income entry
 */
export const deleteIncome = mutation({
  args: {
    incomeId: v.id("incomes"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const income = await ctx.db.get(args.incomeId);
    if (!income) throw new Error("Income not found");

    // Verify profile belongs to user
    const profile = await ctx.db.get(income.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(args.incomeId);
    return { success: true };
  },
});

/**
 * Edit an expense entry
 */
export const editExpense = mutation({
  args: {
    expenseId: v.id("expenses"),
    category: v.optional(v.string()),
    label: v.optional(v.string()),
    amount: v.optional(v.number()), // In euros
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const expense = await ctx.db.get(args.expenseId);
    if (!expense) throw new Error("Expense not found");

    // Verify profile belongs to user
    const profile = await ctx.db.get(expense.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Access denied");
    }

    const updates: any = {};
    
    if (args.category !== undefined) {
      updates.category = args.category;
    }
    
    if (args.label !== undefined) {
      updates.label = args.label;
    }
    
    if (args.amount !== undefined) {
      const validation = validateAmount(args.amount);
      if (!validation.valid) throw new Error(validation.error);
      updates.amount = Math.round(args.amount * 100); // Convert to cents
    }

    await ctx.db.patch(args.expenseId, updates);
    return { success: true };
  },
});

/**
 * Delete an expense entry
 */
export const deleteExpense = mutation({
  args: {
    expenseId: v.id("expenses"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const expense = await ctx.db.get(args.expenseId);
    if (!expense) throw new Error("Expense not found");

    // Verify profile belongs to user
    const profile = await ctx.db.get(expense.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(args.expenseId);
    return { success: true };
  },
});

/**
 * Edit a loan entry
 */
export const editLoan = mutation({
  args: {
    loanId: v.id("loans"),
    type: v.optional(v.union(
      v.literal("credit_card"),
      v.literal("personal"),
      v.literal("mortgage"),
      v.literal("auto")
    )),
    name: v.optional(v.string()),
    monthlyPayment: v.optional(v.number()),
    interestRate: v.optional(v.number()),
    remainingBalance: v.optional(v.number()),
    remainingMonths: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const loan = await ctx.db.get(args.loanId);
    if (!loan) throw new Error("Loan not found");

    // Verify profile belongs to user
    const profile = await ctx.db.get(loan.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Access denied");
    }

    const updates: any = {};
    
    if (args.type !== undefined) {
      updates.type = args.type;
    }
    
    if (args.name !== undefined) {
      updates.name = args.name;
    }
    
    if (args.monthlyPayment !== undefined) {
      const validation = validateAmount(args.monthlyPayment);
      if (!validation.valid) throw new Error(validation.error);
      updates.monthlyPayment = Math.round(args.monthlyPayment * 100);
    }
    
    if (args.interestRate !== undefined) {
      const validation = validateInterestRate(args.interestRate);
      if (!validation.valid) throw new Error(validation.error);
      updates.interestRate = args.interestRate;
    }
    
    if (args.remainingBalance !== undefined) {
      const validation = validateAmount(args.remainingBalance);
      if (!validation.valid) throw new Error(validation.error);
      updates.remainingBalance = Math.round(args.remainingBalance * 100);
    }
    
    if (args.remainingMonths !== undefined) {
      const validation = validateLoanMonths(args.remainingMonths);
      if (!validation.valid) throw new Error(validation.error);
      updates.remainingMonths = args.remainingMonths;
    }

    await ctx.db.patch(args.loanId, updates);
    return { success: true };
  },
});

/**
 * Delete a loan entry
 */
export const deleteLoan = mutation({
  args: {
    loanId: v.id("loans"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const loan = await ctx.db.get(args.loanId);
    if (!loan) throw new Error("Loan not found");

    // Verify profile belongs to user
    const profile = await ctx.db.get(loan.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(args.loanId);
    return { success: true };
  },
});

/**
 * Bulk delete all financial data for a profile (reset)
 */
export const resetFinancialData = mutation({
  args: {
    profileId: v.id("profiles"),
    confirmText: v.string(), // User must type "DELETE ALL" to confirm
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    if (args.confirmText !== "DELETE ALL") {
      throw new Error("Please type 'DELETE ALL' to confirm");
    }

    // Verify profile belongs to user
    const profile = await ctx.db.get(args.profileId);
    if (!profile || profile.userId !== userId) {
      throw new Error("Access denied");
    }

    // Delete all incomes
    const incomes = await ctx.db
      .query("incomes")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();
    
    for (const income of incomes) {
      await ctx.db.delete(income._id);
    }

    // Delete all expenses
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();
    
    for (const expense of expenses) {
      await ctx.db.delete(expense._id);
    }

    // Delete all loans
    const loans = await ctx.db
      .query("loans")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();
    
    for (const loan of loans) {
      await ctx.db.delete(loan._id);
    }

    // Delete all pending facts
    const pendingFacts = await ctx.db
      .query("pendingFacts")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();
    
    for (const fact of pendingFacts) {
      await ctx.db.delete(fact._id);
    }

    return {
      success: true,
      deleted: {
        incomes: incomes.length,
        expenses: expenses.length,
        loans: loans.length,
        pendingFacts: pendingFacts.length,
      }
    };
  },
});