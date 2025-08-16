"use node";

// Educational tools for comprehensive financial context and adaptive learning
// Provides educational content based on user's financial state and sophistication level

import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

// Helper function for gathering financial context (to avoid circular reference)
async function gatherFinancialContextHelper(ctx: any, includeProjects: boolean, includeHealthScore: boolean): Promise<any> {
    const userProfile = await ctx.runQuery(api.profiles.getUserProfile);
    if (!userProfile) {
      throw new Error("User profile not found");
    }

    // Get financial data
    const financialData = await ctx.runQuery(api.profiles.getFinancialData, {
      profileId: userProfile._id as Id<"profiles">,
    });
    const { incomes, expenses, loans } = financialData;

    // Calculate basic financial metrics
    const totalMonthlyIncome = incomes.reduce((sum: number, income: any) => {
      return sum + (income.isMonthly ? income.amount : income.amount / 12);
    }, 0);

    const totalMonthlyExpenses = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
    const totalMonthlyLoanPayments = loans.reduce((sum: number, loan: any) => sum + loan.monthlyPayment, 0);
    const totalDebt = loans.reduce((sum: number, loan: any) => sum + loan.remainingBalance, 0);

    const monthlyBalance = totalMonthlyIncome - totalMonthlyExpenses - totalMonthlyLoanPayments;
    const debtToIncomeRatio = totalMonthlyIncome > 0 ? (totalMonthlyLoanPayments / totalMonthlyIncome) * 100 : 0;

    // Assess financial sophistication level
    const sophisticationLevel = assessFinancialSophistication({
      hasIncomes: incomes.length > 0,
      hasExpenses: expenses.length > 0,
      hasLoans: loans.length > 0,
      hasEmergencyFund: monthlyBalance > 0 && totalMonthlyExpenses > 0,
      debtToIncomeRatio,
      totalDebt: totalDebt / 100, // Convert to euros
    });

    let projects = [];
    if (includeProjects) {
      try {
        projects = await ctx.runQuery(api.projects.listProjects, { profileId: userProfile._id as Id<"profiles"> });
      } catch (error) {
        console.log("Projects not available or error:", error);
      }
    }

    // Calculate financial health score
    let healthScore = null;
    if (includeHealthScore) {
      healthScore = calculateFinancialHealthScore({
        monthlyBalance: monthlyBalance / 100,
        debtToIncomeRatio,
        hasEmergencyFund: monthlyBalance > totalMonthlyExpenses * 3, // 3 months emergency fund
        diversifiedIncome: incomes.length > 1,
        trackingExpenses: expenses.length >= 3,
      });
    }

    return {
      profile: {
        hasData: incomes.length > 0 || expenses.length > 0 || loans.length > 0,
        dataCompleteness: {
          incomes: incomes.length,
          expenses: expenses.length,
          loans: loans.length,
        }
      },
      financialMetrics: {
        totalMonthlyIncome: totalMonthlyIncome / 100, // Convert to euros
        totalMonthlyExpenses: totalMonthlyExpenses / 100,
        totalMonthlyLoanPayments: totalMonthlyLoanPayments / 100,
        monthlyBalance: monthlyBalance / 100,
        totalDebt: totalDebt / 100,
        debtToIncomeRatio: Math.round(debtToIncomeRatio * 100) / 100,
      },
      sophisticationLevel,
      healthScore,
      projects: projects.map((project: any) => ({
        id: project._id,
        name: project.name,
        type: project.type,
        state: project.state,
        created: project.created,
      })),
      contextualInsights: generateContextualInsights({
        monthlyBalance: monthlyBalance / 100,
        debtToIncomeRatio,
        sophisticationLevel,
        hasProjects: projects.length > 0,
        totalDebt: totalDebt / 100,
      })
    };
}

