import { useQuery, useAction, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";


// Pending Facts Card Component


export function PendingFactsCard({ facts, profileId }: { 
    facts: any[]; 
    profileId: Id<"profiles">;
  }) {
    const { t } = useTranslation();
    const confirmFact = useMutation(api.domain.facts.confirmPendingFact);
    const rejectFact = useMutation(api.domain.facts.rejectPendingFact);
    const updateFact = useMutation(api.domain.facts.updatePendingFact);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});
  
    const handleConfirm = async (factId: string) => {
      setProcessingId(factId);
      try {
        await confirmFact({ factId: factId as Id<"pendingFacts"> });
        toast.success(t('success.confirmed'));
      } catch (error) {
        console.error("Error confirming fact:", error);
        toast.error(t('errors.generic'));
      } finally {
        setProcessingId(null);
      }
    };
  
    const handleReject = async (factId: string) => {
      setProcessingId(factId);
      try {
        await rejectFact({ factId: factId as Id<"pendingFacts"> });
        toast.success(t('cards.pending.dataRejected'));
      } catch (error) {
        console.error("Error rejecting fact:", error);
        toast.error(t('errors.generic'));
      } finally {
        setProcessingId(null);
      }
    };
  
    const handleEdit = (fact: any) => {
      setEditingId(fact._id);
      setEditForm(fact.data);
    };
  
    const handleSaveEdit = async (factId: string) => {
      setProcessingId(factId);
      try {
        await updateFact({ 
          factId: factId as Id<"pendingFacts">,
          data: editForm 
        });
        toast.success(t('success.updated'));
        setEditingId(null);
        setEditForm({});
      } catch (error) {
        console.error("Error updating fact:", error);
        toast.error(t('errors.generic'));
      } finally {
        setProcessingId(null);
      }
    };
  
    const handleCancelEdit = () => {
      setEditingId(null);
      setEditForm({});
    };
  
    const formatFactDisplay = (fact: any) => {
      if (fact.type === "income") {
        return `${fact.data.label}: €${fact.data.amount}${fact.data.isMonthly ? t('cards.income.perMonth') : t('cards.income.perYear')}`;
      } else if (fact.type === "expense") {
        return `${fact.data.label} (${fact.data.category}): €${fact.data.amount}${t('cards.income.perMonth')}`;
      } else if (fact.type === "loan") {
        let display = `${fact.data.name}: €${fact.data.monthlyPayment}${t('cards.income.perMonth')}`;
        if (fact.data.interestRate) {
          display += ` @ ${(fact.data.interestRate * 100).toFixed(1)}%`;
        }
        if (fact.data.remainingMonths) {
          display += ` (${fact.data.remainingMonths} ${t('cards.pending.months')})`;
        }
        return display;
      }
      return t('cards.pending.unknownData');
    };
  
    return (
      <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⏳</span>
          <h4 className="text-lg font-semibold text-white">{t('cards.pending.title')}</h4>
          <span className="text-sm text-yellow-400">({facts.length} {facts.length === 1 ? t('cards.pending.item') : t('cards.pending.items')})</span>
        </div>
        <div className="space-y-3">
          {facts.map((fact) => (
            <div key={fact._id} className="bg-gray-800/50 rounded-lg p-3">
              {editingId === fact._id ? (
                // Edit Mode
                <div className="space-y-3">
                  <div className="text-white font-medium mb-2">
                    {t('cards.pending.edit')} {fact.type.charAt(0).toUpperCase() + fact.type.slice(1)}
                  </div>
                  
                  {fact.type === "loan" ? (
                    <>
                      <div>
                        <label className="text-gray-400 text-sm">{t('cards.loans.loanName')}</label>
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">{t('cards.loans.monthlyPaymentAmount')} *</label>
                        <input
                          type="number"
                          value={editForm.monthlyPayment || ''}
                          onChange={(e) => setEditForm({...editForm, monthlyPayment: parseFloat(e.target.value)})}
                          className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">{t('cards.loans.interestRatePercent')} - {t('cards.pending.optional')}</label>
                        <input
                          type="number"
                          step="0.1"
                          value={editForm.interestRate ? (editForm.interestRate * 100).toFixed(1) : ''}
                          onChange={(e) => setEditForm({...editForm, interestRate: e.target.value ? parseFloat(e.target.value) / 100 : undefined})}
                          className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                          placeholder={t('cards.loans.interestRatePlaceholder')}
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">{t('cards.loans.remainingBalanceAmount')} - {t('cards.pending.optional')}</label>
                        <input
                          type="number"
                          value={editForm.remainingBalance || ''}
                          onChange={(e) => setEditForm({...editForm, remainingBalance: e.target.value ? parseFloat(e.target.value) : undefined})}
                          className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">{t('cards.loans.monthsLeftLabel')} - {t('cards.pending.optional')}</label>
                        <input
                          type="number"
                          value={editForm.remainingMonths || ''}
                          onChange={(e) => setEditForm({...editForm, remainingMonths: e.target.value ? parseInt(e.target.value) : undefined})}
                          className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                        />
                      </div>
                    </>
                  ) : fact.type === "income" ? (
                    <>
                      <div>
                        <label className="text-gray-400 text-sm">Label</label>
                        <input
                          type="text"
                          value={editForm.label || ''}
                          onChange={(e) => setEditForm({...editForm, label: e.target.value})}
                          className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Amount (€)</label>
                        <input
                          type="number"
                          value={editForm.amount || ''}
                          onChange={(e) => setEditForm({...editForm, amount: parseFloat(e.target.value)})}
                          className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">
                          <input
                            type="checkbox"
                            checked={editForm.isMonthly || false}
                            onChange={(e) => setEditForm({...editForm, isMonthly: e.target.checked})}
                            className="mr-2"
                          />
                          Monthly (uncheck for annual)
                        </label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-gray-400 text-sm">Label</label>
                        <input
                          type="text"
                          value={editForm.label || ''}
                          onChange={(e) => setEditForm({...editForm, label: e.target.value})}
                          className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Category</label>
                        <select
                          value={editForm.category || 'Other'}
                          onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                          className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                        >
                          <option value="Housing">{t('financial.categories.Housing')}</option>
                          <option value="Food">{t('financial.categories.Food')}</option>
                          <option value="Transport">{t('financial.categories.Transport')}</option>
                          <option value="Utilities">{t('financial.categories.Utilities')}</option>
                          <option value="Entertainment">{t('financial.categories.Entertainment')}</option>
                          <option value="Healthcare">{t('financial.categories.Healthcare')}</option>
                          <option value="Other">{t('financial.categories.Other')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Amount (€)</label>
                        <input
                          type="number"
                          value={editForm.amount || ''}
                          onChange={(e) => setEditForm({...editForm, amount: parseFloat(e.target.value)})}
                          className="w-full px-2 py-1 bg-gray-700 text-white rounded mt-1"
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleSaveEdit(fact._id)}
                      disabled={processingId === fact._id}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors disabled:opacity-50"
                    >
                      {processingId === fact._id ? "..." : `💾 ${t('common.save')}`}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm transition-colors"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <div className="space-y-3">
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm sm:text-base">
                      {fact.type.charAt(0).toUpperCase() + fact.type.slice(1)}: {formatFactDisplay(fact)}
                    </div>
                    {fact.type === "loan" && (!fact.data.interestRate || !fact.data.remainingBalance || !fact.data.remainingMonths) && (
                      <div className="text-orange-400 text-xs sm:text-sm mt-1">⚠️ {t('cards.pending.incompleteData')}</div>
                    )}
                    {fact.suggestedAction === "skip" && (
                      <div className="text-yellow-400 text-xs sm:text-sm mt-1">⚠️ {t('cards.pending.possibleDuplicate')}</div>
                    )}
                    <div className="text-gray-400 text-xs mt-1">
                      {t('cards.pending.confidence')}: {Math.round(fact.confidence * 100)}%
                    </div>
                  </div>
                  
                  {/* Mobile: Vertical button layout */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleConfirm(fact._id)}
                      disabled={processingId === fact._id}
                      className="flex-1 px-3 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm transition-colors disabled:opacity-50 min-h-[44px]"
                    >
                      {processingId === fact._id ? "..." : `✓ ${t('common.confirm')}`}
                    </button>
                    <div className="flex gap-2 flex-1">
                      <button
                        onClick={() => handleEdit(fact)}
                        className="flex-1 px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors min-h-[44px]"
                      >
                        ✏️ <span className="hidden sm:inline">{t('common.edit')}</span>
                      </button>
                      <button
                        onClick={() => handleReject(fact._id)}
                        disabled={processingId === fact._id}
                        className="flex-1 px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm transition-colors disabled:opacity-50 min-h-[44px]"
                      >
                        {processingId === fact._id ? "..." : "✗"} <span className="hidden sm:inline">{t('common.reject')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }