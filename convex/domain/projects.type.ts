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

// Debt Payoff Strategy Types
export const PayoffStrategySchema = z.object({
  strategyName: z.string(),
  description: z.string(),
  totalMonths: z.number(),
  totalInterest: z.number(), // in cents
  totalPrincipal: z.number(), // in cents
  totalAmount: z.number(), // in cents
  monthlyPayment: z.number(), // in cents
  interestSaved: z.number(), // in cents (compared to current strategy)
  payoffOrder: z.array(z.object({
    name: z.string(),
    months: z.number(),
    interestPaid: z.number(), // in cents
  })),
});

export const DebtPayoffInputsSchema = z.object({
  debts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    balance: z.number(), // in cents
    monthlyPayment: z.number(), // in cents
    interestRate: z.number(), // as decimal
  })),
  extraMonthlyPayment: z.optional(z.number().min(0)), // in cents
  monthlyIncome: z.optional(z.number().min(0)), // in cents for DTI calculations
});

export const DebtPayoffResultsSchema = z.object({
  strategies: z.array(PayoffStrategySchema),
  recommendedStrategy: z.string(),
  recommendation: z.string(),
  nextSteps: z.array(z.string()),
  warnings: z.array(z.string()),
  summary: z.object({
    totalDebt: z.number(), // in cents
    currentMonthlyPayment: z.number(), // in cents
    proposedMonthlyPayment: z.number(), // in cents
    maxInterestSavings: z.number(), // in cents
    maxTimeSavings: z.number(), // in months
  }),
});

// Rent vs Buy Types
export const RentVsBuyInputsSchema = z.object({
  // Property details
  propertyPrice: z.number(), // in cents
  downPaymentPercent: z.number().min(0).max(1), // as decimal (0.2 = 20%)
  mortgageRate: z.number().min(0).max(1), // annual rate as decimal
  mortgageTermYears: z.number().min(1).max(50),
  
  // Rent details
  monthlyRent: z.number(), // in cents
  rentIncreaseRate: z.number().min(0).max(1), // annual rate as decimal
  
  // Costs
  propertyTaxRate: z.number().min(0).max(1), // annual rate as decimal
  homeInsurance: z.number(), // annual amount in cents
  maintenanceRate: z.number().min(0).max(1), // annual rate as decimal (% of home value)
  hoaFees: z.optional(z.number().min(0)), // monthly amount in cents
  closingCosts: z.optional(z.number().min(0)), // one-time costs in cents
  
  // Investment assumptions
  homeAppreciationRate: z.number().min(0).max(1), // annual rate as decimal
  investmentReturnRate: z.number().min(0).max(1), // annual rate as decimal for down payment
  
  // Timeline
  timeHorizonYears: z.number().min(1).max(50),
  
  // Context
  monthlyIncome: z.optional(z.number().min(0)), // in cents
});

export const RentVsBuyResultsSchema = z.object({
  buyScenario: z.object({
    totalCost: z.number(), // in cents
    monthlyPayment: z.number(), // in cents (PITI)
    totalInterest: z.number(), // in cents
    totalPrincipal: z.number(), // in cents
    totalMaintenance: z.number(), // in cents
    totalTaxes: z.number(), // in cents
    totalInsurance: z.number(), // in cents
    homeValue: z.number(), // final home value in cents
    equity: z.number(), // final equity in cents
    netCost: z.number(), // total cost minus final equity
  }),
  rentScenario: z.object({
    totalRentPaid: z.number(), // in cents
    averageMonthlyRent: z.number(), // in cents
    downPaymentInvested: z.number(), // investment value of down payment
    totalCost: z.number(), // total rent + opportunity cost
  }),
  comparison: z.object({
    buyingIsBetter: z.boolean(),
    costDifference: z.number(), // in cents (positive = buying costs more)
    breakEvenYears: z.number(), // years until buying becomes cheaper
    monthlyDifference: z.number(), // in cents (buy payment - rent payment)
  }),
  recommendation: z.string(),
  nextSteps: z.array(z.string()),
  warnings: z.array(z.string()),
  assumptions: z.array(z.string()),
});

export type ConsolidationOption = z.infer<typeof ConsolidationOptionSchema>;
export type DebtConsolidationInputs = z.infer<typeof DebtConsolidationInputsSchema>;
export type DebtConsolidationResults = z.infer<typeof DebtConsolidationResultsSchema>;
export type DebtConsolidationToolResponse = z.infer<typeof DebtConsolidationToolResponseSchema>;

export type PayoffStrategy = z.infer<typeof PayoffStrategySchema>;
export type DebtPayoffInputs = z.infer<typeof DebtPayoffInputsSchema>;
export type DebtPayoffResults = z.infer<typeof DebtPayoffResultsSchema>;

export type RentVsBuyInputs = z.infer<typeof RentVsBuyInputsSchema>;
export type RentVsBuyResults = z.infer<typeof RentVsBuyResultsSchema>;