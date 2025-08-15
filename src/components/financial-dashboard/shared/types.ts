import { Id } from "../../../../convex/_generated/dataModel";

export interface FinancialItem {
  _id: string;
  profileId: Id<"profiles">;
  _creationTime: number;
}

export interface Income extends FinancialItem {
  label: string;
  amount: number; // in cents
  isMonthly: boolean;
}

export interface Expense extends FinancialItem {
  category: string;
  label: string;
  amount: number; // in cents
}

export interface Loan extends FinancialItem {
  type: "credit_card" | "personal" | "mortgage" | "auto";
  name: string;
  monthlyPayment: number; // in cents
  interestRate: number;
  remainingBalance: number; // in cents
  remainingMonths: number;
}

export interface MonthlyBalance {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyLoanPayments: number;
  isPositive: boolean;
}

export interface FinancialData {
  incomes: Income[];
  expenses: Expense[];
  loans: Loan[];
}

export interface DashboardComponent {
  id: string;
  type: 'balance' | 'insights' | 'income' | 'expenses' | 'loans';
  title: string;
  icon: string;
  visible: boolean;
}

export const DEFAULT_COMPONENT_ORDER: DashboardComponent[] = [
  { id: 'balance', type: 'balance', title: 'Monthly Balance', icon: '📊', visible: true },
  { id: 'insights', type: 'insights', title: 'AI Insights', icon: '🤖', visible: true },
  { id: 'income', type: 'income', title: 'Income Sources', icon: '💰', visible: true },
  { id: 'expenses', type: 'expenses', title: 'Monthly Expenses', icon: '💸', visible: true },
  { id: 'loans', type: 'loans', title: 'Loans & Debt', icon: '🏦', visible: true },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};