// Financial tools for Convex Agents using correct createTool syntax
// Integrates with validation layer for duplicate detection

import { createTool } from "@convex-dev/agent";
import { z } from "zod";
import { api } from "../_generated/api";
import { ExtractFinancialDataSchemaReturnType, FinancialDataSchema, GenerateFinancialAdviceSchemaReturnType, GetFinancialSummarySchemaReturnType } from "../domain/finance.type";
import { isDuplicateIncome, isDuplicateExpense, isDuplicateLoan } from "../lib/validation";



// Tool to extract and process financial information from natural language
export const extractFinancialDataTool = createTool({
  description: "Extract financial information (income, expenses, loans) from user message and create pending facts for user confirmation via dashboard",
  args: z.object({
    message: z.string().describe("The user's message containing financial information"),
    details: z.string().describe("Additional information about the user query. It's usefull when the user makes reference to some context so you can pass additional data to give the tool the necessary information")
  }),
  handler: async (ctx, { message }): Promise<ExtractFinancialDataSchemaReturnType> => {
    const userProfile = await ctx.runQuery(api.profiles.getUserProfile);
    if (!userProfile) {
      throw new Error("User profile not found");
    }

    // Import generateObject here to use the exact same AI processing
    const { generateObject } = await import("ai");
    const { openai } = await import("@ai-sdk/openai");

    try {
      console.log("🔍 Agent extracting financial data:", message);

      // Use the EXACT same prompt and processing as the original system
      const result = await generateObject({
        model: openai("gpt-4o"),
        mode: "json",
        prompt: `You are a financial data extraction expert. Extract ALL financial information from this message and create pending facts for user validation.

User message: "${message}"

EXTRACTION RULES:
1. INCOME DETECTION:
   - Keywords: earn, salary, income, make, paid, wage, revenue, salaire, revenus, gains
   - Examples: "I earn 3000€", "My salary is 2500", "I make 45k per year"
   - Default to monthly unless "year/annual/yearly" is mentioned

2. EXPENSE DETECTION:
   - Keywords: spend, cost, pay, rent, mortgage, bill, expense, dépense, coût
   - Categories: Housing, Food, Transport, Utilities, Entertainment, Healthcare, Other
   - Examples: "My rent is 800€", "I spend 300 on groceries"

3. LOAN DETECTION:
   - Keywords: loan, debt, credit, payment, prêt, crédit, dette
   - Types: credit_card, personal, mortgage, auto
   - Extract: monthly payment, interest rate (default 5% if not mentioned), balance (estimate if not given)

4. AMOUNT EXTRACTION:
   - Look for: 1500, 1,500, 1.500, €1500, $1500, 1500€, 1500$
   - Handle: k (thousands), K (thousands)
   - Examples: "3k" = 3000, "2.5k" = 2500

5. FREQUENCY DETECTION:
   - Monthly: per month, monthly, /month, mensuel, par mois
   - Annual: per year, yearly, annually, /year, annuel, par an

CRITICAL: Extract EVERY number that could represent money. Be aggressive in detection!

Examples:
- "I earn 3000€ per month" → income: {label: "Monthly earnings", amount: 3000, isMonthly: true}
- "My rent is 800€" → expense: {category: "Housing", label: "Rent", amount: 800}
- "I spend 300 on groceries" → expense: {category: "Food", label: "Groceries", amount: 300}

Provide a summary of what was extracted and processed.`,
        schema: FinancialDataSchema,
        schemaName: "FinancialData",
      });

      console.log("✅ Agent extracted data:", JSON.stringify(result.object, null, 2));

      const extractedData = result.object;
      const responses: string[] = [];
      let hasAddedData = false;
      let pendingCount = 0;
      let duplicateCount = 0;

      // Get existing data to check for duplicates
      const financialData = await ctx.runQuery(api.profiles.getFinancialData, {
        profileId: userProfile._id,
      });

      // Process incomes with duplicate checking
      for (const income of extractedData.incomes) {
        try {
          // Check for duplicates
          if (isDuplicateIncome(income, financialData.incomes)) {
            responses.push(`⚠️ Duplicate detected: ${income.label} - €${income.amount} (already exists)`);
            duplicateCount++;
          } else {
            // Create pending fact for validation
            await ctx.runMutation(api.domain.facts.createPendingFact, {
              profileId: userProfile._id,
              type: "income",
              data: income,
              extractedFrom: message,
              confidence: 0.8,
            });
            responses.push(`⏳ Pending confirmation: ${income.label} - €${income.amount}${income.isMonthly ? '/month' : '/year'}`);
            pendingCount++;
            hasAddedData = true;
          }
        } catch (error) {
          console.error("Failed to process income:", error);
          responses.push(`❌ Failed to process income: ${income.label}`);
        }
      }

      // Process expenses with duplicate checking
      for (const expense of extractedData.expenses) {
        try {
          // Check for duplicates
          if (isDuplicateExpense(expense, financialData.expenses)) {
            responses.push(`⚠️ Duplicate detected: ${expense.label} - €${expense.amount} (already exists)`);
            duplicateCount++;
          } else {
            // Create pending fact for validation
            await ctx.runMutation(api.domain.facts.createPendingFact, {
              profileId: userProfile._id,
              type: "expense",
              data: expense,
              extractedFrom: message,
              confidence: 0.8,
            });
            responses.push(`⏳ Pending confirmation: ${expense.label} (${expense.category}) - €${expense.amount}/month`);
            pendingCount++;
            hasAddedData = true;
          }
        } catch (error) {
          console.error("Failed to process expense:", error);
          responses.push(`❌ Failed to process expense: ${expense.label}`);
        }
      }

      // Process loans with duplicate checking
      for (const loan of extractedData.loans) {
        try {
          // Check for duplicates
          if (isDuplicateLoan(loan, financialData.loans)) {
            responses.push(`⚠️ Duplicate detected: ${loan.name} - €${loan.monthlyPayment}/month (already exists)`);
            duplicateCount++;
          } else {
            // Create pending fact for validation
            await ctx.runMutation(api.domain.facts.createPendingFact, {
              profileId: userProfile._id,
              type: "loan",
              data: loan,
              extractedFrom: message,
              confidence: 0.8,
            });
            responses.push(`⏳ Pending confirmation: ${loan.name} - €${loan.monthlyPayment}/month`);
            pendingCount++;
            hasAddedData = true;
          }
        } catch (error) {
          console.error("Failed to process loan:", error);
          responses.push(`❌ Failed to process loan: ${loan.name}`);
        }
      }

      // Return response with validation info
      if (hasAddedData || duplicateCount > 0) {
        let finalMessage = responses.join("\n");
        if (pendingCount > 0) {
          finalMessage += `\n\n📝 **${pendingCount} item${pendingCount > 1 ? 's' : ''} pending confirmation**\nPlease check your dashboard to confirm or reject.`;
        }
        if (duplicateCount > 0) {
          finalMessage += `\n\n⚠️ **${duplicateCount} duplicate${duplicateCount > 1 ? 's' : ''} detected**\nThese items already exist in your profile.`;
        }
        finalMessage += "\n\n" + extractedData.summary;
        
        return {
          success: true,
          message: finalMessage,
          itemsProcessed: {
            incomes: extractedData.incomes.length,
            expenses: extractedData.expenses.length,
            loans: extractedData.loans.length,
          }
        };
      } else {
        return {
          success: false,
          message: "I didn't detect specific financial amounts in your message. Here are some ways to share your financial information:\n\n💬 **Be more specific with amounts:**\n• \"My salary is 2500€ per month\"\n• \"I spend 150€ monthly on groceries\"\n• \"My mortgage payment is 800€\"\n\n🎤 **Try voice recording** - Click the microphone button\n📄 **Upload a CSV file** - Excel files need to be saved as CSV first\n\nWhat would you like to try?",
          itemsProcessed: {
            incomes: 0,
            expenses: 0,
            loans: 0,
          }
        };
      }

    } catch (error) {
      console.error("Error processing financial message:", error);
      return {
        success: false,
        message: "Sorry, I encountered an error processing your message. Please try again or use voice recording or file upload!",
        itemsProcessed: {
          incomes: 0,
          expenses: 0,
          loans: 0,
        }
      };
    }
  },
});

