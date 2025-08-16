import { DebtPayoffInputs, DebtPayoffResults, PayoffStrategy } from "../domain/projects.type";

// Calculate total interest paid over the life of a loan with fixed payments
function calculateTotalInterest(balance: number, monthlyPayment: number, interestRate: number): number {
  if (interestRate === 0) return 0;
  
  let currentBalance = balance;
  let totalInterest = 0;
  const monthlyRate = interestRate / 12;
  
  while (currentBalance > 0) {
    const interestPayment = currentBalance * monthlyRate;
    const principalPayment = Math.min(monthlyPayment - interestPayment, currentBalance);
    
    totalInterest += interestPayment;
    currentBalance -= principalPayment;
    
    // Prevent infinite loop if payment doesn't cover interest
    if (principalPayment <= 0) break;
  }
  
  return Math.round(totalInterest);
}

// Calculate months needed to pay off debt with current payment
function calculatePayoffMonths(balance: number, monthlyPayment: number, interestRate: number): number {
  if (interestRate === 0) return Math.ceil(balance / monthlyPayment);
  if (monthlyPayment <= 0) return Infinity;
  
  const monthlyRate = interestRate / 12;
  const monthlyInterest = balance * monthlyRate;
  
  // If payment doesn't cover interest, payoff is impossible
  if (monthlyPayment <= monthlyInterest) return Infinity;
  
  const months = -Math.log(1 - (balance * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate);
  return Math.ceil(months);
}

// Debt Avalanche: Pay minimums on all debts, extra on highest interest rate
function calculateAvalancheStrategy(debts: DebtPayoffInputs['debts'], extraPayment: number = 0): PayoffStrategy {
  // Sort debts by interest rate (highest first)
  const sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);
  
  let totalMonths = 0;
  let totalInterest = 0;
  let totalPrincipal = debts.reduce((sum, debt) => sum + debt.balance, 0);
  let remainingDebts = [...sortedDebts];
  const payoffOrder: Array<{name: string, months: number, interestPaid: number}> = [];
  
  while (remainingDebts.length > 0) {
    // Find the highest interest debt
    const targetDebt = remainingDebts[0];
    const otherDebts = remainingDebts.slice(1);
    
    // Calculate minimum payments for other debts
    const minimumPayments = otherDebts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
    
    // Apply extra payment to target debt
    const targetPayment = targetDebt.monthlyPayment + extraPayment;
    
    // Calculate months to pay off target debt
    const monthsToPayoff = calculatePayoffMonths(targetDebt.balance, targetPayment, targetDebt.interestRate);
    
    // Calculate interest paid on target debt
    const targetInterest = calculateTotalInterest(targetDebt.balance, targetPayment, targetDebt.interestRate);
    
    // Calculate interest paid on other debts during this period
    let otherDebtsInterest = 0;
    for (const debt of otherDebts) {
      const monthsForThisDebt = Math.min(monthsToPayoff, calculatePayoffMonths(debt.balance, debt.monthlyPayment, debt.interestRate));
      otherDebtsInterest += calculateTotalInterest(debt.balance, debt.monthlyPayment, debt.interestRate) * (monthsForThisDebt / calculatePayoffMonths(debt.balance, debt.monthlyPayment, debt.interestRate));
    }
    
    totalMonths = Math.max(totalMonths, monthsToPayoff);
    totalInterest += targetInterest + otherDebtsInterest;
    
    payoffOrder.push({
      name: targetDebt.name,
      months: monthsToPayoff,
      interestPaid: targetInterest
    });
    
    // Update remaining debts (reduce balances based on payments made during target payoff period)
    remainingDebts = otherDebts.map(debt => {
      const newBalance = Math.max(0, debt.balance - (debt.monthlyPayment * monthsToPayoff));
      return { ...debt, balance: newBalance };
    }).filter(debt => debt.balance > 0);
    
    // Add freed up payment from paid-off debt to extra payment for next iteration
    extraPayment += targetDebt.monthlyPayment;
  }
  
  return {
    strategyName: "Debt Avalanche",
    description: "Pay minimums on all debts, then put extra money toward the debt with the highest interest rate",
    totalMonths,
    totalInterest,
    totalPrincipal,
    totalAmount: totalPrincipal + totalInterest,
    payoffOrder,
    monthlyPayment: debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0) + (extraPayment > 0 ? extraPayment : 0),
    interestSaved: 0, // Will be calculated in comparison
  };
}