// Tool to gather comprehensive financial context for educational content generation
export const gatherFinancialContextTool: any = createTool({
  description: "Gather comprehensive financial context including profile data, metrics, sophistication level, and health score",
  args: z.object({
    includeProjects: z.boolean().default(true).describe("Whether to include project information"),
    includeHealthScore: z.boolean().default(false).describe("Whether to calculate financial health score"),
  }),
  handler: async (ctx, { includeProjects, includeHealthScore }) => {
    return await gatherFinancialContextHelper(ctx, includeProjects, includeHealthScore);
  },
});

// Tool to generate personalized conversation starters based on financial state
export const generateConversationStartersTool = createTool({
  description: "Generate personalized conversation starters based on user's current financial situation and learning level",
  args: z.object({
    maxSuggestions: z.number().default(4).describe("Maximum number of conversation starters to generate"),
    focusArea: z.string().optional().describe("Specific area to focus suggestions on (debt, budgeting, saving, investing)"),
  }),
  handler: async (ctx, { maxSuggestions, focusArea }) => {
    // Gather financial context first
    const context = await gatherFinancialContextHelper(ctx, true, true);
    
    const suggestions = [];
    const { financialMetrics, sophisticationLevel, contextualInsights } = context;

    // High debt situation
    if (financialMetrics.debtToIncomeRatio > 30) {
      suggestions.push({
        text: "Should I consolidate my debts to save money?",
        category: "debt",
        priority: "high",
        educationalFocus: "Debt consolidation options and potential savings"
      });
      
      suggestions.push({
        text: "What's the best strategy to pay off my debts faster?",
        category: "debt",
        priority: "high",
        educationalFocus: "Debt avalanche vs snowball methods"
      });
    }

    // Negative monthly balance
    if (financialMetrics.monthlyBalance < 0) {
      suggestions.push({
        text: "Help me create a budget to stop overspending",
        category: "budgeting",
        priority: "high",
        educationalFocus: "50/30/20 rule and expense tracking"
      });
    }

    // No emergency fund
    if (financialMetrics.monthlyBalance < financialMetrics.totalMonthlyExpenses) {
      suggestions.push({
        text: "How much should I save for emergencies?",
        category: "saving",
        priority: "medium",
        educationalFocus: "Emergency fund planning and automation"
      });
    }

    // Good financial position
    if (financialMetrics.monthlyBalance > 0 && financialMetrics.debtToIncomeRatio < 20) {
      if (sophisticationLevel === "beginner") {
        suggestions.push({
          text: "What should I do with my extra money each month?",
          category: "investing",
          priority: "medium",
          educationalFocus: "Basic investment principles and options"
        });
      } else {
        suggestions.push({
          text: "How can I optimize my tax strategy this year?",
          category: "investing",
          priority: "low",
          educationalFocus: "Tax-advantaged accounts and strategies"
        });
      }
    }

    // Sophistication-based suggestions
    if (sophisticationLevel === "beginner") {
      suggestions.push({
        text: "Teach me the basics of managing my money",
        category: "education",
        priority: "medium",
        educationalFocus: "Financial literacy fundamentals"
      });
    }

    // Generic helpful suggestions
    suggestions.push({
      text: "Analyze my spending patterns and suggest improvements",
      category: "analysis",
      priority: "low",
      educationalFocus: "Expense categorization and optimization"
    });

    suggestions.push({
      text: "What's my next step to improve my financial health?",
      category: "planning",
      priority: "medium",
      educationalFocus: "Personalized financial roadmap"
    });

    // Filter by focus area if specified
    let filteredSuggestions = suggestions;
    if (focusArea) {
      filteredSuggestions = suggestions.filter(s => s.category === focusArea);
    }

    // Sort by priority and take max suggestions
    const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
    return filteredSuggestions
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      .slice(0, maxSuggestions);
  },
});

