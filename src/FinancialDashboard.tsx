import { useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useState, useEffect } from "react";

interface FinancialDashboardProps {
  profileId: Id<"profiles">;
}

export function FinancialDashboard({ profileId }: FinancialDashboardProps) {
  const financialData = useQuery(api.profiles.getFinancialData, { profileId });
  const monthlyBalance = useQuery(api.profiles.getMonthlyBalance, { profileId });
  const generateBudgetInsights = useAction(api.ai.generateBudgetInsights);
  
  const [insights, setInsights] = useState<string>("");
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    if (financialData && (financialData.incomes.length > 0 || financialData.expenses.length > 0)) {
      setLoadingInsights(true);
      generateBudgetInsights({
        incomes: financialData.incomes.map(income => ({
          label: income.label,
          amount: income.amount / 100, // Convert from cents
          isMonthly: income.isMonthly,
        })),
        expenses: financialData.expenses.map(expense => ({
          category: expense.category,
          label: expense.label,
          amount: expense.amount / 100, // Convert from cents
        })),
        loans: financialData.loans.map(loan => ({
          type: loan.type,
          name: loan.name,
          monthlyPayment: loan.monthlyPayment / 100, // Convert from cents
          interestRate: loan.interestRate,
          remainingBalance: loan.remainingBalance / 100, // Convert from cents
          remainingMonths: loan.remainingMonths,
        })),
      }).then(setInsights).finally(() => setLoadingInsights(false));
    }
  }, [financialData, generateBudgetInsights]);

  if (!financialData || !monthlyBalance) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const expensesByCategory = financialData.expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount / 100;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="h-full overflow-y-auto bg-gray-900">
      {/* Dashboard Header */}
      <div className="p-6 border-b border-gray-700 bg-gray-800">
        <h3 className="text-xl font-bold text-white mb-2">Financial Dashboard</h3>
        <p className="text-gray-400">Real-time view of your budget</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Monthly Balance Card */}
        <div className={`rounded-lg p-6 border ${
          monthlyBalance.isPositive 
            ? 'bg-green-900/20 border-green-700' 
            : 'bg-red-900/20 border-red-700'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Monthly Balance</h4>
            <span className={`text-2xl ${monthlyBalance.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {monthlyBalance.isPositive ? '📈' : '📉'}
            </span>
          </div>
          <div className={`text-3xl font-bold mb-2 ${
            monthlyBalance.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatCurrency(monthlyBalance.balance)}
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Income</div>
              <div className="text-green-400 font-semibold">
                {formatCurrency(monthlyBalance.monthlyIncome)}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Expenses</div>
              <div className="text-red-400 font-semibold">
                {formatCurrency(monthlyBalance.monthlyExpenses)}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Loans</div>
              <div className="text-orange-400 font-semibold">
                {formatCurrency(monthlyBalance.monthlyLoanPayments)}
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        {(insights || loadingInsights) && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🤖</span>
              <h4 className="text-lg font-semibold text-white">AI Insights</h4>
            </div>
            {loadingInsights ? (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                Analyzing your budget...
              </div>
            ) : (
              <div className="text-gray-300 whitespace-pre-line">{insights}</div>
            )}
          </div>
        )}

        {/* Income Sources */}
        {financialData.incomes.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">💰</span>
              Income Sources
            </h4>
            <div className="space-y-3">
              {financialData.incomes.map((income) => (
                <div key={income._id} className="flex justify-between items-center">
                  <span className="text-gray-300">{income.label}</span>
                  <span className="text-green-400 font-semibold">
                    {formatCurrency(income.amount / 100)}
                    {income.isMonthly ? '/month' : '/year'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expenses by Category */}
        {Object.keys(expensesByCategory).length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-red-400">💸</span>
              Monthly Expenses
            </h4>
            <div className="space-y-3">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-gray-300">{category}</span>
                  <span className="text-red-400 font-semibold">
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loans */}
        {financialData.loans.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-400">🏦</span>
              Loans & Debt
            </h4>
            <div className="space-y-4">
              {financialData.loans.map((loan) => (
                <div key={loan._id} className="border border-gray-600 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-white">{loan.name}</h5>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                      {loan.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Monthly Payment</div>
                      <div className="text-orange-400 font-semibold">
                        {formatCurrency(loan.monthlyPayment / 100)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Interest Rate</div>
                      <div className="text-gray-300">
                        {(loan.interestRate * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Remaining Balance</div>
                      <div className="text-gray-300">
                        {formatCurrency(loan.remainingBalance / 100)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Months Left</div>
                      <div className="text-gray-300">
                        {loan.remainingMonths}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {financialData.incomes.length === 0 && 
         financialData.expenses.length === 0 && 
         financialData.loans.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Financial Data Yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start chatting with Fourmi to add your income, expenses, and loans
            </p>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-left max-w-md mx-auto">
              <h4 className="font-semibold text-white mb-2">Try saying:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• "I earn 3000€ per month"</li>
                <li>• "My rent is 800€ monthly"</li>
                <li>• "I spend 300€ on groceries"</li>
                <li>• "I have a car loan of 250€/month"</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
