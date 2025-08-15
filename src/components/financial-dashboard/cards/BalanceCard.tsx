import { MonthlyBalance, formatCurrency } from "../shared/types";

interface BalanceCardProps {
  monthlyBalance: MonthlyBalance;
}

export function BalanceCard({ monthlyBalance }: BalanceCardProps) {
  return (
    <div className={`bg-glass-card backdrop-blur-xl rounded-bento p-4 sm:p-6 border shadow-glass hover:shadow-glass-hover transition-all duration-300 ${
      monthlyBalance.isPositive 
        ? 'border-financial-success/20 shadow-financial' 
        : 'border-financial-danger/20'
    }`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h4 className="text-base sm:text-lg font-semibold text-white">Monthly Balance</h4>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          monthlyBalance.isPositive 
            ? 'bg-gradient-to-br from-financial-success to-primary-light shadow-financial' 
            : 'bg-gradient-to-br from-financial-danger to-red-400'
        }`}>
          <span className="text-xl">
            {monthlyBalance.isPositive ? '📈' : '📉'}
          </span>
        </div>
      </div>
      <div className={`text-2xl sm:text-3xl font-bold mb-4 ${
        monthlyBalance.isPositive ? 'text-financial-success' : 'text-financial-danger'
      }`}>
        {formatCurrency(monthlyBalance.balance)}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
        <div className="p-2 rounded-lg bg-background-secondary/60 border border-glass-light/20">
          <div className="text-secondary-light text-xs">Income</div>
          <div className="text-financial-success font-semibold">
            {formatCurrency(monthlyBalance.monthlyIncome)}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-background-secondary/60 border border-glass-light/20">
          <div className="text-secondary-light text-xs">Expenses</div>
          <div className="text-financial-danger font-semibold">
            {formatCurrency(monthlyBalance.monthlyExpenses)}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-background-secondary/60 border border-glass-light/20">
          <div className="text-secondary-light text-xs">Loans</div>
          <div className="text-financial-warning font-semibold">
            {formatCurrency(monthlyBalance.monthlyLoanPayments)}
          </div>
        </div>
      </div>
    </div>
  );
}