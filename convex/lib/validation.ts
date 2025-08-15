import { Doc } from "../_generated/dataModel";

/**
 * Validation functions for financial data
 */

// Amount validation
export function validateAmount(amount: number): { valid: boolean; error?: string } {
  if (amount <= 0) {
    return { valid: false, error: "Amount must be positive" };
  }
  if (amount > 10000000) { // 100,000 euros max
    return { valid: false, error: "Amount exceeds maximum limit (100,000€)" };
  }
  if (!Number.isFinite(amount)) {
    return { valid: false, error: "Invalid amount" };
  }
  return { valid: true };
}

// Interest rate validation (0-50% max)
export function validateInterestRate(rate: number): { valid: boolean; error?: string } {
  if (rate < 0) {
    return { valid: false, error: "Interest rate cannot be negative" };
  }
  if (rate > 0.5) {
    return { valid: false, error: "Interest rate exceeds 50%" };
  }
  return { valid: true };
}

// Check for duplicate income
export function isDuplicateIncome(
  newIncome: { label: string; amount: number; isMonthly: boolean },
  existingIncomes: Doc<"incomes">[]
): boolean {
  return existingIncomes.some(income => 
    income.label.toLowerCase() === newIncome.label.toLowerCase() &&
    Math.abs(income.amount - (newIncome.amount * 100)) < 1 && // Convert to cents and compare
    income.isMonthly === newIncome.isMonthly
  );
}

// Check for duplicate expense
export function isDuplicateExpense(
  newExpense: { category: string; label: string; amount: number },
  existingExpenses: Doc<"expenses">[]
): boolean {
  return existingExpenses.some(expense =>
    expense.category === newExpense.category &&
    expense.label.toLowerCase() === newExpense.label.toLowerCase() &&
    Math.abs(expense.amount - (newExpense.amount * 100)) < 1 // Convert to cents and compare
  );
}

// Check for duplicate loan
export function isDuplicateLoan(
  newLoan: { type: string; name: string; monthlyPayment: number },
  existingLoans: Doc<"loans">[]
): boolean {
  return existingLoans.some(loan =>
    loan.type === newLoan.type &&
    loan.name.toLowerCase() === newLoan.name.toLowerCase() &&
    Math.abs(loan.monthlyPayment - (newLoan.monthlyPayment * 100)) < 1 // Convert to cents
  );
}

// Semantic similarity check for labels (basic version)
export function areSimilarLabels(label1: string, label2: string): boolean {
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normalized1 = normalize(label1);
  const normalized2 = normalize(label2);
  
  // Exact match after normalization
  if (normalized1 === normalized2) return true;
  
  // Check if one contains the other (for variations like "salary" and "monthly salary")
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;
  
  // Common variations
  const synonyms: Record<string, string[]> = {
    salary: ['wage', 'income', 'earnings', 'pay', 'salaire'],
    rent: ['rental', 'loyer', 'housing'],
    groceries: ['food', 'supermarket', 'courses'],
    utilities: ['electricity', 'gas', 'water', 'bills'],
  };
  
  for (const [key, values] of Object.entries(synonyms)) {
    const group = [key, ...values].map(normalize);
    if (group.includes(normalized1) && group.includes(normalized2)) {
      return true;
    }
  }
  
  return false;
}

// Check for potential duplicate with fuzzy matching
export function findPotentialDuplicateIncome(
  newIncome: { label: string; amount: number; isMonthly: boolean },
  existingIncomes: Doc<"incomes">[]
): Doc<"incomes"> | null {
  for (const income of existingIncomes) {
    // Check for similar labels
    if (areSimilarLabels(income.label, newIncome.label)) {
      // Check if amounts are within 10% of each other
      const existingAmount = income.amount / 100; // Convert from cents
      const amountDiff = Math.abs(existingAmount - newIncome.amount);
      const percentDiff = amountDiff / Math.max(existingAmount, newIncome.amount);
      
      if (percentDiff < 0.1 && income.isMonthly === newIncome.isMonthly) {
        return income;
      }
    }
  }
  return null;
}

// Validate loan months
export function validateLoanMonths(months: number): { valid: boolean; error?: string } {
  if (months <= 0) {
    return { valid: false, error: "Loan term must be positive" };
  }
  if (months > 360) { // 30 years max
    return { valid: false, error: "Loan term exceeds 30 years" };
  }
  return { valid: true };
}