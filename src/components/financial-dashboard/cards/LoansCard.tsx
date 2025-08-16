import { useMutation } from "convex/react";
import { useTranslation } from 'react-i18next';
import { api } from "../../../../convex/_generated/api";
import { Loan, formatCurrency } from "../shared/types";
import { EditableItem } from "../shared/EditableItem";

interface LoansCardProps {
  loans: Loan[];
}

const LOAN_TYPES = [
  { value: "credit_card", translationKey: "loanTypes.credit_card" },
  { value: "personal", translationKey: "loanTypes.personal" },
  { value: "mortgage", translationKey: "loanTypes.mortgage" },
  { value: "auto", translationKey: "loanTypes.auto" }
] as const;

export function LoansCard({ loans }: LoansCardProps) {
  const { t } = useTranslation();
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
    <div className="rounded-2xl p-4 cursor-pointer hover:bg-white/[0.03] transition-all duration-200 bg-black/10 backdrop-blur" onClick={onEdit}>
      <div className="flex justify-between items-start mb-3">
        <h5 className="font-semibold text-white text-sm sm:text-base">{loan.name}</h5>
        <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/70">
          {loan.type.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
        <div className="p-2.5 rounded-xl bg-black/20">
          <div className="text-white/50 text-xs">{t('cards.loans.monthlyPayment')}</div>
          <div className="text-financial-warning font-semibold">
            {formatCurrency(loan.monthlyPayment / 100)}
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-black/20">
          <div className="text-white/50 text-xs">{t('cards.loans.interestRate')}</div>
          <div className="text-white font-medium">
            {(loan.interestRate * 100).toFixed(1)}%
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-black/20">
          <div className="text-white/50 text-xs">{t('cards.loans.remainingBalance')}</div>
          <div className="text-white font-medium">
            {formatCurrency(loan.remainingBalance / 100)}
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-black/20">
          <div className="text-white/50 text-xs">{t('cards.loans.monthsLeft')}</div>
          <div className="text-white font-medium">
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
    <div className="border border-glass-light rounded-lg p-3 sm:p-4 bg-glass-dark/50 backdrop-blur-sm">
      <div className="space-y-3">
        <div>
          <label className="text-secondary-light text-sm">{t('cards.loans.loanName')}</label>
          <input
            type="text"
            defaultValue={loan.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full px-3 py-2 bg-background-secondary text-white rounded-lg mt-1 border border-glass-light focus:border-primary focus:outline-none transition-colors"
            placeholder={t('cards.loans.loanNamePlaceholder')}
          />
        </div>
        
        <div>
          <label className="text-secondary-light text-sm">{t('cards.loans.loanType')}</label>
          <select
            defaultValue={loan.type}
            onChange={(e) => onChange({ type: e.target.value as Loan['type'] })}
            className="w-full px-3 py-2 bg-background-secondary text-white rounded-lg mt-1 border border-glass-light focus:border-primary focus:outline-none transition-colors"
          >
            {LOAN_TYPES.map(type => (
              <option key={type.value} value={type.value}>{t(`financial.${type.translationKey}`)}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-secondary-light text-sm">{t('cards.loans.monthlyPaymentAmount')}</label>
            <input
              type="number"
              defaultValue={loan.monthlyPayment / 100}
              onChange={(e) => onChange({ monthlyPayment: parseFloat(e.target.value) * 100 })}
              className="w-full px-3 py-2 bg-background-secondary text-white rounded-lg mt-1 border border-glass-light focus:border-primary focus:outline-none transition-colors"
              placeholder={t('cards.loans.monthlyPaymentPlaceholder')}
              step="0.01"
            />
          </div>

          <div>
            <label className="text-secondary-light text-sm">{t('cards.loans.interestRatePercent')}</label>
            <input
              type="number"
              defaultValue={(loan.interestRate * 100).toFixed(2)}
              onChange={(e) => onChange({ interestRate: parseFloat(e.target.value) / 100 })}
              className="w-full px-3 py-2 bg-background-secondary text-white rounded-lg mt-1 border border-glass-light focus:border-primary focus:outline-none transition-colors"
              placeholder={t('cards.loans.interestRatePlaceholder')}
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-secondary-light text-sm">{t('cards.loans.remainingBalanceAmount')}</label>
            <input
              type="number"
              defaultValue={loan.remainingBalance / 100}
              onChange={(e) => onChange({ remainingBalance: parseFloat(e.target.value) * 100 })}
              className="w-full px-3 py-2 bg-background-secondary text-white rounded-lg mt-1 border border-glass-light focus:border-primary focus:outline-none transition-colors"
              placeholder={t('cards.loans.remainingBalancePlaceholder')}
              step="0.01"
            />
          </div>

          <div>
            <label className="text-secondary-light text-sm">{t('cards.loans.monthsLeftLabel')}</label>
            <input
              type="number"
              defaultValue={loan.remainingMonths}
              onChange={(e) => onChange({ remainingMonths: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-background-secondary text-white rounded-lg mt-1 border border-glass-light focus:border-primary focus:outline-none transition-colors"
              placeholder={t('cards.loans.monthsLeftPlaceholder')}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
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
    </div>
  );

  if (loans.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:bg-white/[0.05]">
      <h4 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-financial-warning">🏦</span>
        {t('cards.loans.title')}
      </h4>
      <div className="space-y-3">
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