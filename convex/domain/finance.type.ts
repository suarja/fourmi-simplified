import { z } from "zod";

// Exact same schema as the original system
export const FinancialDataSchema = z.object({
    incomes: z.array(z.object({
      label: z.string(),
      amount: z.number(),
      isMonthly: z.boolean(),
    })),
    expenses: z.array(z.object({
      category: z.enum(["Housing", "Food", "Transport", "Utilities", "Entertainment", "Healthcare", "Other"]),
      label: z.string(),
      amount: z.number(),
    })),
    loans: z.array(z.object({
      type: z.enum(["credit_card", "personal", "mortgage", "auto"]),
      name: z.string(),
      monthlyPayment: z.number(),
      interestRate: z.number(),
      remainingBalance: z.number(),
      remainingMonths: z.number(),
    })),
    summary: z.string(),
  });



export type FinancialData = z.infer<typeof FinancialDataSchema>;

export const ExtractFinancialDataSchemaReturnType = z.object({
  success: z.boolean(),
  message: z.string(),
  itemsProcessed: z.object({
    incomes: z.number(),
    expenses: z.number(),
    loans: z.number(),
  }),
});

export type ExtractFinancialDataSchemaReturnType = z.infer<typeof ExtractFinancialDataSchemaReturnType>;

export const GetFinancialSummarySchemaReturnType = z.object({
  summary: z.string(),
});

export type GetFinancialSummarySchemaReturnType = z.infer<typeof GetFinancialSummarySchemaReturnType>;

export const GenerateFinancialAdviceSchemaReturnType = z.object({
  advice: z.string(),
});

export type GenerateFinancialAdviceSchemaReturnType = z.infer<typeof GenerateFinancialAdviceSchemaReturnType>;