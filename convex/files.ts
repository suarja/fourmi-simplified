"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";
import { financialAgent } from "./agents";
import { parseAmount, categorizeExpense, detectFrequency, detectLoanType, calculateConfidence } from "./lib/extraction";

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

      // Detect delimiter (semicolon, comma, or tab)
      const hasSemicolons = fileContent.includes(';');
      const hasCommas = fileContent.includes(',');
      const hasTabs = fileContent.includes('\t');
      
      // Priority: semicolon > tab > comma
      let delimiter = ','; // default
      if (hasSemicolons) delimiter = ';';
      else if (hasTabs && !hasCommas) delimiter = '\t';
      
      console.log("📄 Delimiter analysis:", { hasSemicolons, hasCommas, hasTabs });
      console.log("📄 Detected delimiter:", delimiter === ';' ? 'SEMICOLON' : delimiter === '\t' ? 'TAB' : 'COMMA');

      // Simple pattern matching for CSV parsing
      console.log("🔍 Parsing CSV content with simple pattern matching");
      
      const lines = fileContent.trim().split('\n');
      console.log("📄 Lines found:", lines.length);
      
      let incomes: any[] = [];
      let expenses: any[] = [];
      let loans: any[] = [];
      
      // Use the same advanced parsing logic for both functions
      console.log("📊 Detailed parsing:");
      console.log("📊 All lines:", lines);
      
      // Try multiple parsing strategies
      const parseStrategies = [
        // Strategy 1: Traditional header/value rows
        () => {
          if (lines.length >= 2) {
            const headers = lines[0].split(delimiter).map(h => h.trim().replace(/\r/g, ''));
            const values = lines[1].split(delimiter).map(v => v.trim().replace(/\r/g, ''));
            console.log("📊 Strategy 1 - Headers:", headers, "Values:", values);
            
            // Check if we have meaningful headers, if not try next line
            const hasRealHeaders = headers.some(h => h.length > 0);
            if (!hasRealHeaders && lines.length >= 3) {
              // Try line 2 as headers, line 3 as values (3-line format)
              const headers2 = lines[1].split(delimiter).map(h => h.trim().replace(/\r/g, ''));
              const values2 = lines[2].split(delimiter).map(v => v.trim().replace(/\r/g, ''));
              console.log("📊 Strategy 1b - Labels as headers:", headers2, "Values:", values2);
              return { headers: headers2, values: values2 };
            }
            
            return { headers, values };
          }
          return null;
        },
        
        // Strategy 2: Data mixed with labels 
        () => {
          const allData: string[] = [];
          for (const line of lines) {
            const parts = line.split(delimiter).map(p => p.trim().replace(/\r/g, '')).filter(p => p);
            allData.push(...parts);
          }
          console.log("📊 Strategy 2 - All data:", allData);
          
          const results = allData.map(item => ({
            label: item,
            possibleAmount: item.match(/\d+[.,]?\d*/)?.[0] || ''
          })).filter(item => item.label && item.label.length > 0);
          
          console.log("📊 Strategy 2 - Filtered results:", results);
          return { mixed: results };
        }
      ];
      
      let parsedData: any = null;
      for (const strategy of parseStrategies) {
        parsedData = strategy();
        if (parsedData) break;
      }
      
      if (parsedData?.headers && parsedData?.values) {
        // Traditional parsing
        const { headers, values } = parsedData;
        for (let i = 0; i < headers.length && i < values.length; i++) {
          const header = headers[i].toLowerCase();
          const value = values[i];
          console.log(`📊 Processing: "${header}" = "${value}"`);
          
          const amount = parseAmount(value);
          
          if (amount && amount > 0) {
            console.log(`💰 Valid amount found: ${amount} for header: ${header}`);
            
            const label = header.charAt(0).toUpperCase() + header.slice(1) || "Unknown";
            
            if (header.includes('salaire') || header.includes('salary') || header.includes('income') || header.includes('revenus') || header.includes('revenu')) {
              const isMonthly = detectFrequency(`${header} ${value}`) ?? true;
              incomes.push({
                label: label,
                amount: amount,
                isMonthly: isMonthly,
                confidence: calculateConfidence({ amount, label, isMonthly })
              });
            } else if (header.includes('loan') || header.includes('prêt') || header.includes('crédit')) {
              const loanType = detectLoanType(`${header} ${value}`);
              loans.push({
                type: loanType,
                name: label,
                monthlyPayment: amount,
                interestRate: 0.05, // Default - user can edit
                remainingBalance: amount * 60, // Estimate
                remainingMonths: 60, // 5 years default
                confidence: calculateConfidence({ amount, label, type: loanType })
              });
            } else {
              // Default to expense
              const category = categorizeExpense(`${header} ${value}`);
              expenses.push({
                category: category,
                label: label,
                amount: amount,
                confidence: calculateConfidence({ amount, label, category })
              });
            }
          }
        }
      } else if (parsedData?.mixed) {
        // Mixed data parsing
        const { mixed } = parsedData;
        for (const item of mixed) {
          const label = item.label.toLowerCase();
          console.log(`📊 Processing mixed item: "${item.label}"`);
          
          const cleanLabel = item.label.charAt(0).toUpperCase() + item.label.slice(1);
          
          if (label.includes('salaire') || label.includes('salary') || label.includes('income') || 
              label.includes('revenus') || label.includes('revenu')) {
            const isMonthly = detectFrequency(item.label) ?? true;
            incomes.push({
              label: cleanLabel,
              amount: 3000, // Default placeholder - user can edit via chat
              isMonthly: isMonthly,
              confidence: 0.6 // Lower confidence for placeholder amounts
            });
            console.log(`💰 Found income category: ${item.label}`);
          } else if (label.includes('dépenses') || label.includes('dépense') || label.includes('expenses')) {
            const category = categorizeExpense(item.label);
            expenses.push({
              category: category,
              label: cleanLabel,
              amount: 500, // Default placeholder - user can edit via chat
              confidence: 0.6 // Lower confidence for placeholder amounts
            });
            console.log(`💰 Found expense category: ${item.label}`);
          }
          
          // Check for actual amounts in the data
          const potentialAmount = parseAmount(item.possibleAmount);
          if (potentialAmount && potentialAmount > 0) {
            console.log(`💰 Found potential amount: ${potentialAmount}`);
            const category = categorizeExpense(item.label);
            expenses.push({
              category: category,
              label: "Extracted Amount",
              amount: potentialAmount,
              confidence: calculateConfidence({ amount: potentialAmount, label: "Extracted Amount", category })
            });
          }
        }
      }
      
      const finalData = {
        incomes,
        expenses,
        loans,
        summary: `Processed ${incomes.length} incomes, ${expenses.length} expenses, ${loans.length} loans from ${args.fileName}`
      };

      console.log("🤖 Parsed data:", JSON.stringify(finalData, null, 2));

      // Add the parsed data to the user's profile
      for (const income of finalData.incomes) {
        await ctx.runMutation(api.profiles.addIncome, {
          profileId: args.profileId,
          label: income.label,
          amount: income.amount,
          isMonthly: income.isMonthly,
        });
      }

      for (const expense of finalData.expenses) {
        await ctx.runMutation(api.profiles.addExpense, {
          profileId: args.profileId,
          category: expense.category,
          label: expense.label,
          amount: expense.amount,
        });
      }

      for (const loan of finalData.loans) {
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
        summary: finalData.summary,
        itemsProcessed: {
          incomes: finalData.incomes.length,
          expenses: finalData.expenses.length,
          loans: finalData.loans.length,
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

      // Detect delimiter (same logic as above)
      const hasSemicolons = fileContent.includes(';');
      const hasCommas = fileContent.includes(',');
      const hasTabs = fileContent.includes('\t');
      
      // Priority: semicolon > tab > comma
      let delimiter = ','; // default
      if (hasSemicolons) delimiter = ';';
      else if (hasTabs && !hasCommas) delimiter = '\t';
      
      const lines = fileContent.trim().split('\n');
      let incomes: any[] = [];
      let expenses: any[] = [];
      let loans: any[] = [];
      
      console.log("📊 Detailed parsing:");
      console.log("📊 All lines:", lines);
      
      // Try different parsing strategies
      const parseStrategies = [
        // Strategy 1: Traditional header/value rows
        () => {
          if (lines.length >= 2) {
            const headers = lines[0].split(delimiter).map(h => h.trim().replace(/\r/g, ''));
            const values = lines[1].split(delimiter).map(v => v.trim().replace(/\r/g, ''));
            console.log("📊 Strategy 1 - Headers:", headers, "Values:", values);
            
            // Check if we have meaningful headers, if not try next line
            const hasRealHeaders = headers.some(h => h.length > 0);
            if (!hasRealHeaders && lines.length >= 3) {
              // Try line 2 as headers, line 3 as values (3-line format)
              const headers2 = lines[1].split(delimiter).map(h => h.trim().replace(/\r/g, ''));
              const values2 = lines[2].split(delimiter).map(v => v.trim().replace(/\r/g, ''));
              console.log("📊 Strategy 1b - Labels as headers:", headers2, "Values:", values2);
              return { headers: headers2, values: values2 };
            }
            
            return { headers, values };
          }
          return null;
        },
        
        // Strategy 2: Data mixed with labels (like ;Dépenses;Salaire;)
        () => {
          const allData: string[] = [];
          for (const line of lines) {
            const parts = line.split(delimiter).map(p => p.trim().replace(/\r/g, '')).filter(p => p);
            allData.push(...parts);
          }
          console.log("📊 Strategy 2 - All data:", allData);
          
          // Look for recognizable financial terms and extract them
          const results = allData.map(item => ({
            label: item,
            possibleAmount: item.match(/\d+[.,]?\d*/)?.[0] || ''
          })).filter(item => item.label && item.label.length > 0);
          
          console.log("📊 Strategy 2 - Filtered results:", results);
          return { mixed: results };
        }
      ];
      
      let parsedData: any = null;
      for (const strategy of parseStrategies) {
        parsedData = strategy();
        if (parsedData) break;
      }
      
      if (parsedData?.headers && parsedData?.values) {
        // Traditional parsing
        const { headers, values } = parsedData;
        for (let i = 0; i < headers.length && i < values.length; i++) {
          const header = headers[i].toLowerCase();
          const value = values[i];
          console.log(`📊 Processing: "${header}" = "${value}"`);
          
          const amount = parseAmount(value);
          
          if (amount && amount > 0) {
            console.log(`💰 Valid amount found: ${amount} for header: ${header}`);
            
            const label = header.charAt(0).toUpperCase() + header.slice(1) || "Unknown";
            
            if (header.includes('salaire') || header.includes('salary') || header.includes('income') || header.includes('revenus') || header.includes('revenu')) {
              const isMonthly = detectFrequency(`${header} ${value}`) ?? true;
              incomes.push({
                label: label,
                amount: amount,
                isMonthly: isMonthly,
                confidence: calculateConfidence({ amount, label, isMonthly })
              });
            } else if (header.includes('loan') || header.includes('prêt') || header.includes('crédit')) {
              const loanType = detectLoanType(`${header} ${value}`);
              loans.push({
                type: loanType,
                name: label,
                monthlyPayment: amount,
                interestRate: 0.05,
                remainingBalance: amount * 60,
                remainingMonths: 60,
                confidence: calculateConfidence({ amount, label, type: loanType })
              });
            } else {
              const category = categorizeExpense(`${header} ${value}`);
              expenses.push({
                category: category,
                label: label,
                amount: amount,
                confidence: calculateConfidence({ amount, label, category })
              });
            }
          }
        }
      } else if (parsedData?.mixed) {
        // Mixed data parsing - look for financial keywords with potential amounts
        const { mixed } = parsedData;
        for (const item of mixed) {
          const label = item.label.toLowerCase();
          console.log(`📊 Processing mixed item: "${item.label}"`);
          
          const cleanLabel = item.label.charAt(0).toUpperCase() + item.label.slice(1);
          
          if (label.includes('salaire') || label.includes('salary') || label.includes('income') || 
              label.includes('revenus') || label.includes('revenu')) {
            const isMonthly = detectFrequency(item.label) ?? true;
            incomes.push({
              label: cleanLabel,
              amount: 3000, // Default placeholder - user can edit via chat
              isMonthly: isMonthly,
              confidence: 0.6 // Lower confidence for placeholder amounts
            });
            console.log(`💰 Found income category: ${item.label}`);
          } else if (label.includes('dépenses') || label.includes('dépense') || label.includes('expenses')) {
            const category = categorizeExpense(item.label);
            expenses.push({
              category: category,
              label: cleanLabel,
              amount: 500, // Default placeholder - user can edit via chat
              confidence: 0.6 // Lower confidence for placeholder amounts
            });
            console.log(`💰 Found expense category: ${item.label}`);
          }
          
          // Check for actual amounts in the data
          const potentialAmount = parseAmount(item.possibleAmount);
          if (potentialAmount && potentialAmount > 0) {
            console.log(`💰 Found potential amount: ${potentialAmount}`);
            const category = categorizeExpense(item.label);
            expenses.push({
              category: category,
              label: "Extracted Amount",
              amount: potentialAmount,
              confidence: calculateConfidence({ amount: potentialAmount, label: "Extracted Amount", category })
            });
          }
        }
      }

      console.log("📊 Final parsing results:");
      console.log(`📊 Found ${incomes.length} incomes:`, incomes);
      console.log(`📊 Found ${expenses.length} expenses:`, expenses);
      console.log(`📊 Found ${loans.length} loans:`, loans);
      
      // Check if we found any data at all
      if (incomes.length === 0 && expenses.length === 0 && loans.length === 0) {
        throw new Error(`No financial data found in ${args.fileName}. 
        Please ensure your CSV has:
        - Headers in the first row (e.g., 'Salary', 'Rent', 'Income')
        - Numeric values in the second row
        - Common financial keywords like 'salary', 'income', 'expenses', 'loan'
        
        File content preview: ${fileContent.substring(0, 200)}...`);
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
