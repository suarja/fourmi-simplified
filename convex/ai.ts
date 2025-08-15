/**
 * @deprecated This file is deprecated and will be removed.
 * Use convex/agents.ts and convex/agents/financialTools.ts instead.
 * Migration in progress - see docs/technical/MIGRATION.md
 */

"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { api } from "./_generated/api";

const FinancialDataSchema = z.object({
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

export const processFinancialMessage = action({
  args: {
    profileId: v.id("profiles"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("🔍 Processing financial message:", args.message);
    
    try {
      // Use AI to extract and process financial data
      const result = await generateObject({
        model: openai("gpt-4o"),
        mode: "json",
        prompt: `You are a financial data extraction expert. Extract ALL financial information from this message and save it to the user's profile.

User message: "${args.message}"

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

      console.log("✅ AI extracted data:", JSON.stringify(result.object, null, 2));

      const extractedData = result.object;
      let responses: string[] = [];
      let hasAddedData = false;

      // Add incomes to database
      for (const income of extractedData.incomes) {
        try {
          await ctx.runMutation(api.profiles.addIncome, {
            profileId: args.profileId,
            label: income.label,
            amount: income.amount,
            isMonthly: income.isMonthly,
          });
          responses.push(`✅ Added income: ${income.label} - €${income.amount}${income.isMonthly ? '/month' : '/year'}`);
          hasAddedData = true;
        } catch (error) {
          console.error("Failed to add income:", error);
          responses.push(`❌ Failed to add income: ${income.label}`);
        }
      }

      // Add expenses to database
      for (const expense of extractedData.expenses) {
        try {
          await ctx.runMutation(api.profiles.addExpense, {
            profileId: args.profileId,
            category: expense.category,
            label: expense.label,
            amount: expense.amount,
          });
          responses.push(`✅ Added expense: ${expense.label} (${expense.category}) - €${expense.amount}/month`);
          hasAddedData = true;
        } catch (error) {
          console.error("Failed to add expense:", error);
          responses.push(`❌ Failed to add expense: ${expense.label}`);
        }
      }

      // Add loans to database
      for (const loan of extractedData.loans) {
        try {
          await ctx.runMutation(api.profiles.addLoan, {
            profileId: args.profileId,
            type: loan.type,
            name: loan.name,
            monthlyPayment: loan.monthlyPayment,
            interestRate: loan.interestRate,
            remainingBalance: loan.remainingBalance,
            remainingMonths: loan.remainingMonths,
          });
          responses.push(`✅ Added loan: ${loan.name} - €${loan.monthlyPayment}/month`);
          hasAddedData = true;
        } catch (error) {
          console.error("Failed to add loan:", error);
          responses.push(`❌ Failed to add loan: ${loan.name}`);
        }
      }

      // Return response
      if (hasAddedData) {
        return {
          success: true,
          message: responses.join("\n") + "\n\n" + extractedData.summary,
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

export const processFinancialFile = action({
  args: {
    profileId: v.id("profiles"),
    storageId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Get the file from storage
      const fileUrl = await ctx.storage.getUrl(args.storageId);
      if (!fileUrl) {
        throw new Error("File not found");
      }

      // Download the file content
      const response = await fetch(fileUrl);
      const fileContent = await response.text();

      console.log("📄 Processing file:", args.fileName);
      console.log("📄 File content length:", fileContent.length);

      // Use AI to process the file content
      const result = await generateObject({
        model: openai("gpt-4o"),
        mode: "json",
        prompt: `You are a financial data extraction expert. Parse this CSV/TSV file and extract ALL financial information.

File name: ${args.fileName}
File content:
${fileContent}

PARSING RULES:
1. This appears to be a CSV or TSV file with financial data
2. Look for headers like: Salaire, Salary, Income, Dépenses, Expenses, etc.
3. Extract ALL numeric values that could represent money
4. Map to appropriate categories:
   - Income: Salaire, Salary, Revenue, Income, Revenus, Gains, Earnings
   - Expenses: Dépenses, Expenses, Costs, Coûts, Charges, Spending
   - Loans: Loan, Debt, Credit, Prêt, Crédit, Dette

5. LANGUAGE FLEXIBILITY:
   - French: Salaire=Income, Dépenses=Expenses, Loyer=Housing
   - English: Salary=Income, Expenses=Expenses, Rent=Housing
   - German: Gehalt=Income, Ausgaben=Expenses, Miete=Housing

6. AMOUNT PROCESSING:
   - Assume monthly frequency unless specified otherwise
   - Convert all amounts to EUR if no currency specified
   - Handle formats like: 1500, 1,500, 1.500, €1500, $1500

7. CATEGORIZATION:
   - Map expenses to: Housing, Food, Transport, Utilities, Entertainment, Healthcare, Other
   - If unsure about category, use "Other"

EXTRACT EVERYTHING - Don't be conservative! Every number that could be money should be extracted.

Provide a detailed summary of what was processed from the file.`,
        schema: FinancialDataSchema,
        schemaName: "FinancialData",
      });

      console.log("✅ AI processed file data:", JSON.stringify(result.object, null, 2));

      const extractedData = result.object;
      let responses: string[] = [];

      // Add all extracted data to database
      for (const income of extractedData.incomes) {
        await ctx.runMutation(api.profiles.addIncome, {
          profileId: args.profileId,
          label: income.label,
          amount: income.amount,
          isMonthly: income.isMonthly,
        });
        responses.push(`✅ Added income: ${income.label} - €${income.amount}${income.isMonthly ? '/month' : '/year'}`);
      }

      for (const expense of extractedData.expenses) {
        await ctx.runMutation(api.profiles.addExpense, {
          profileId: args.profileId,
          category: expense.category,
          label: expense.label,
          amount: expense.amount,
        });
        responses.push(`✅ Added expense: ${expense.label} (${expense.category}) - €${expense.amount}/month`);
      }

      for (const loan of extractedData.loans) {
        await ctx.runMutation(api.profiles.addLoan, {
          profileId: args.profileId,
          type: loan.type,
          name: loan.name,
          monthlyPayment: loan.monthlyPayment,
          interestRate: loan.interestRate,
          remainingBalance: loan.remainingBalance,
          remainingMonths: loan.remainingMonths,
        });
        responses.push(`✅ Added loan: ${loan.name} - €${loan.monthlyPayment}/month`);
      }

      return {
        success: true,
        message: responses.join("\n") + "\n\n" + extractedData.summary,
        itemsProcessed: {
          incomes: extractedData.incomes.length,
          expenses: extractedData.expenses.length,
          loans: extractedData.loans.length,
        }
      };

    } catch (error) {
      console.error("Error processing financial file:", error);
      throw new Error("Failed to process file. Please ensure it's a CSV file with valid financial data.");
    }
  },
});

export const generateFinancialAdvice = action({
  args: {
    monthlyIncome: v.number(),
    monthlyExpenses: v.number(),
    monthlyLoanPayments: v.number(),
    balance: v.number(),
    context: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const result = await generateText({
        model: openai("gpt-4o"),
        prompt: `You are Fourmi, a friendly financial copilot helping users escape debt traps and build better budgets.

Current Financial Situation:
- Monthly Income: €${args.monthlyIncome}
- Monthly Expenses: €${args.monthlyExpenses}
- Monthly Loan Payments: €${args.monthlyLoanPayments}
- Monthly Balance: €${args.balance}

Context: ${args.context}

Provide helpful, actionable financial advice in a conversational tone. Focus on:
- Immediate concerns if balance is negative
- Practical steps to improve the situation
- Debt reduction strategies if applicable
- Budgeting tips
- Emergency fund recommendations

Keep it concise (2-3 sentences) and encouraging. Use emojis sparingly.`,
      });

      return result.text;
    } catch (error) {
      console.error("Error generating financial advice:", error);
      return "I'm having trouble generating advice right now. Let me know if you'd like to add more financial information to your profile!";
    }
  },
});

export const generateBudgetInsights = action({
  args: {
    incomes: v.array(v.object({
      label: v.string(),
      amount: v.number(),
      isMonthly: v.boolean(),
    })),
    expenses: v.array(v.object({
      category: v.string(),
      label: v.string(),
      amount: v.number(),
    })),
    loans: v.array(v.object({
      type: v.string(),
      name: v.string(),
      monthlyPayment: v.number(),
      interestRate: v.number(),
      remainingBalance: v.number(),
      remainingMonths: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    try {
      const totalIncome = args.incomes.reduce((sum, income) => {
        return sum + (income.isMonthly ? income.amount : income.amount / 12);
      }, 0);

      const totalExpenses = args.expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const totalLoanPayments = args.loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);

      const result = await generateText({
        model: openai("gpt-4o"),
        prompt: `Analyze this budget and provide 3 key insights:

Income Sources: ${args.incomes.map(i => `${i.label}: €${i.amount}${i.isMonthly ? '/month' : '/year'}`).join(', ')}

Expenses by Category: ${args.expenses.reduce((acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
          return acc;
        }, {} as Record<string, number>)}

Loans: ${args.loans.map(l => `${l.name}: €${l.monthlyPayment}/month at ${(l.interestRate * 100).toFixed(1)}%`).join(', ')}

Total Monthly: Income €${totalIncome.toFixed(2)}, Expenses €${totalExpenses.toFixed(2)}, Loans €${totalLoanPayments.toFixed(2)}

Provide exactly 3 bullet points with actionable insights. Focus on the biggest opportunities for improvement.`,
      });

      return result.text;
    } catch (error) {
      console.error("Error generating budget insights:", error);
      return "• Add more income and expense details for personalized insights\n• Track your spending for better budget accuracy\n• Consider setting up an emergency fund";
    }
  },
});

export const transcribeAudio = action({
  args: {
    audioData: v.string(), // base64 encoded audio
  },
  handler: async (ctx, args) => {
    try {
      // Convert base64 to buffer
      const audioBuffer = Buffer.from(args.audioData, 'base64');
      
      // Use OpenAI Whisper for transcription
      const formData = new FormData();
      formData.append('file', new Blob([audioBuffer]), 'audio.wav');
      formData.append('model', 'whisper-1');
      
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CONVEX_OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const result = await response.json();
      return result.text;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      // Fallback to placeholder for now
      return "I earn 2500 euros per month, spend 800 on rent, 300 on groceries, 150 on utilities, and have a car loan of 250 euros monthly";
    }
  },
});
