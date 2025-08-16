import { useState, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
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
  const generateEducationalInsights = useAction(api.domain.agents.generateEducationalInsights);
  const existingInsights = useQuery(api.insights.getLatestInsights, { profileId });
  
  const [insights, setInsights] = useState<string>("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [hasGeneratedInsights, setHasGeneratedInsights] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [insightMetadata, setInsightMetadata] = useState<{
    cached: boolean;
    timestamp: number;
    expiresAt: number;
  } | null>(null);

  // Generate insights manually when user clicks the button
  const handleGenerateInsights = async () => {
    setLoadingInsights(true);
    setErrorMessage(null);
    
    try {
      const result = await generateEducationalInsights({
        profileId: profileId,
        // No need to pass financial data - the agent will gather it using tools
      });
      
      if (result.insights) {
        // Insights are now automatically saved to database in the backend
        // The UI will update automatically through the existingInsights query
        setErrorMessage(null);
      } else {
        throw new Error("No insights received from the agent");
      }
    } catch (error: any) {
      console.error("Error generating educational insights:", error);
      setErrorMessage(error.message || "I'm having trouble generating insights right now. Please try again in a moment!");
      setInsights(""); // Clear any previous insights
    } finally {
      setLoadingInsights(false);
    }
  };

  // Load existing insights from database
  useEffect(() => {
    if (existingInsights) {
      setInsights(existingInsights.content);
      setHasGeneratedInsights(true);
      setInsightMetadata({
        cached: true,
        timestamp: existingInsights.createdAt,
        expiresAt: existingInsights.expiresAt,
      });
    }
  }, [existingInsights]);

  return (
    <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:bg-white/[0.05]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl">🎓</span>
          <h4 className="text-base sm:text-lg font-semibold text-white">{t('cards.insights.title')}</h4>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Educational</span>
        </div>
        
        {!loadingInsights && (
          <button
            onClick={handleGenerateInsights}
            disabled={loadingInsights}
            className="px-3 py-1.5 text-sm bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span className="text-xs">✨</span>
            {hasGeneratedInsights ? (insightMetadata?.cached ? 'Refresh' : 'Refresh') : 'Generate Insights'}
          </button>
        )}
      </div>
      
      {loadingInsights ? (
        <div className="flex flex-col items-center gap-3 text-secondary-light py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <div className="text-center">
            <div className="font-medium">🧠 Analyzing your financial situation...</div>
            <div className="text-sm opacity-75">Creating personalized educational insights</div>
            <div className="text-xs opacity-50 mt-2">This may take 10-15 seconds</div>
          </div>
        </div>
      ) : errorMessage ? (
        <div className="text-center py-6">
          <div className="text-4xl mb-3">⚠️</div>
          <div className="text-red-400 font-medium mb-2">Unable to Generate Insights</div>
          <div className="text-secondary-light text-sm mb-4">
            {errorMessage}
          </div>
          <button
            onClick={handleGenerateInsights}
            className="px-4 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : insights ? (
        <div>
          <div className="text-gray-300 whitespace-pre-line leading-relaxed mb-4">{insights}</div>
          {insightMetadata && (
            <div className="text-xs text-white/40 border-t border-white/10 pt-3">
              {insightMetadata.cached ? "📋 Retrieved from cache" : "✨ Freshly generated"} • 
              Created {new Date(insightMetadata.timestamp).toLocaleDateString()} at {new Date(insightMetadata.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {insightMetadata.expiresAt && (
                <span> • Expires {new Date(insightMetadata.expiresAt).toLocaleDateString()}</span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="text-4xl mb-3">🎯</div>
          <div className="text-white font-medium mb-2">Get Personalized Financial Education</div>
          <div className="text-secondary-light text-sm mb-4">
            I'll analyze your financial situation and provide guilt-free, educational guidance to help you improve.
          </div>
          <div className="text-xs text-white/50">
            • Adaptive to your skill level<br/>
            • Focused on next steps<br/>
            • Encouraging tone
          </div>
        </div>
      )}
    </div>
  );
}