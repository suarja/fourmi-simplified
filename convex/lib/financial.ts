/**
 * Financial calculation functions
 * All amounts are in cents for precision
 */

/**
 * Calculate monthly payment for a loan (PMT formula)
 * @param principal - Loan amount in cents
 * @param annualRate - Annual interest rate (0.035 = 3.5%)
 * @param years - Loan term in years
 * @returns Monthly payment in cents
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (principal <= 0 || years <= 0) return 0;
  
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  
  // If no interest, simple division
  if (monthlyRate === 0) {
    return Math.round(principal / months);
  }
  
  // PMT formula
  const payment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
    (Math.pow(1 + monthlyRate, months) - 1);
  
  return Math.round(payment);
}

/**
 * Calculate total interest paid over loan term
 * @param monthlyPayment - Monthly payment in cents
 * @param months - Number of months
 * @param principal - Original loan amount in cents
 * @returns Total interest in cents
 */
export function calculateTotalInterest(
  monthlyPayment: number,
  months: number,
  principal: number
): number {
  const totalPaid = monthlyPayment * months;
  return totalPaid - principal;
}

/**
 * Calculate debt-to-income ratio
 * @param monthlyDebt - Total monthly debt payments in cents
 * @param monthlyIncome - Total monthly income in cents
 * @returns Ratio as decimal (0.3 = 30%)
 */
export function calculateDebtToIncomeRatio(
  monthlyDebt: number,
  monthlyIncome: number
): number {
  if (monthlyIncome === 0) return 0;
  return monthlyDebt / monthlyIncome;
}

/**
 * Calculate savings rate
 * @param monthlyIncome - Total monthly income in cents
 * @param monthlyExpenses - Total monthly expenses in cents
 * @param monthlyDebt - Total monthly debt payments in cents
 * @returns Savings rate as decimal (0.2 = 20%)
 */
export function calculateSavingsRate(
  monthlyIncome: number,
  monthlyExpenses: number,
  monthlyDebt: number
): number {
  if (monthlyIncome === 0) return 0;
  const totalOutflow = monthlyExpenses + monthlyDebt;
  const savings = monthlyIncome - totalOutflow;
  return Math.max(0, savings / monthlyIncome);
}

/**
 * Calculate how many months to pay off a loan with extra payments
 * @param balance - Current balance in cents
 * @param monthlyPayment - Regular monthly payment in cents
 * @param extraPayment - Additional monthly payment in cents
 * @param annualRate - Annual interest rate
 * @returns Number of months to payoff
 */
export function calculatePayoffMonths(
  balance: number,
  monthlyPayment: number,
  extraPayment: number,
  annualRate: number
): number {
  if (balance <= 0) return 0;
  
  const totalPayment = monthlyPayment + extraPayment;
  const monthlyRate = annualRate / 12;
  
  if (monthlyRate === 0) {
    return Math.ceil(balance / totalPayment);
  }
  
  // Using logarithm to solve for n in compound interest formula
  const months = Math.log(totalPayment / (totalPayment - balance * monthlyRate)) / 
                 Math.log(1 + monthlyRate);
  
  return Math.ceil(months);
}

/**
 * Calculate emergency fund adequacy
 * @param currentSavings - Current savings in cents
 * @param monthlyExpenses - Monthly expenses in cents
 * @param monthlyDebt - Monthly debt payments in cents
 * @returns Number of months covered
 */
export function calculateEmergencyFundMonths(
  currentSavings: number,
  monthlyExpenses: number,
  monthlyDebt: number
): number {
  const monthlyNeeds = monthlyExpenses + monthlyDebt;
  if (monthlyNeeds === 0) return Infinity;
  return currentSavings / monthlyNeeds;
}

/**
 * Format cents to currency string
 * @param cents - Amount in cents
 * @param currency - Currency code (default EUR)
 * @returns Formatted currency string
 */
export function formatCurrency(cents: number, currency: string = 'EUR'): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Convert annual amount to monthly
 * @param annualAmount - Annual amount in cents
 * @returns Monthly amount in cents
 */
export function annualToMonthly(annualAmount: number): number {
  return Math.round(annualAmount / 12);
}

/**
 * Convert monthly amount to annual
 * @param monthlyAmount - Monthly amount in cents
 * @returns Annual amount in cents
 */
export function monthlyToAnnual(monthlyAmount: number): number {
  return monthlyAmount * 12;
}