// Debt Snowball: Pay minimums on all debts, extra on smallest balance
function calculateSnowballStrategy(debts: DebtPayoffInputs['debts'], extraPayment: number = 0): PayoffStrategy {
  // Sort debts by balance (smallest first)
  const sortedDebts = [...debts].sort((a, b) => a.balance - b.balance);
  
  let totalMonths = 0;
  let totalInterest = 0;
  let totalPrincipal = debts.reduce((sum, debt) => sum + debt.balance, 0);
  let remainingDebts = [...sortedDebts];
  const payoffOrder: Array<{name: string, months: number, interestPaid: number}> = [];
  
  while (remainingDebts.length > 0) {
    // Target the smallest balance debt
    const targetDebt = remainingDebts[0];
    const otherDebts = remainingDebts.slice(1);
    
    // Apply extra payment to target debt
    const targetPayment = targetDebt.monthlyPayment + extraPayment;
    
    // Calculate months to pay off target debt
    const monthsToPayoff = calculatePayoffMonths(targetDebt.balance, targetPayment, targetDebt.interestRate);
    
    // Calculate interest paid on target debt
    const targetInterest = calculateTotalInterest(targetDebt.balance, targetPayment, targetDebt.interestRate);
    
    // Calculate interest paid on other debts during this period
    let otherDebtsInterest = 0;
    for (const debt of otherDebts) {
      const monthsForThisDebt = Math.min(monthsToPayoff, calculatePayoffMonths(debt.balance, debt.monthlyPayment, debt.interestRate));
      otherDebtsInterest += calculateTotalInterest(debt.balance, debt.monthlyPayment, debt.interestRate) * (monthsForThisDebt / calculatePayoffMonths(debt.balance, debt.monthlyPayment, debt.interestRate));
    }
    
    totalMonths = Math.max(totalMonths, monthsToPayoff);
    totalInterest += targetInterest + otherDebtsInterest;
    
    payoffOrder.push({
      name: targetDebt.name,
      months: monthsToPayoff,
      interestPaid: targetInterest
    });
    
    // Update remaining debts
    remainingDebts = otherDebts.map(debt => {
      const newBalance = Math.max(0, debt.balance - (debt.monthlyPayment * monthsToPayoff));
      return { ...debt, balance: newBalance };
    }).filter(debt => debt.balance > 0);
    
    // Add freed up payment from paid-off debt to extra payment
    extraPayment += targetDebt.monthlyPayment;
  }
  
  return {
    strategyName: "Debt Snowball",
    description: "Pay minimums on all debts, then put extra money toward the debt with the smallest balance",
    totalMonths,
    totalInterest,
    totalPrincipal,
    totalAmount: totalPrincipal + totalInterest,
    payoffOrder,
    monthlyPayment: debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0) + (extraPayment > 0 ? extraPayment : 0),
    interestSaved: 0, // Will be calculated in comparison
  };
}

// Calculate current trajectory (just making minimum payments)
function calculateCurrentStrategy(debts: DebtPayoffInputs['debts']): PayoffStrategy {
  let totalInterest = 0;
  let totalMonths = 0;
  const totalPrincipal = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const payoffOrder: Array<{name: string, months: number, interestPaid: number}> = [];
  
  for (const debt of debts) {
    const months = calculatePayoffMonths(debt.balance, debt.monthlyPayment, debt.interestRate);
    const interest = calculateTotalInterest(debt.balance, debt.monthlyPayment, debt.interestRate);
    
    totalMonths = Math.max(totalMonths, months);
    totalInterest += interest;
    
    payoffOrder.push({
      name: debt.name,
      months,
      interestPaid: interest
    });
  }
  
  return {
    strategyName: "Current Plan",
    description: "Continue making current minimum payments on all debts",
    totalMonths,
    totalInterest,
    totalPrincipal,
    totalAmount: totalPrincipal + totalInterest,
    payoffOrder,
    monthlyPayment: debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0),
    interestSaved: 0,
  };
}

