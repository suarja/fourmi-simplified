import { useMutation } from "convex/react";
import { useTranslation } from 'react-i18next';
import { api } from "../../../../convex/_generated/api";
import { Expense, formatCurrency } from "../shared/types";
import { EditableItem } from "../shared/EditableItem";

interface ExpensesCardProps {
  expenses: Expense[];
}

const EXPENSE_CATEGORIES = [
  "Housing",
  "Food", 
  "Transport",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Other"
];

export function ExpensesCard({ expenses }: ExpensesCardProps) {
  const { t } = useTranslation();
  const editExpense = useMutation(api.domain.transactions.editExpense);
  const deleteExpense = useMutation(api.domain.transactions.deleteExpense);

  const handleSaveExpense = async (expense: Expense, updates: Partial<Expense>) => {
    await editExpense({
      expenseId: expense._id as any,
      category: updates.category,
      label: updates.label,
      amount: updates.amount ? updates.amount / 100 : undefined, // Convert from cents to euros
    });
  };

  const handleDeleteExpense = async (expense: Expense) => {
    await deleteExpense({
      expenseId: expense._id as any,
    });
  };

  const renderExpenseView = (expense: Expense, onEdit: () => void) => (
    <div className="cursor-pointer hover:bg-glass-dark/50 p-2 rounded-lg transition-colors" onClick={onEdit}>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-white">{expense.label}</span>
          <span className="text-secondary-light text-sm ml-2">({expense.category})</span>
        </div>
        <span className="text-financial-danger font-semibold">
          {formatCurrency(expense.amount / 100)}
        </span>
      </div>
    </div>
  );

  const renderExpenseEdit = (
    expense: Expense, 
    onChange: (updates: Partial<Expense>) => void,
    onSave: () => void,
    onCancel: () => void
  ) => (
    <div className="space-y-3 p-3 bg-glass-dark/50 backdrop-blur-sm rounded-lg border border-glass-light">
      <div>
        <label className="text-secondary-light text-sm">{t('cards.expenses.label')}</label>
        <input
          type="text"
          defaultValue={expense.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className="w-full px-3 py-2 bg-background-secondary text-white rounded-lg mt-1 border border-glass-light focus:border-primary focus:outline-none transition-colors"
          placeholder={t('cards.expenses.labelPlaceholder')}
        />
      </div>
      <div>
        <label className="text-secondary-light text-sm">{t('cards.expenses.category')}</label>
        <select
          defaultValue={expense.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className="w-full px-3 py-2 bg-background-secondary text-white rounded-lg mt-1 border border-glass-light focus:border-primary focus:outline-none transition-colors"
        >
          {EXPENSE_CATEGORIES.map(category => (
            <option key={category} value={category}>{t(`financial.categories.${category}`)}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-secondary-light text-sm">{t('cards.expenses.amount')}</label>
        <input
          type="number"
          defaultValue={expense.amount / 100}
          onChange={(e) => onChange({ amount: parseFloat(e.target.value) * 100 })}
          className="w-full px-3 py-2 bg-background-secondary text-white rounded-lg mt-1 border border-glass-light focus:border-primary focus:outline-none transition-colors"
          placeholder={t('cards.expenses.amountPlaceholder')}
          step="0.01"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm transition-colors"
        >
          {t('common.save')}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 bg-secondary hover:bg-secondary-hover text-white rounded-lg text-sm transition-colors"
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  );

  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:bg-white/[0.05]">
      <h4 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-financial-danger">💸</span>
        {t('cards.expenses.title')}
      </h4>
      <div className="space-y-2">
        {expenses.map((expense) => (
          <EditableItem
            key={expense._id}
            item={expense}
            onSave={handleSaveExpense}
            onDelete={handleDeleteExpense}
            renderView={renderExpenseView}
            renderEdit={renderExpenseEdit}
          />
        ))}
      </div>
    </div>
  );
}