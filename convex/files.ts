"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";
import { financialAgent } from "./agents";

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

      console.log("📄 File content:", fileContent);
      console.log("📄 File length:", fileContent.length);

      // Check if it's likely an Excel file that needs conversion
      if (args.fileName.match(/\.xlsx?$/i) && !fileContent.includes(',') && !fileContent.includes('\t')) {
        throw new Error("Excel files need to be converted to CSV format. Please save your Excel file as CSV and try again.");
      }

      // Detect delimiter (comma or tab)
      const hasCommas = fileContent.includes(',');
      const hasTabs = fileContent.includes('\t');
      const delimiter = hasTabs && !hasCommas ? '\t' : ',';
      
      console.log("📄 Detected delimiter:", delimiter === '\t' ? 'TAB' : 'COMMA');

      // Simple pattern matching for CSV parsing
      console.log("🔍 Parsing CSV content with simple pattern matching");
      
      const lines = fileContent.trim().split('\n');
      console.log("📄 Lines found:", lines.length);
      
      let incomes: any[] = [];
      let expenses: any[] = [];
      let loans: any[] = [];
      
      if (lines.length >= 2) {
        const headers = lines[0].split(delimiter);
        const values = lines[1].split(delimiter);
        
        console.log("📊 Headers:", headers);
        console.log("📊 Values:", values);
        
        for (let i = 0; i < headers.length && i < values.length; i++) {
          const header = headers[i].toLowerCase().trim();
          const value = values[i].trim();
          const amount = parseFloat(value.replace(/[^\d.]/g, ''));
          
          if (!isNaN(amount) && amount > 0) {
            console.log(`💰 Found amount: ${amount} for header: ${header}`);
            
            if (header.includes('salaire') || header.includes('salary') || header.includes('income') || header.includes('revenus')) {
              incomes.push({
                label: "Salary",
                amount: amount,
                isMonthly: true
              });
            } else if (header.includes('dépenses') || header.includes('expenses') || header.includes('costs')) {
              expenses.push({
                category: "Other",
                label: "General Expenses",
                amount: amount
              });
            } else {
              // Default to expense if unclear
              expenses.push({
                category: "Other",
                label: header,
                amount: amount
              });
            }
          }
        }
      }
      
      const parsedData = {
        incomes,
        expenses,
        loans,
        summary: `Processed ${incomes.length} incomes, ${expenses.length} expenses, ${loans.length} loans from ${args.fileName}`
      };

      console.log("🤖 Parsed data:", JSON.stringify(parsedData, null, 2));

      // Add the parsed data to the user's profile
      for (const income of parsedData.incomes) {
        await ctx.runMutation(api.profiles.addIncome, {
          profileId: args.profileId,
          label: income.label,
          amount: income.amount,
          isMonthly: income.isMonthly,
        });
      }

      for (const expense of parsedData.expenses) {
        await ctx.runMutation(api.profiles.addExpense, {
          profileId: args.profileId,
          category: expense.category,
          label: expense.label,
          amount: expense.amount,
        });
      }

      for (const loan of parsedData.loans) {
        await ctx.runMutation(api.profiles.addLoan, {
          profileId: args.profileId,
          type: loan.type,
          name: loan.name,
          monthlyPayment: loan.monthlyPayment,
          interestRate: loan.interestRate,
          remainingBalance: loan.remainingBalance,
          remainingMonths: loan.remainingMonths,
        });
      }

      return {
        summary: parsedData.summary,
        itemsProcessed: {
          incomes: parsedData.incomes.length,
          expenses: parsedData.expenses.length,
          loans: parsedData.loans.length,
        }
      };

    } catch (error) {
      console.error("Error processing financial file:", error);
      if (error instanceof Error && error.message.includes("Excel files need to be converted")) {
        throw error;
      }
      throw new Error("Failed to process file. Please ensure it's a CSV file with valid financial data.");
    }
  },
});

