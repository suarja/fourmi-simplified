import { useMutation } from "convex/react";
import { useTranslation } from 'react-i18next';
import { api } from "../../../../convex/_generated/api";
import { Income, formatCurrency } from "../shared/types";
import { EditableItem } from "../shared/EditableItem";

interface IncomeCardProps {
  incomes: Income[];
}

export function IncomeCard({ incomes }: IncomeCardProps) {
  const { t } = useTranslation();
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
    <div className="cursor-pointer hover:bg-glass-dark/50 p-2 rounded-lg transition-colors" onClick={onEdit}>
      <div className="flex justify-between items-center">
        <span className="text-white">{income.label}</span>
        <span className="text-financial-success font-semibold">
          {formatCurrency(income.amount / 100)}
          {income.isMonthly ? t('cards.income.perMonth') : t('cards.income.perYear')}
        </span>
      </div>
    </div>
  );

  const renderIncomeEdit = (
    income: Income, 
    onChange: (updates: Partial<Income>) => void,
    onSave: () => void,
    onCancel: () => void
  ) => (
    <div className="space-y-3 p-3 bg-glass-dark/50 backdrop-blur-sm rounded-lg border border-glass-light">
      <div>
        <label className="text-secondary-light text-sm">{t('cards.income.label')}</label>
        <input
          type="text"
          defaultValue={income.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className="w-full px-3 py-2 bg-background-secondary text-white rounded-lg mt-1 border border-glass-light focus:border-primary focus:outline-none transition-colors"
          placeholder={t('cards.income.labelPlaceholder')}
        />
      </div>
      <div>
        <label className="text-secondary-light text-sm">{t('cards.income.amount')}</label>
        <input
          type="number"
          defaultValue={income.amount / 100}
          onChange={(e) => onChange({ amount: parseFloat(e.target.value) * 100 })}
          className="w-full px-3 py-2 bg-background-secondary text-white rounded-lg mt-1 border border-glass-light focus:border-primary focus:outline-none transition-colors"
          placeholder={t('cards.income.amountPlaceholder')}
          step="0.01"
        />
      </div>
      <div>
        <label className="text-secondary-light text-sm flex items-center gap-2">
          <input
            type="checkbox"
            defaultChecked={income.isMonthly}
            onChange={(e) => onChange({ isMonthly: e.target.checked })}
            className="rounded accent-primary"
          />
          {t('cards.income.monthlyLabel')}
        </label>
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

  if (incomes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:bg-white/[0.05]">
      <h4 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-financial-success">💰</span>
        {t('cards.income.title')}
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