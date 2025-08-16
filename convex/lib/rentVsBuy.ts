import { RentVsBuyInputs, RentVsBuyResults } from "../domain/projects.type";

// PMT formula for monthly mortgage payment (principal + interest only)
function calculateMonthlyMortgagePayment(principal: number, rate: number, months: number): number {
  if (rate === 0) return principal / months;
  
  const monthlyRate = rate / 12;
  const payment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
    (Math.pow(1 + monthlyRate, months) - 1);
  
  return Math.round(payment);
}

// Calculate compound interest growth
function calculateCompoundGrowth(principal: number, rate: number, years: number): number {
  return Math.round(principal * Math.pow(1 + rate, years));
}

// Calculate total interest paid over mortgage life
function calculateTotalMortgageInterest(principal: number, monthlyPayment: number, months: number): number {
  return (monthlyPayment * months) - principal;
}

// Calculate remaining mortgage balance at any point
function calculateRemainingMortgageBalance(
  originalPrincipal: number, 
  monthlyPayment: number, 
  rate: number, 
  monthsPaid: number
): number {
  if (rate === 0) return originalPrincipal - (monthlyPayment * monthsPaid);
  
  const monthlyRate = rate / 12;
  const totalMonths = Math.ceil(-Math.log(1 - (originalPrincipal * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate));
  
  if (monthsPaid >= totalMonths) return 0;
  
  const remaining = originalPrincipal * 
    (Math.pow(1 + monthlyRate, totalMonths) - Math.pow(1 + monthlyRate, monthsPaid)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
  return Math.max(0, Math.round(remaining));
}

export function calculateRentVsBuy(inputs: RentVsBuyInputs): RentVsBuyResults {
  const {
    propertyPrice,
    downPaymentPercent,
    mortgageRate,
    mortgageTermYears,
    monthlyRent,
    rentIncreaseRate,
    propertyTaxRate,
    homeInsurance,
    maintenanceRate,
    hoaFees = 0,
    closingCosts = 0,
    homeAppreciationRate,
    investmentReturnRate,
    timeHorizonYears,
    monthlyIncome
  } = inputs;

  // Calculate mortgage details
  const downPayment = Math.round(propertyPrice * downPaymentPercent);
  const loanAmount = propertyPrice - downPayment;
  const mortgageMonths = mortgageTermYears * 12;
  const monthlyMortgagePayment = calculateMonthlyMortgagePayment(loanAmount, mortgageRate, mortgageMonths);
  
  // Calculate monthly carrying costs
  const monthlyPropertyTax = Math.round((propertyPrice * propertyTaxRate) / 12);
  const monthlyInsurance = Math.round(homeInsurance / 12);
  const monthlyMaintenance = Math.round((propertyPrice * maintenanceRate) / 12);
  
  // Total monthly payment (PITI + HOA + Maintenance)
  const totalMonthlyPayment = monthlyMortgagePayment + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance + hoaFees;
  
  // Buy scenario calculations over time horizon
  const yearsToAnalyze = timeHorizonYears;
  const monthsToAnalyze = yearsToAnalyze * 12;
  
  // Calculate total costs for buying
  let totalMortgageInterest = 0;
  let totalPrincipalPaid = 0;
  let totalPropertyTax = 0;
  let totalInsurance = 0;
  let totalMaintenance = 0;
  let totalHOA = 0;
  
  // Calculate costs over the analysis period
  const mortgagePaymentsToMake = Math.min(monthsToAnalyze, mortgageMonths);
  
  if (mortgagePaymentsToMake > 0) {
    totalMortgageInterest = calculateTotalMortgageInterest(loanAmount, monthlyMortgagePayment, mortgagePaymentsToMake) - 
                           (calculateTotalMortgageInterest(loanAmount, monthlyMortgagePayment, mortgageMonths) - 
                            calculateTotalMortgageInterest(loanAmount, monthlyMortgagePayment, mortgageMonths - mortgagePaymentsToMake));
    totalPrincipalPaid = (monthlyMortgagePayment * mortgagePaymentsToMake) - totalMortgageInterest;
  }
  
  // Other carrying costs scale with time and property value appreciation
  for (let year = 1; year <= yearsToAnalyze; year++) {
    const currentPropertyValue = calculateCompoundGrowth(propertyPrice, homeAppreciationRate, year);
    const yearlyPropertyTax = currentPropertyValue * propertyTaxRate;
    const yearlyMaintenance = currentPropertyValue * maintenanceRate;
    
    totalPropertyTax += yearlyPropertyTax;
    totalInsurance += homeInsurance; // Insurance typically doesn't scale with home value as directly
    totalMaintenance += yearlyMaintenance;
    totalHOA += hoaFees * 12;
  }
  
  // Final home value and equity
  const finalHomeValue = calculateCompoundGrowth(propertyPrice, homeAppreciationRate, yearsToAnalyze);
  const remainingMortgageBalance = calculateRemainingMortgageBalance(loanAmount, monthlyMortgagePayment, mortgageRate, mortgagePaymentsToMake);
  const finalEquity = finalHomeValue - remainingMortgageBalance;
  
  // Total buying costs
  const totalBuyingCosts = downPayment + closingCosts + totalMortgageInterest + totalPrincipalPaid + 
                          totalPropertyTax + totalInsurance + totalMaintenance + totalHOA;
  const netBuyingCost = totalBuyingCosts - finalEquity;
  
  // Rent scenario calculations
  let totalRentPaid = 0;
  let currentRent = monthlyRent;
  
  for (let month = 1; month <= monthsToAnalyze; month++) {
    totalRentPaid += currentRent;
    
    // Increase rent annually
    if (month % 12 === 0) {
      currentRent = Math.round(currentRent * (1 + rentIncreaseRate));
    }
  }
  
  const averageMonthlyRent = Math.round(totalRentPaid / monthsToAnalyze);
  
  // Investment opportunity cost - what if down payment was invested instead
  const downPaymentInvested = calculateCompoundGrowth(downPayment + closingCosts, investmentReturnRate, yearsToAnalyze);
  const totalRentCost = totalRentPaid; // For rent scenario, we don't add opportunity cost to total cost in final comparison
  
  // Comparison
  const buyingIsBetter = netBuyingCost < totalRentCost;
  const costDifference = netBuyingCost - totalRentCost;
  const monthlyDifference = totalMonthlyPayment - monthlyRent;
  
  // Calculate break-even point (when buying becomes cheaper than renting)
  let breakEvenYears = yearsToAnalyze;
  if (!buyingIsBetter) {
    // Simple approximation - this could be more sophisticated
    const annualBuyingCost = totalMonthlyPayment * 12;
    const annualRentCost = monthlyRent * 12 * (1 + rentIncreaseRate / 2); // Average over time
    const annualEquityBuild = (finalEquity / yearsToAnalyze); // Simplified
    
    if (annualRentCost > (annualBuyingCost - annualEquityBuild)) {
      breakEvenYears = Math.max(yearsToAnalyze, 10); // Conservative estimate
    } else {
      breakEvenYears = Math.min(yearsToAnalyze * 1.5, 15); // If still not better, estimate longer
    }
  } else {
    // If buying is already better, break-even is within the analysis period
    breakEvenYears = Math.max(3, yearsToAnalyze * 0.7); // Conservative estimate
  }
  
  // Generate recommendation
  let recommendation = "";
  const nextSteps: string[] = [];
  const warnings: string[] = [];
  const assumptions: string[] = [];
  
  if (buyingIsBetter) {
    const savings = Math.abs(costDifference);
    recommendation = `Buying appears to be the better choice, potentially saving you $${(savings / 100).toFixed(2)} over ${yearsToAnalyze} years.`;
    nextSteps.push("Get pre-approved for a mortgage to understand your actual rate");
    nextSteps.push("Factor in your specific tax situation (mortgage interest deduction)");
    nextSteps.push("Consider your job stability and likelihood of moving");
  } else {
    const extraCost = costDifference;
    recommendation = `Renting appears to be more cost-effective, saving you $${(Math.abs(extraCost) / 100).toFixed(2)} over ${yearsToAnalyze} years.`;
    nextSteps.push("Consider investing the down payment in index funds or other investments");
    nextSteps.push("Re-evaluate when rent increases or if home prices change significantly");
    nextSteps.push("Factor in the flexibility benefits of renting");
  }
  
  // Add warnings
  if (monthlyIncome && totalMonthlyPayment / monthlyIncome > 0.28) {
    warnings.push("Housing payment would exceed 28% of income - consider a less expensive property");
  }
  
  if (downPaymentPercent < 0.2) {
    warnings.push("Down payment below 20% typically requires PMI, increasing monthly costs");
  }
  
  if (monthlyDifference > monthlyRent * 0.5) {
    warnings.push("Buying costs significantly more monthly - ensure you can afford the payment");
  }
  
  if (homeAppreciationRate > 0.05) {
    warnings.push("Home appreciation rate above 5% may be optimistic for long-term planning");
  }
  
  // Add assumptions
  assumptions.push(`Home appreciates at ${(homeAppreciationRate * 100).toFixed(1)}% annually`);
  assumptions.push(`Rent increases at ${(rentIncreaseRate * 100).toFixed(1)}% annually`);
  assumptions.push(`Investment return rate: ${(investmentReturnRate * 100).toFixed(1)}%`);
  assumptions.push(`Property tax rate: ${(propertyTaxRate * 100).toFixed(2)}%`);
  assumptions.push(`Maintenance costs: ${(maintenanceRate * 100).toFixed(1)}% of home value annually`);
  
  return {
    buyScenario: {
      totalCost: totalBuyingCosts,
      monthlyPayment: totalMonthlyPayment,
      totalInterest: totalMortgageInterest,
      totalPrincipal: totalPrincipalPaid,
      totalMaintenance: totalMaintenance,
      totalTaxes: totalPropertyTax,
      totalInsurance: totalInsurance,
      homeValue: finalHomeValue,
      equity: finalEquity,
      netCost: netBuyingCost,
    },
    rentScenario: {
      totalRentPaid,
      averageMonthlyRent,
      downPaymentInvested,
      totalCost: totalRentCost,
    },
    comparison: {
      buyingIsBetter,
      costDifference,
      breakEvenYears,
      monthlyDifference,
    },
    recommendation,
    nextSteps,
    warnings,
    assumptions,
  };
}