// Tool to assess user's financial literacy level for adaptive content
export const assessFinancialLiteracyTool = createTool({
  description: "Assess user's financial literacy level based on their data tracking behavior and financial decisions",
  args: z.object({
    includeRecommendations: z.boolean().default(true).describe("Whether to include learning recommendations"),
  }),
  handler: async (ctx, { includeRecommendations }) => {
    const context = await gatherFinancialContextHelper(ctx, true, false);
    
    const assessment = {
      level: context.sophisticationLevel,
      indicators: {
        dataTracking: context.profile.dataCompleteness.incomes + context.profile.dataCompleteness.expenses + context.profile.dataCompleteness.loans,
        debtManagement: context.financialMetrics.debtToIncomeRatio < 30 ? "good" : "needs_improvement",
        budgetingSkills: context.financialMetrics.monthlyBalance >= 0 ? "good" : "needs_improvement",
        projectEngagement: context.projects.length > 0 ? "active" : "passive",
      },
      strengths: [] as string[],
      growthAreas: [] as string[],
    };

    // Identify strengths
    if (context.profile.dataCompleteness.expenses >= 5) {
      assessment.strengths.push("Detailed expense tracking");
    }
    if (context.financialMetrics.monthlyBalance > 0) {
      assessment.strengths.push("Positive monthly cash flow");
    }
    if (context.financialMetrics.debtToIncomeRatio < 20) {
      assessment.strengths.push("Healthy debt-to-income ratio");
    }

    // Identify growth areas
    if (context.financialMetrics.monthlyBalance < context.financialMetrics.totalMonthlyExpenses) {
      assessment.growthAreas.push("Emergency fund planning");
    }
    if (context.profile.dataCompleteness.incomes < 1) {
      assessment.growthAreas.push("Income tracking");
    }
    if (context.financialMetrics.debtToIncomeRatio > 30) {
      assessment.growthAreas.push("Debt management strategies");
    }

    // Learning recommendations
    if (includeRecommendations) {
      (assessment as any).recommendations = generateLearningRecommendations(assessment.level, assessment.growthAreas);
    }

    return assessment;
  },
});

// Tool to create personalized educational content
export const createEducationalContentTool = createTool({
  description: "Create personalized educational content based on user's financial situation and literacy level",
  args: z.object({
    topic: z.enum(["emergency_fund", "debt_strategies", "budgeting_methods", "credit_improvement", "investment_basics"]).describe("Educational topic to focus on"),
    literacyLevel: z.enum(["beginner", "intermediate", "advanced"]).describe("User's financial literacy level"),
  }),
  handler: async (ctx, { topic, literacyLevel }) => {
    const context = await gatherFinancialContextHelper(ctx, false, false);
    
    return generateEducationalContent(topic, literacyLevel, context.financialMetrics);
  },
});

// Helper functions
function assessFinancialSophistication(data: any): "beginner" | "intermediate" | "advanced" {
  let score = 0;
  
  // Basic tracking (1 point each)
  if (data.hasIncomes) score += 1;
  if (data.hasExpenses) score += 1;
  if (data.hasLoans) score += 1;
  
  // Financial health indicators (2 points each)
  if (data.hasEmergencyFund) score += 2;
  if (data.debtToIncomeRatio < 30) score += 2;
  if (data.totalDebt < 50000) score += 1; // Reasonable debt levels
  
  if (score <= 3) return "beginner";
  if (score <= 6) return "intermediate";
  return "advanced";
}

function calculateFinancialHealthScore(metrics: any): number {
  let score = 0;
  
  // Monthly balance (30 points max)
  if (metrics.monthlyBalance > 0) {
    score += Math.min(30, metrics.monthlyBalance * 0.1);
  }
  
  // Debt-to-income ratio (25 points max)
  if (metrics.debtToIncomeRatio < 20) score += 25;
  else if (metrics.debtToIncomeRatio < 30) score += 15;
  else if (metrics.debtToIncomeRatio < 40) score += 5;
  
  // Emergency fund (20 points)
  if (metrics.hasEmergencyFund) score += 20;
  
  // Income diversity (15 points)
  if (metrics.diversifiedIncome) score += 15;
  
  // Expense tracking (10 points)
  if (metrics.trackingExpenses) score += 10;
  
  return Math.round(Math.min(100, score));
}

