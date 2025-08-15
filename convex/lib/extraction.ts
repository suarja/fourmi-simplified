import { z } from "zod";

/**
 * Fact extraction utilities for AI processing
 */

// Schema for a pending fact that needs validation
export const PendingFactSchema = z.object({
  id: z.string(),
  type: z.enum(["income", "expense", "loan"]),
  data: z.any(), // Will be typed based on type
  confidence: z.number().min(0).max(1),
  extractedFrom: z.string(),
  suggestedAction: z.enum(["add", "update", "skip"]),
  similarExisting: z.any().optional(),
});

export type PendingFact = z.infer<typeof PendingFactSchema>;

// Schema for extracted financial data
export const ExtractedFinancialDataSchema = z.object({
  incomes: z.array(z.object({
    label: z.string(),
    amount: z.number(),
    isMonthly: z.boolean(),
    confidence: z.number().min(0).max(1).optional(),
  })),
  expenses: z.array(z.object({
    category: z.enum(["Housing", "Food", "Transport", "Utilities", "Entertainment", "Healthcare", "Other"]),
    label: z.string(),
    amount: z.number(),
    confidence: z.number().min(0).max(1).optional(),
  })),
  loans: z.array(z.object({
    type: z.enum(["credit_card", "personal", "mortgage", "auto"]),
    name: z.string(),
    monthlyPayment: z.number(),
    interestRate: z.number(),
    remainingBalance: z.number(),
    remainingMonths: z.number(),
    confidence: z.number().min(0).max(1).optional(),
  })),
  summary: z.string(),
  pendingFacts: z.array(PendingFactSchema).optional(),
});

export type ExtractedFinancialData = z.infer<typeof ExtractedFinancialDataSchema>;

/**
 * Parse amount from various formats
 * @param text - Text containing amount (e.g., "3,000€", "$2.5k", "1500")
 * @returns Amount in base units (euros) or null if not parseable
 */
export function parseAmount(text: string): number | null {
  // Remove currency symbols and spaces
  let cleaned = text.replace(/[€$£¥₹]/g, '').trim();
  
  // Handle 'k' suffix (thousands)
  const hasK = /k$/i.test(cleaned);
  cleaned = cleaned.replace(/k$/i, '');
  
  // Handle different decimal/thousand separators
  // European format: 1.000,50 or 1 000,50
  // US format: 1,000.50
  
  // If it has both . and , determine which is decimal
  if (cleaned.includes('.') && cleaned.includes(',')) {
    const lastDot = cleaned.lastIndexOf('.');
    const lastComma = cleaned.lastIndexOf(',');
    
    if (lastComma > lastDot) {
      // European format: . for thousands, , for decimal
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // US format: , for thousands, . for decimal
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (cleaned.includes(',')) {
    // Check if comma is decimal separator (European) or thousand separator (US)
    const parts = cleaned.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      // Likely European decimal
      cleaned = cleaned.replace(',', '.');
    } else {
      // Likely thousand separator
      cleaned = cleaned.replace(/,/g, '');
    }
  }
  
  // Remove spaces (French thousand separator)
  cleaned = cleaned.replace(/\s/g, '');
  
  const amount = parseFloat(cleaned);
  if (isNaN(amount)) return null;
  
  return hasK ? amount * 1000 : amount;
}

/**
 * Detect frequency from text
 * @param text - Text containing frequency hints
 * @returns true if monthly, false if annual, null if unclear
 */
export function detectFrequency(text: string): boolean | null {
  const lower = text.toLowerCase();
  
  // Monthly indicators
  const monthlyPatterns = [
    'month', 'mensuel', 'mensual', '/m', 'per month',
    'monthly', 'mois', 'monat', 'mes'
  ];
  
  // Annual indicators
  const annualPatterns = [
    'year', 'annual', 'annuel', 'anual', '/y', 'per year',
    'yearly', 'année', 'jahr', 'año', 'an'
  ];
  
  const hasMonthly = monthlyPatterns.some(p => lower.includes(p));
  const hasAnnual = annualPatterns.some(p => lower.includes(p));
  
  if (hasMonthly && !hasAnnual) return true;
  if (hasAnnual && !hasMonthly) return false;
  
  // Default to monthly for most expenses
  return true;
}

/**
 * Categorize expense based on keywords
 * @param label - Expense label/description
 * @returns Expense category
 */
export function categorizeExpense(label: string): string {
  const lower = label.toLowerCase();
  
  const categories: Record<string, string[]> = {
    Housing: ['rent', 'mortgage', 'loyer', 'property', 'housing', 'home', 'apartment', 'logement'],
    Food: ['groceries', 'food', 'supermarket', 'restaurant', 'courses', 'alimentation', 'nourriture'],
    Transport: ['car', 'gas', 'fuel', 'transport', 'uber', 'taxi', 'metro', 'bus', 'voiture', 'essence'],
    Utilities: ['electricity', 'water', 'internet', 'phone', 'gas', 'utility', 'électricité', 'eau', 'téléphone'],
    Entertainment: ['netflix', 'spotify', 'cinema', 'entertainment', 'loisirs', 'divertissement', 'sport'],
    Healthcare: ['health', 'medical', 'doctor', 'pharmacy', 'insurance', 'santé', 'médecin', 'pharmacie'],
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lower.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
}

/**
 * Determine loan type from description
 * @param description - Loan description
 * @returns Loan type
 */
export function detectLoanType(description: string): "credit_card" | "personal" | "mortgage" | "auto" {
  const lower = description.toLowerCase();
  
  if (lower.includes('credit') || lower.includes('card') || lower.includes('carte')) {
    return 'credit_card';
  }
  if (lower.includes('mortgage') || lower.includes('home') || lower.includes('house') || 
      lower.includes('hypothèque') || lower.includes('immobilier')) {
    return 'mortgage';
  }
  if (lower.includes('car') || lower.includes('auto') || lower.includes('vehicle') || 
      lower.includes('voiture')) {
    return 'auto';
  }
  
  return 'personal';
}

/**
 * Calculate confidence score for extracted fact
 * @param fact - Extracted fact data
 * @returns Confidence score between 0 and 1
 */
export function calculateConfidence(fact: any): number {
  let confidence = 0.5; // Base confidence
  
  // Increase confidence for clear amount
  if (fact.amount && fact.amount > 0 && fact.amount < 1000000) {
    confidence += 0.2;
  }
  
  // Increase confidence for clear label
  if (fact.label && fact.label.length > 2) {
    confidence += 0.1;
  }
  
  // Increase confidence for detected frequency
  if ('isMonthly' in fact) {
    confidence += 0.1;
  }
  
  // Increase confidence for categorized items
  if (fact.category && fact.category !== 'Other') {
    confidence += 0.1;
  }
  
  return Math.min(1, confidence);
}