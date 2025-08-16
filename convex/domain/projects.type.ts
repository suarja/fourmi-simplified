import { z } from "zod";

// Project Types
export type ProjectType = "debt_consolidation" | "debt_payoff_strategy" | "rent_vs_buy";
export type ProjectStatus = "draft" | "active" | "completed";
export type ProjectState = "FRESH" | "STALE" | "NEEDS_DATA";

// Debt Consolidation Types
export const ConsolidationOptionSchema = z.object({
  type: z.enum(["personal_loan", "balance_transfer", "heloc"]),
  rate: z.number().min(0).max(1), // Annual interest rate as decimal (0.05 = 5%)
  term: z.number().min(1).max(360), // Term in months
  fees: z.number().min(0), // Upfront fees in cents
  maxAmount: z.optional(z.number().min(0)), // Maximum loan amount in cents
});

export const DebtConsolidationInputsSchema = z.object({
  existingDebts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    balance: z.number(), // in cents
    monthlyPayment: z.number(), // in cents
    interestRate: z.number(), // as decimal
  })),
  consolidationOptions: z.array(ConsolidationOptionSchema),
  monthlyIncome: z.number(), // in cents
  creditScore: z.optional(z.number().min(300).max(850)),
});

export const DebtConsolidationResultsSchema = z.object({
  totalCurrentDebt: z.number(), // in cents
  totalCurrentPayment: z.number(), // in cents
  totalCurrentInterest: z.number(), // total interest over life of loans in cents
  consolidationComparison: z.array(z.object({
    type: z.enum(["personal_loan", "balance_transfer", "heloc"]),
    eligible: z.boolean(),
    newMonthlyPayment: z.number(), // in cents
    totalInterest: z.number(), // in cents
    monthsSaved: z.number(),
    totalSavings: z.number(), // in cents
    details: z.object({
      rate: z.number(),
      term: z.number(),
      fees: z.number(),
    }),
  })),
  recommendation: z.string(),
  nextSteps: z.array(z.string()),
  warnings: z.array(z.string()),
});

export const DebtConsolidationToolResponseSchema = z.object({
  success: z.boolean(),
  projectId: z.optional(z.string()),
  message: z.string(),
  projectCreated: z.boolean(),
  needsMoreInfo: z.boolean(),
  missingInfo: z.optional(z.array(z.string())),
});

export type ConsolidationOption = z.infer<typeof ConsolidationOptionSchema>;
export type DebtConsolidationInputs = z.infer<typeof DebtConsolidationInputsSchema>;
export type DebtConsolidationResults = z.infer<typeof DebtConsolidationResultsSchema>;
export type DebtConsolidationToolResponse = z.infer<typeof DebtConsolidationToolResponseSchema>;