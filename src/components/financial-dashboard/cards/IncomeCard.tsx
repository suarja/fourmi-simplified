import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Income, formatCurrency } from "../shared/types";
import { EditableItem } from "../shared/EditableItem";

interface IncomeCardProps {
  incomes: Income[];
}

export function IncomeCard({ incomes }: IncomeCardProps) {
  const editIncome = useMutation(api.domain.transactions.editIncome);
  const deleteIncome = useMutation(api.domain.transactions.deleteIncome);

  const handleSaveIncome = async (income: Income, updates: Partial<Income>) => {
    await editIncome({
      incomeId: income._id as any,
      label: updates.label,
      amount: updates.amount ? updates.amount / 100 : undefined, // Convert from cents to euros
      isMonthly: updates.isMonthly,
    });
  };

  const handleDeleteIncome = async (income: Income) => {
    await deleteIncome({
      incomeId: income._id as any,
    });
  };

  const renderIncomeView = (income: Income, onEdit: () => void) => (
    <div className="flex justify-between items-center cursor-pointer hover:bg-gray-700/50 p-2 rounded" onClick={onEdit}>
      <span className="text-gray-300">{income.label}</span>
      <span className="text-green-400 font-semibold">
        {formatCurrency(income.amount / 100)}
        {income.isMonthly ? '/month' : '/year'}
      </span>
    </div>
  );

  const renderIncomeEdit = (
    income: Income, 
    onChange: (updates: Partial<Income>) => void,
    onSave: () => void,
    onCancel: () => void
  ) => (
    <div className="space-y-3 p-2 bg-gray-700/50 rounded">
      <div>
        <label className="text-gray-400 text-sm">Label</label>
        <input
          type="text"
          defaultValue={income.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 text-white rounded mt-1 border border-gray-600 focus:border-blue-500 focus:outline-none"
          placeholder="e.g., Monthly salary"
        />
      </div>
      <div>
        <label className="text-gray-400 text-sm">Amount (€)</label>
        <input
          type="number"
          defaultValue={income.amount / 100}
          onChange={(e) => onChange({ amount: parseFloat(e.target.value) * 100 })}
          className="w-full px-3 py-2 bg-gray-800 text-white rounded mt-1 border border-gray-600 focus:border-blue-500 focus:outline-none"
          placeholder="e.g., 3000"
          step="0.01"
        />
      </div>
      <div>
        <label className="text-gray-400 text-sm flex items-center gap-2">
          <input
            type="checkbox"
            defaultChecked={income.isMonthly}
            onChange={(e) => onChange({ isMonthly: e.target.checked })}
            className="rounded"
          />
          Monthly (uncheck for annual)
        </label>
      </div>
      <div className="flex gap-2">
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
  );

  if (incomes.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
      <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
        <span className="text-green-400">💰</span>
        Income Sources
      </h4>
      <div className="space-y-2">
        {incomes.map((income) => (
          <EditableItem
            key={income._id}
            item={income}
            onSave={handleSaveIncome}
            onDelete={handleDeleteIncome}
            renderView={renderIncomeView}
            renderEdit={renderIncomeEdit}
          />
        ))}
      </div>
    </div>
  );
}