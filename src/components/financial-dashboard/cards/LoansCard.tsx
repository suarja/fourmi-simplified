import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loan, formatCurrency } from "../shared/types";
import { EditableItem } from "../shared/EditableItem";

interface LoansCardProps {
  loans: Loan[];
}

const LOAN_TYPES = [
  { value: "credit_card", label: "Credit Card" },
  { value: "personal", label: "Personal Loan" },
  { value: "mortgage", label: "Mortgage" },
  { value: "auto", label: "Auto Loan" }
] as const;

export function LoansCard({ loans }: LoansCardProps) {
  const editLoan = useMutation(api.domain.transactions.editLoan);
  const deleteLoan = useMutation(api.domain.transactions.deleteLoan);

  const handleSaveLoan = async (loan: Loan, updates: Partial<Loan>) => {
    await editLoan({
      loanId: loan._id as any,
      type: updates.type,
      name: updates.name,
      monthlyPayment: updates.monthlyPayment ? updates.monthlyPayment / 100 : undefined,
      interestRate: updates.interestRate,
      remainingBalance: updates.remainingBalance ? updates.remainingBalance / 100 : undefined,
      remainingMonths: updates.remainingMonths,
    });
  };

  const handleDeleteLoan = async (loan: Loan) => {
    await deleteLoan({
      loanId: loan._id as any,
    });
  };

  const renderLoanView = (loan: Loan, onEdit: () => void) => (
    <div className="border border-gray-600 rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-gray-700/20 transition-colors" onClick={onEdit}>
      <div className="flex justify-between items-start mb-2">
        <h5 className="font-semibold text-white text-sm sm:text-base">{loan.name}</h5>
        <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
          {loan.type.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
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
  );

  const renderLoanEdit = (
    loan: Loan, 
    onChange: (updates: Partial<Loan>) => void,
    onSave: () => void,
    onCancel: () => void
  ) => (
    <div className="border border-gray-600 rounded-lg p-3 sm:p-4 bg-gray-700/50">
      <div className="space-y-3">
        <div>
          <label className="text-gray-400 text-sm">Loan Name</label>
          <input
            type="text"
            defaultValue={loan.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded mt-1 border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="e.g., Car Loan, Mortgage"
          />
        </div>
        
        <div>
          <label className="text-gray-400 text-sm">Loan Type</label>
          <select
            defaultValue={loan.type}
            onChange={(e) => onChange({ type: e.target.value as Loan['type'] })}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded mt-1 border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            {LOAN_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-400 text-sm">Monthly Payment (€)</label>
            <input
              type="number"
              defaultValue={loan.monthlyPayment / 100}
              onChange={(e) => onChange({ monthlyPayment: parseFloat(e.target.value) * 100 })}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded mt-1 border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., 250"
              step="0.01"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Interest Rate (%)</label>
            <input
              type="number"
              defaultValue={(loan.interestRate * 100).toFixed(2)}
              onChange={(e) => onChange({ interestRate: parseFloat(e.target.value) / 100 })}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded mt-1 border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., 3.5"
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-400 text-sm">Remaining Balance (€)</label>
            <input
              type="number"
              defaultValue={loan.remainingBalance / 100}
              onChange={(e) => onChange({ remainingBalance: parseFloat(e.target.value) * 100 })}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded mt-1 border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., 15000"
              step="0.01"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Months Left</label>
            <input
              type="number"
              defaultValue={loan.remainingMonths}
              onChange={(e) => onChange({ remainingMonths: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded mt-1 border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., 60"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onSave}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  if (loans.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
      <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
        <span className="text-orange-400">🏦</span>
        Loans & Debt
      </h4>
      <div className="space-y-4">
        {loans.map((loan) => (
          <EditableItem
            key={loan._id}
            item={loan}
            onSave={handleSaveLoan}
            onDelete={handleDeleteLoan}
            renderView={renderLoanView}
            renderEdit={renderLoanEdit}
          />
        ))}
      </div>
    </div>
  );
}