// Tool to get user's financial summary
export const getFinancialSummaryTool = createTool({
  description: "Get the current financial summary for a user",
  args: z.object({
  }),
  handler: async (ctx): Promise<GetFinancialSummarySchemaReturnType> => {
    const userProfile = await ctx.runQuery(api.profiles.getUserProfile);
    if (!userProfile) {
      throw new Error("User profile not found");
    }

    try {
      const balance = await ctx.runQuery(api.profiles.getMonthlyBalance, {
        profileId: userProfile._id,
      });

      return {
        summary: `📊 **Your Financial Summary:**

💰 **Monthly Income:** €${balance.monthlyIncome}
💸 **Monthly Expenses:** €${balance.monthlyExpenses}  
🏦 **Monthly Loan Payments:** €${balance.monthlyLoanPayments}
📈 **Monthly Balance:** €${balance.balance}

📋 **Tracking:**
• ${balance.monthlyIncome} income source${balance.monthlyIncome !== 1 ? 's' : ''}
• ${balance.monthlyExpenses} expense${balance.monthlyExpenses !== 1 ? 's' : ''}
• ${balance.monthlyLoanPayments} loan${balance.monthlyLoanPayments !== 1 ? 's' : ''}

${balance.balance > 0 
  ? `✅ Great! You have a positive monthly balance of €${balance.balance}.` 
  : balance.balance < 0 
    ? `⚠️ Your expenses exceed your income by €${Math.abs(balance.balance)}. Let's work on improving this!`
    : `🎯 You're breaking even with your current budget.`
}`
      };
    } catch (error) {
      console.error("Error getting financial summary:", error);
      return {
        summary: "I'm having trouble accessing your financial summary right now. Please try again in a moment.",
      };
    }
  },
});

// Tool to generate financial advice
export const generateFinancialAdviceTool = createTool({
  description: "Generate personalized financial advice based on user's current situation",
  args: z.object({
        context: z.string().describe("Additional context about user's question or situation"),
  }),
  handler: async (ctx, { context }): Promise<GenerateFinancialAdviceSchemaReturnType> => {
    try {
      const userProfile = await ctx.runQuery(api.profiles.getUserProfile);
      if (!userProfile) {
        throw new Error("User profile not found");
      }

      const balance = await ctx.runQuery(api.profiles.getMonthlyBalance, {
        profileId: userProfile._id,
      });

      // Use the exact same advice generation as the original system
      const { generateText } = await import("ai");
      const { openai } = await import("@ai-sdk/openai");

      const result = await generateText({
        model: openai("gpt-4o"),
        prompt: `You are Fourmi, a friendly financial copilot helping users escape debt traps and build better budgets.

Current Financial Situation:
- Monthly Income: €${balance.monthlyIncome}
- Monthly Expenses: €${balance.monthlyExpenses}
- Monthly Loan Payments: €${balance.monthlyLoanPayments}
- Monthly Balance: €${balance.balance}

Context: ${context}

Provide helpful, actionable financial advice in a conversational tone. Focus on:
- Immediate concerns if balance is negative
- Practical steps to improve the situation
- Debt reduction strategies if applicable
- Budgeting tips
- Emergency fund recommendations

Keep it concise (2-3 sentences) and encouraging. Use emojis sparingly.`,
      });

      return {
        advice: result.text,
      };
    } catch (error) {
      console.error("Error generating financial advice:", error);
      return {
        advice: "I'm having trouble generating advice right now. Let me know if you'd like to add more financial information to your profile!",
      };
    }
  },
});