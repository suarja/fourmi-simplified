import { useState, useEffect } from "react";
import { useAction } from "convex/react";
import { useTranslation } from 'react-i18next';
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { FinancialData } from "../shared/types";

interface InsightsCardProps {
  profileId: Id<"profiles">;
  financialData: FinancialData;
}

export function InsightsCard({ profileId, financialData }: InsightsCardProps) {
  const { t } = useTranslation();
  const generateBudgetInsights = useAction(api.ai.generateBudgetInsights);
  
  const [insights, setInsights] = useState<string>("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [hasGeneratedInsights, setHasGeneratedInsights] = useState(false);

  // Generate insights manually when user clicks the button
  const handleGenerateInsights = async () => {
    if (!financialData || (financialData.incomes.length === 0 && financialData.expenses.length === 0)) {
      return;
    }

    setLoadingInsights(true);
    try {
      const newInsights = await generateBudgetInsights({
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
      });
      setInsights(newInsights);
      setHasGeneratedInsights(true);
      
      // Cache insights in localStorage
      const cacheKey = `insights_${profileId}`;
      const cacheData = {
        insights: newInsights,
        timestamp: Date.now(),
        dataHash: JSON.stringify(financialData) // Simple hash for data changes
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setLoadingInsights(false);
    }
  };

  // Check for cached insights on component mount
  useEffect(() => {
    if (financialData) {
      const cacheKey = `insights_${profileId}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        try {
          const cacheData = JSON.parse(cached);
          const currentDataHash = JSON.stringify(financialData);
          
          // Use cached insights if data hasn't changed and cache is less than 24 hours old
          const isRecentCache = Date.now() - cacheData.timestamp < 24 * 60 * 60 * 1000;
          const isDataUnchanged = cacheData.dataHash === currentDataHash;
          
          if (isRecentCache && isDataUnchanged && cacheData.insights) {
            setInsights(cacheData.insights);
            setHasGeneratedInsights(true);
          }
        } catch (error) {
          console.error("Error loading cached insights:", error);
        }
      }
    }
  }, [financialData, profileId]);

  return (
    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:bg-white/[0.05]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl">🤖</span>
          <h4 className="text-base sm:text-lg font-semibold text-white">{t('cards.insights.title')}</h4>
        </div>
        
        {!loadingInsights && (
          <button
            onClick={handleGenerateInsights}
            disabled={loadingInsights}
            className="px-3 py-1.5 text-sm bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasGeneratedInsights ? t('cards.insights.refresh') : t('cards.insights.generate')}
          </button>
        )}
      </div>
      
      {loadingInsights ? (
        <div className="flex items-center gap-2 text-secondary-light">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          {t('cards.insights.analyzing')}
        </div>
      ) : insights ? (
        <div className="text-gray-300 whitespace-pre-line">{insights}</div>
      ) : (
        <div className="text-secondary-light text-center py-4">
          {t('cards.insights.clickToGenerate')}
        </div>
      )}
    </div>
  );
}