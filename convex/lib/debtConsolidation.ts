import { ConsolidationOption, DebtConsolidationInputs, DebtConsolidationResults } from "../domain/projects.type";

// PMT formula for monthly payment calculation
function calculateMonthlyPayment(principal: number, rate: number, months: number): number {
  if (rate === 0) return principal / months;
  
  const monthlyRate = rate / 12;
  const payment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
    (Math.pow(1 + monthlyRate, months) - 1);
  
  return Math.round(payment);
}

// Calculate total interest paid over life of loan
function calculateTotalInterest(principal: number, monthlyPayment: number, months: number): number {
  return (monthlyPayment * months) - principal;
}

// Calculate months to pay off debt with current payment
function calculatePayoffMonths(balance: number, monthlyPayment: number, interestRate: number): number {
  if (interestRate === 0) return Math.ceil(balance / monthlyPayment);
  
  const monthlyRate = interestRate / 12;
  const months = -Math.log(1 - (balance * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate);
  
  return Math.ceil(months);
}

// Eligibility checks for different consolidation options
function checkEligibility(
  option: ConsolidationOption, 
  totalDebt: number, 
  monthlyIncome: number, 
  creditScore?: number
): boolean {
  // Basic debt-to-income check (assume max 36% DTI for new loan)
  const maxLoanAmount = monthlyIncome * 0.36 * 12; // Annual income * 36%
  
  if (totalDebt > maxLoanAmount) return false;
  
  // Credit score requirements (simplified)
  if (creditScore) {
    switch (option.type) {
      case "personal_loan":
        return creditScore >= 600;
      case "balance_transfer":
        return creditScore >= 650;
      case "heloc":
        return creditScore >= 680;
    }
  }
  
  // If max amount specified, check it
  if (option.maxAmount && totalDebt > option.maxAmount) {
    return false;
  }
  
  return true;
}

export function calculateDebtConsolidation(inputs: DebtConsolidationInputs): DebtConsolidationResults {
  const { existingDebts, consolidationOptions, monthlyIncome, creditScore } = inputs;
  
  // Calculate current debt situation
  const totalCurrentDebt = existingDebts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalCurrentPayment = existingDebts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
  
  // Calculate total interest for current debts
  let totalCurrentInterest = 0;
  for (const debt of existingDebts) {
    const months = calculatePayoffMonths(debt.balance, debt.monthlyPayment, debt.interestRate);
    totalCurrentInterest += calculateTotalInterest(debt.balance, debt.monthlyPayment, months);
  }
  
  // Analyze each consolidation option
  const consolidationComparison = consolidationOptions.map(option => {
    const eligible = checkEligibility(option, totalCurrentDebt, monthlyIncome, creditScore);
    
    if (!eligible) {
      return {
        type: option.type,
        eligible: false,
        newMonthlyPayment: 0,
        totalInterest: 0,
        monthsSaved: 0,
        totalSavings: 0,
        details: {
          rate: option.rate,
          term: option.term,
          fees: option.fees,
        },
      };
    }
    
    // Calculate new loan details
    const newMonthlyPayment = calculateMonthlyPayment(totalCurrentDebt, option.rate, option.term);
    const newTotalInterest = calculateTotalInterest(totalCurrentDebt, newMonthlyPayment, option.term);
    
    // Calculate current payoff timeline
    const currentMonths = Math.max(...existingDebts.map(debt => 
      calculatePayoffMonths(debt.balance, debt.monthlyPayment, debt.interestRate)
    ));
    
    const monthsSaved = Math.max(0, currentMonths - option.term);
    const totalSavings = Math.max(0, totalCurrentInterest - newTotalInterest - option.fees);
    
    return {
      type: option.type,
      eligible: true,
      newMonthlyPayment,
      totalInterest: newTotalInterest,
      monthsSaved,
      totalSavings,
      details: {
        rate: option.rate,
        term: option.term,
        fees: option.fees,
      },
    };
  });
  
  // Generate recommendation
  const eligibleOptions = consolidationComparison.filter(opt => opt.eligible);
  let recommendation = "";
  const warnings: string[] = [];
  const nextSteps: string[] = [];
  
  if (eligibleOptions.length === 0) {
    recommendation = "Based on your current situation, debt consolidation may not be the best option right now.";
    nextSteps.push("Focus on paying down existing debt to improve your debt-to-income ratio");
    nextSteps.push("Consider increasing your income or reducing other expenses");
    if (creditScore && creditScore < 650) {
      nextSteps.push("Work on improving your credit score");
    }
  } else {
    // Find best option (highest total savings)
    const bestOption = eligibleOptions.reduce((best, current) => 
      current.totalSavings > best.totalSavings ? current : best
    );
    
    if (bestOption.totalSavings > 0) {
      recommendation = `A ${bestOption.type.replace('_', ' ')} appears to be your best consolidation option, potentially saving you $${(bestOption.totalSavings / 100).toFixed(2)} over the life of the loan.`;
      nextSteps.push("Shop around with multiple lenders for the best rates");
      nextSteps.push("Check for any prepayment penalties on existing debts");
      nextSteps.push("Calculate the break-even point including all fees");
    } else {
      recommendation = "While you may qualify for consolidation, the savings would be minimal with current rates.";
      nextSteps.push("Consider focusing on the debt avalanche method instead");
      nextSteps.push("Look for promotional rates or better terms");
    }
  }
  
  // Add general warnings
  if (totalCurrentPayment / monthlyIncome > 0.4) {
    warnings.push("Your current debt payments are high relative to your income");
  }
  
  if (eligibleOptions.some(opt => opt.newMonthlyPayment > totalCurrentPayment)) {
    warnings.push("Some consolidation options would increase your monthly payment");
  }
  
  return {
    totalCurrentDebt,
    totalCurrentPayment,
    totalCurrentInterest,
    consolidationComparison,
    recommendation,
    nextSteps,
    warnings,
  };
}