export function calculateDebtPayoffStrategy(inputs: DebtPayoffInputs): DebtPayoffResults {
  const { debts, extraMonthlyPayment = 0 } = inputs;
  
  // Validate inputs
  if (!debts || debts.length === 0) {
    throw new Error("At least one debt is required for payoff strategy analysis");
  }
  
  // Calculate all three strategies
  const currentStrategy = calculateCurrentStrategy(debts);
  const avalancheStrategy = calculateAvalancheStrategy(debts, extraMonthlyPayment);
  const snowballStrategy = calculateSnowballStrategy(debts, extraMonthlyPayment);
  
  // Calculate interest saved compared to current strategy
  avalancheStrategy.interestSaved = Math.max(0, currentStrategy.totalInterest - avalancheStrategy.totalInterest);
  snowballStrategy.interestSaved = Math.max(0, currentStrategy.totalInterest - snowballStrategy.totalInterest);
  
  // Generate recommendation
  let recommendation = "";
  let bestStrategy = "";
  const nextSteps: string[] = [];
  const warnings: string[] = [];
  
  if (extraMonthlyPayment === 0) {
    recommendation = "Consider adding extra monthly payments to accelerate debt payoff and save on interest.";
    nextSteps.push("Determine how much extra you can afford to pay monthly");
    nextSteps.push("Choose between avalanche (save more interest) or snowball (build momentum)");
  } else {
    // Compare strategies
    if (avalancheStrategy.totalInterest < snowballStrategy.totalInterest) {
      bestStrategy = "Debt Avalanche";
      const savings = snowballStrategy.totalInterest - avalancheStrategy.totalInterest;
      recommendation = `The Debt Avalanche method will save you $${(savings / 100).toFixed(2)} in interest compared to the Snowball method.`;
    } else if (snowballStrategy.totalInterest < avalancheStrategy.totalInterest) {
      bestStrategy = "Debt Snowball"; 
      const extraCost = avalancheStrategy.totalInterest - snowballStrategy.totalInterest;
      recommendation = `The Debt Snowball method costs only $${(extraCost / 100).toFixed(2)} more in interest but may provide better psychological motivation.`;
    } else {
      bestStrategy = "Either method";
      recommendation = "Both avalanche and snowball methods result in similar total interest. Choose based on your preference for motivation vs optimization.";
    }
    
    nextSteps.push("Set up automatic payments for the extra amount");
    nextSteps.push("Track progress monthly and adjust if needed");
    nextSteps.push("Avoid taking on new debt during payoff period");
  }
  
  // Add warnings
  const totalDebtPaymentRatio = (currentStrategy.monthlyPayment + extraMonthlyPayment) / (inputs.monthlyIncome || 1);
  if (totalDebtPaymentRatio > 0.4) {
    warnings.push("Your debt payments are high relative to income - consider increasing income or reducing expenses");
  }
  
  if (debts.some(debt => debt.interestRate > 0.2)) {
    warnings.push("Some debts have very high interest rates - consider debt consolidation options");
  }
  
  return {
    strategies: [currentStrategy, avalancheStrategy, snowballStrategy],
    recommendedStrategy: bestStrategy,
    recommendation,
    nextSteps,
    warnings,
    summary: {
      totalDebt: currentStrategy.totalPrincipal,
      currentMonthlyPayment: currentStrategy.monthlyPayment,
      proposedMonthlyPayment: currentStrategy.monthlyPayment + extraMonthlyPayment,
      maxInterestSavings: Math.max(avalancheStrategy.interestSaved, snowballStrategy.interestSaved),
      maxTimeSavings: Math.max(
        currentStrategy.totalMonths - avalancheStrategy.totalMonths,
        currentStrategy.totalMonths - snowballStrategy.totalMonths
      ),
    },
  };
}