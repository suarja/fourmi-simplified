import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { 
  DebtConsolidationToolResponseSchema,
  ConsolidationOptionSchema,
  DebtConsolidationInputsSchema
} from "../domain/projects.type";
import { calculateDebtConsolidation } from "../lib/debtConsolidation";

// Schema for extracting consolidation intent from user message
const ConsolidationIntentSchema = z.object({
  wantsConsolidation: z.boolean(),
  mentionedOptions: z.array(z.enum(["personal_loan", "balance_transfer", "heloc", "other"])),
  specificRates: z.array(z.object({
    type: z.enum(["personal_loan", "balance_transfer", "heloc"]),
    rate: z.number(),
    term: z.optional(z.number()),
  })),
  hasAllInfo: z.boolean(),
  missingInfo: z.array(z.string()),
  summary: z.string(),
});

// Default consolidation options to analyze
const DEFAULT_CONSOLIDATION_OPTIONS = [
  {
    type: "personal_loan" as const,
    rate: 0.12, // 12% APR
    term: 60, // 5 years
    fees: 0,
  },
  {
    type: "balance_transfer" as const,  
    rate: 0.18, // 18% APR after promo
    term: 36, // 3 years
    fees: 300, // 3% balance transfer fee
  },
  {
    type: "heloc" as const,
    rate: 0.08, // 8% APR
    term: 120, // 10 years
    fees: 500, // Closing costs
  },
];

