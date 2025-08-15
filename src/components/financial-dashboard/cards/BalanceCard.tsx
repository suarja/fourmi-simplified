import { MonthlyBalance, formatCurrency } from "../shared/types";

interface BalanceCardProps {
  monthlyBalance: MonthlyBalance;
}

export function BalanceCard({ monthlyBalance }: BalanceCardProps) {
  return (
    <div className={`rounded-lg p-4 sm:p-6 border ${
      monthlyBalance.isPositive 
        ? 'bg-green-900/20 border-green-700' 
        : 'bg-red-900/20 border-red-700'
    }`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h4 className="text-base sm:text-lg font-semibold text-white">Monthly Balance</h4>
        <span className={`text-xl sm:text-2xl ${monthlyBalance.isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {monthlyBalance.isPositive ? '📈' : '📉'}
        </span>
      </div>
      <div className={`text-2xl sm:text-3xl font-bold mb-2 ${
        monthlyBalance.isPositive ? 'text-green-400' : 'text-red-400'
      }`}>
        {formatCurrency(monthlyBalance.balance)}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
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
  );
}