function generateContextualInsights(data: any): string[] {
  const insights = [];
  
  if (data.monthlyBalance < 0) {
    insights.push("Your expenses exceed your income - let's work on budgeting strategies");
  }
  
  if (data.debtToIncomeRatio > 30) {
    insights.push("Your debt payments are high relative to income - debt consolidation might help");
  }
  
  if (data.monthlyBalance > 0 && data.debtToIncomeRatio < 20) {
    insights.push("You're in great financial shape - time to think about building wealth");
  }
  
  if (!data.hasProjects && data.totalDebt > 5000) {
    insights.push("Consider creating a debt consolidation project to explore your options");
  }
  
  return insights;
}

function generateLearningRecommendations(level: string, growthAreas: string[]): any[] {
  const recommendations = [];
  
  if (level === "beginner") {
    recommendations.push({
      title: "Start with the 50/30/20 Budget Rule",
      description: "A simple framework for allocating your income",
      priority: "high"
    });
  }
  
  if (growthAreas.includes("Emergency fund planning")) {
    recommendations.push({
      title: "Build Your Emergency Fund",
      description: "Start with just €500 and build from there",
      priority: "high"
    });
  }
  
  if (growthAreas.includes("Debt management strategies")) {
    recommendations.push({
      title: "Learn Debt Avalanche vs Snowball",
      description: "Choose the right strategy for your situation",
      priority: "medium"
    });
  }
  
  return recommendations;
}

function generateEducationalContent(topic: string, level: string, metrics: any): any {
  const content = {
    title: "",
    explanation: "",
    actionSteps: [] as string[],
    personalizedTips: [] as string[],
  };

  switch (topic) {
    case "emergency_fund":
      content.title = "Emergency Fund Planning";
      content.explanation = level === "beginner" 
        ? "An emergency fund is money set aside for unexpected expenses like car repairs or medical bills."
        : "An emergency fund should cover 3-6 months of essential expenses and be kept in a high-yield savings account.";
      
      content.actionSteps = [
        `Start with a goal of €${Math.max(500, Math.round(metrics.totalMonthlyExpenses * 0.5))}`,
        "Open a separate savings account for emergencies only",
        "Set up automatic transfers of €50-100 per month",
      ];
      
      if (metrics.monthlyBalance > 0) {
        content.personalizedTips.push(`With your current monthly surplus of €${metrics.monthlyBalance.toFixed(2)}, you could build a €1000 emergency fund in ${Math.ceil(1000 / metrics.monthlyBalance)} months.`);
      }
      break;

    case "debt_strategies":
      content.title = "Debt Payoff Strategies";
      content.explanation = "There are two main approaches: debt avalanche (pay highest interest first) and debt snowball (pay smallest balance first).";
      
      content.actionSteps = [
        "List all your debts with balances and interest rates",
        "Choose avalanche for maximum savings or snowball for motivation",
        "Pay minimums on all debts except your target debt",
      ];
      
      if (metrics.debtToIncomeRatio > 30) {
        content.personalizedTips.push("With your current debt-to-income ratio, consider debt consolidation to reduce monthly payments.");
      }
      break;

    case "budgeting_methods":
      content.title = "Budgeting Methods";
      content.explanation = level === "beginner"
        ? "The 50/30/20 rule allocates 50% for needs, 30% for wants, and 20% for savings and debt payment."
        : "Advanced budgeting includes zero-based budgeting, envelope method, and percentage-based allocation strategies.";
      
      content.actionSteps = [
        "Track your spending for one month",
        "Categorize expenses as needs, wants, or savings",
        "Adjust allocations based on your priorities",
      ];
      
      content.personalizedTips.push(`Based on your income of €${metrics.totalMonthlyIncome?.toFixed(2)}, aim for €${(metrics.totalMonthlyIncome * 0.2)?.toFixed(2)} monthly for savings and debt payment.`);
      break;
  }

  return content;
}