export const debtConsolidationTool = createTool({
  description: "Analyze debt consolidation options for user's existing debts and create consolidation project",
  args: z.object({
    message: z.string().describe("The user's message about debt consolidation"),
    customOptions: z.optional(z.array(ConsolidationOptionSchema)).describe("Custom consolidation options if user mentioned specific rates/terms"),
  }),
  handler: async (ctx, { message, customOptions }): Promise<z.infer<typeof DebtConsolidationToolResponseSchema>> => {
    try {
      // Get user profile
      const userProfile = await ctx.runQuery(api.profiles.getUserProfile);
      if (!userProfile) {
        return {
          success: false,
          message: "User profile not found. Please create a profile first.",
          projectCreated: false,
          needsMoreInfo: false,
        };
      }

      console.log("🏦 Debt Consolidation Tool - Processing:", message);

      // Get user's existing loans and financial data
      const financialData = await ctx.runQuery(api.profiles.getFinancialData, {
        profileId: userProfile._id as Id<"profiles">,
      });

      if (!financialData.loans || financialData.loans.length === 0) {
        return {
          success: false,
          message: "I don't see any loans in your profile to consolidate. Please add your current debts first by telling me about them (e.g., 'I have a credit card with $3000 balance and $150 monthly payment').",
          projectCreated: false,
          needsMoreInfo: true,
          missingInfo: ["existing_debts"],
        };
      }

      // Extract consolidation intent using AI
      const { generateObject } = await import("ai");
      const { openai } = await import("@ai-sdk/openai");

      const intentResult = await generateObject({
        model: openai("gpt-4o"),
        mode: "json",
        prompt: `Analyze this message about debt consolidation and extract the user's intent:

User message: "${message}"

Determine:
1. Does the user want to consolidate their debt?
2. Did they mention specific consolidation options (personal loan, balance transfer, HELOC)?
3. Did they provide specific interest rates or terms?
4. Do we have enough information to proceed?
5. What information is missing?

Provide a summary of what the user is asking for.`,
        schema: ConsolidationIntentSchema,
      });

      const intent = intentResult.object;
      console.log("🧠 Extracted intent:", intent);

      if (!intent.wantsConsolidation) {
        return {
          success: false,
          message: "I understand you're asking about debt, but it doesn't seem like you want to consolidate. Would you like me to help you with a debt payoff strategy instead?",
          projectCreated: false,
          needsMoreInfo: false,
        };
      }

      // Get monthly balance for income data
      const monthlyBalance = await ctx.runQuery(api.profiles.getMonthlyBalance, {
        profileId: userProfile._id as Id<"profiles">,
      });

      // Transform loans to debt consolidation format
      const existingDebts = financialData.loans.map(loan => ({
        id: loan._id,
        name: loan.name,
        balance: loan.remainingBalance,
        monthlyPayment: loan.monthlyPayment,
        interestRate: loan.interestRate,
      }));

      // Use custom options if provided, otherwise use defaults
      const consolidationOptions = customOptions || DEFAULT_CONSOLIDATION_OPTIONS;

      // Prepare inputs for calculation
      const calculationInputs = {
        existingDebts,
        consolidationOptions,
        monthlyIncome: monthlyBalance.monthlyIncome * 100, // Convert to cents
        creditScore: undefined, // We don't collect this yet
      };

      // Validate inputs
      try {
        DebtConsolidationInputsSchema.parse(calculationInputs);
      } catch (error) {
        console.error("Invalid calculation inputs:", error);
        return {
          success: false,
          message: "There was an error processing your debt information. Please ensure all your loans have complete information.",
          projectCreated: false,
          needsMoreInfo: true,
          missingInfo: ["complete_loan_information"],
        };
      }

      // Calculate consolidation analysis
      const results = calculateDebtConsolidation(calculationInputs);

      // Create or update consolidation project
      const projectName = `Debt Consolidation Analysis - ${new Date().toLocaleDateString()}`;
      
      // Check if there's already an active consolidation project
      const existingProjects = await ctx.runQuery(api.projects.getProjectsByType, {
        profileId: userProfile._id as Id<"profiles">,
        type: "debt_consolidation",
      });

      const activeProject = existingProjects.find(p => p.status === "active");

      let projectId: string;
      let projectCreated = false;

      if (activeProject) {
        // Update existing project
        await ctx.runMutation(api.projects.updateProject, {
          projectId: activeProject._id,
          updates: {
            inputs: calculationInputs,
            results,
            state: "FRESH",
          },
        });
        projectId = activeProject._id;
      } else {
        // Create new project
        const newProjectId = await ctx.runMutation(api.projects.createProject, {
          profileId: userProfile._id as Id<"profiles">,
          type: "debt_consolidation",
          name: projectName,
          inputs: calculationInputs,
          results,
          state: "FRESH",
        });
        projectId = newProjectId;
        projectCreated = true;
      }

      // The projectId will be returned so the main agent can set it as active

      // Format response message
      const totalDebt = results.totalCurrentDebt / 100;
      const totalSavings = Math.max(...results.consolidationComparison.map(opt => opt.totalSavings)) / 100;
      const eligibleOptions = results.consolidationComparison.filter(opt => opt.eligible);

      let responseMessage = `📊 **Debt Consolidation Analysis Complete**\n\n`;
      responseMessage += `💰 Total Current Debt: $${totalDebt.toFixed(2)}\n`;
      responseMessage += `💸 Current Monthly Payments: $${(results.totalCurrentPayment / 100).toFixed(2)}\n\n`;

      if (eligibleOptions.length > 0) {
        responseMessage += `✅ **You have ${eligibleOptions.length} consolidation option${eligibleOptions.length > 1 ? 's' : ''} available!**\n\n`;
        
        if (totalSavings > 0) {
          responseMessage += `🎯 **Potential Savings: Up to $${totalSavings.toFixed(2)}**\n\n`;
        }

        responseMessage += `**${results.recommendation}**\n\n`;
        
        if (results.nextSteps.length > 0) {
          responseMessage += `📋 **Next Steps:**\n`;
          results.nextSteps.forEach(step => {
            responseMessage += `• ${step}\n`;
          });
        }
      } else {
        responseMessage += `❌ Unfortunately, debt consolidation may not be beneficial right now.\n\n`;
        responseMessage += `**${results.recommendation}**\n\n`;
        
        if (results.nextSteps.length > 0) {
          responseMessage += `💡 **Alternative Strategies:**\n`;
          results.nextSteps.forEach(step => {
            responseMessage += `• ${step}\n`;
          });
        }
      }

      if (results.warnings.length > 0) {
        responseMessage += `\n⚠️ **Important Considerations:**\n`;
        results.warnings.forEach(warning => {
          responseMessage += `• ${warning}\n`;
        });
      }

      responseMessage += `\n📈 View detailed analysis and comparison in your project dashboard!`;

      return {
        success: true,
        projectId,
        message: responseMessage,
        projectCreated,
        needsMoreInfo: false,
      };

    } catch (error) {
      console.error("Error in debt consolidation tool:", error);
      return {
        success: false,
        message: "I encountered an error analyzing your debt consolidation options. Please try again or provide more details about your current debts.",
        projectCreated: false,
        needsMoreInfo: false,
      };
    }
  },
});