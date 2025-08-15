import { MonthlyBalance, formatCurrency } from "../shared/types";

interface BalanceCardProps {
  monthlyBalance: MonthlyBalance;
}

export function BalanceCard({ monthlyBalance }: BalanceCardProps) {
  return (
    <div className={`bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:bg-white/[0.05] ${
      monthlyBalance.isPositive 
        ? 'shadow-[0_20px_50px_rgba(16,185,129,0.1)]' 
        : 'shadow-[0_20px_50px_rgba(239,68,68,0.1)]'
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
      <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
        <div className="p-3 rounded-2xl bg-black/20 backdrop-blur">
          <div className="text-white/50 text-xs mb-1">Income</div>
          <div className="text-financial-success font-semibold">
            {formatCurrency(monthlyBalance.monthlyIncome)}
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-black/20 backdrop-blur">
          <div className="text-white/50 text-xs mb-1">Expenses</div>
          <div className="text-financial-danger font-semibold">
            {formatCurrency(monthlyBalance.monthlyExpenses)}
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-black/20 backdrop-blur">
          <div className="text-white/50 text-xs mb-1">Loans</div>
          <div className="text-financial-warning font-semibold">
            {formatCurrency(monthlyBalance.monthlyLoanPayments)}
          </div>
        </div>
      </div>
    </div>
  );
}