// Process financial file within an agent thread context
export const processFinancialFileWithThread = action({
  args: {
    profileId: v.id("profiles"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    threadId: v.optional(v.string()), // Optional current thread
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      // First process the file data (same logic as processFinancialFile)
      const fileUrl = await ctx.storage.getUrl(args.storageId);
      if (!fileUrl) {
        throw new Error("File not found");
      }

      const response = await fetch(fileUrl);
      const fileContent = await response.text();

      console.log("📄 Processing file:", args.fileName, "with thread:", args.threadId);

      // Detect delimiter and parse (same logic)
      const hasCommas = fileContent.includes(',');
      const hasTabs = fileContent.includes('\t');
      const delimiter = hasTabs && !hasCommas ? '\t' : ',';
      
      const lines = fileContent.trim().split('\n');
      let incomes: any[] = [];
      let expenses: any[] = [];
      let loans: any[] = [];
      
      if (lines.length >= 2) {
        const headers = lines[0].split(delimiter);
        const values = lines[1].split(delimiter);
        
        for (let i = 0; i < headers.length && i < values.length; i++) {
          const header = headers[i].toLowerCase().trim();
          const value = values[i].trim();
          const amount = parseFloat(value.replace(/[^\d.]/g, ''));
          
          if (!isNaN(amount) && amount > 0) {
            if (header.includes('salaire') || header.includes('salary') || header.includes('income') || header.includes('revenus')) {
              incomes.push({
                label: "Salary",
                amount: amount,
                isMonthly: true
              });
            } else if (header.includes('dépenses') || header.includes('expenses') || header.includes('costs')) {
              expenses.push({
                category: "Other",
                label: "General Expenses",
                amount: amount
              });
            } else {
              expenses.push({
                category: "Other",
                label: header,
                amount: amount
              });
            }
          }
        }
      }

      // Save parsed data to profile
      for (const income of incomes) {
        await ctx.runMutation(api.profiles.addIncome, {
          profileId: args.profileId,
          label: income.label,
          amount: income.amount,
          isMonthly: income.isMonthly,
        });
      }

      for (const expense of expenses) {
        await ctx.runMutation(api.profiles.addExpense, {
          profileId: args.profileId,
          category: expense.category,
          label: expense.label,
          amount: expense.amount,
        });
      }

      for (const loan of loans) {
        await ctx.runMutation(api.profiles.addLoan, {
          profileId: args.profileId,
          type: loan.type,
          name: loan.name,
          monthlyPayment: loan.monthlyPayment,
          interestRate: loan.interestRate,
          remainingBalance: loan.remainingBalance,
          remainingMonths: loan.remainingMonths,
        });
      }

      // Create a summary message
      const summaryMessage = `I've uploaded my financial data from ${args.fileName}. ✅ Added income: ${incomes.map(i => `${i.label} - €${i.amount}${i.isMonthly ? '/month' : ''}`).join(', ')}${incomes.length > 0 && expenses.length > 0 ? '\n✅ Added expenses: ' : ''}${expenses.map(e => `${e.label} - €${e.amount}`).join(', ')}${loans.length > 0 ? '\n✅ Added loans: ' + loans.map(l => `${l.name} - €${l.monthlyPayment}/month`).join(', ') : ''}`;

      // Generate agent response within thread context
      let agentResponse;
      if (args.threadId) {
        // Continue existing thread
        console.log("🤖 Continuing thread:", args.threadId);
        const { thread } = await financialAgent.continueThread(ctx, { threadId: args.threadId });
        agentResponse = await thread.generateText({
          prompt: summaryMessage,
        });
      } else {
        // Create new thread
        console.log("🤖 Creating new thread for file upload");
        const title = `Financial Data from ${args.fileName}`;
        const { thread } = await financialAgent.createThread(ctx, {
          userId: userId,
          title: title,
          summary: `Financial data uploaded from ${args.fileName}`,
        });
        agentResponse = await thread.generateText({
          prompt: summaryMessage,
        });
        
        return {
          threadId: thread.threadId,
          threadTitle: title,
          response: agentResponse.text,
          summary: summaryMessage,
          itemsProcessed: {
            incomes: incomes.length,
            expenses: expenses.length,
            loans: loans.length,
          }
        };
      }

      return {
        response: agentResponse.text,
        summary: summaryMessage,
        itemsProcessed: {
          incomes: incomes.length,
          expenses: expenses.length,
          loans: loans.length,
        }
      };

    } catch (error) {
      console.error("Error processing financial file with thread:", error);
      throw new Error("Failed to process file. Please ensure it's a CSV file with valid financial data.");
    }
  },
});
