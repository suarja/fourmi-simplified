import React from 'react';

// Type definitions for structured insights
export interface StructuredInsights {
  summary: string;
  financialHealth: {
    score: number;
    level: "excellent" | "good" | "fair" | "needs_improvement";
    keyStrengths: string[];
    areasForImprovement: string[];
  };
  insights: Array<{
    category: "budgeting" | "debt_management" | "emergency_fund" | "investing" | "spending" | "income";
    title: string;
    content: string;
    priority: "high" | "medium" | "low";
    actionSteps: string[];
  }>;
  nextSteps: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  encouragement: string;
  resources: Array<{
    title: string;
    description: string;
    type: "calculator" | "guide" | "tip" | "strategy";
  }>;
}

interface EducationalInsightsProps {
  insights: StructuredInsights;
}

// Category icons and colors
const categoryConfig = {
  budgeting: { icon: "📊", color: "bg-blue-500/20 text-blue-400", border: "border-blue-400/30" },
  debt_management: { icon: "💳", color: "bg-red-500/20 text-red-400", border: "border-red-400/30" },
  emergency_fund: { icon: "🛡️", color: "bg-green-500/20 text-green-400", border: "border-green-400/30" },
  investing: { icon: "📈", color: "bg-purple-500/20 text-purple-400", border: "border-purple-400/30" },
  spending: { icon: "🛒", color: "bg-orange-500/20 text-orange-400", border: "border-orange-400/30" },
  income: { icon: "💰", color: "bg-yellow-500/20 text-yellow-400", border: "border-yellow-400/30" },
};

const priorityConfig = {
  high: { icon: "🔥", color: "bg-red-500/10 border-red-400/30 text-red-400" },
  medium: { icon: "⚡", color: "bg-yellow-500/10 border-yellow-400/30 text-yellow-400" },
  low: { icon: "💡", color: "bg-blue-500/10 border-blue-400/30 text-blue-400" },
};

const healthLevelConfig = {
  excellent: { color: "text-green-400", bg: "bg-green-500/20", icon: "🌟" },
  good: { color: "text-blue-400", bg: "bg-blue-500/20", icon: "✅" },
  fair: { color: "text-yellow-400", bg: "bg-yellow-500/20", icon: "⚠️" },
  needs_improvement: { color: "text-red-400", bg: "bg-red-500/20", icon: "🎯" },
};

export function EducationalInsights({ insights }: EducationalInsightsProps) {
  const healthConfig = healthLevelConfig[insights.financialHealth.level];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white/[0.05] rounded-2xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📋</span>
          <h3 className="text-lg font-semibold text-white">Financial Summary</h3>
        </div>
        <p className="text-gray-300 leading-relaxed">{insights.summary}</p>
      </div>

      {/* Financial Health Score */}
      <div className="bg-white/[0.05] rounded-2xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">{healthConfig.icon}</span>
          <h3 className="text-lg font-semibold text-white">Financial Health</h3>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Health Score</span>
              <span className={`text-2xl font-bold ${healthConfig.color}`}>
                {insights.financialHealth.score}/100
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${healthConfig.bg} transition-all duration-300`}
                style={{ width: `${insights.financialHealth.score}%` }}
              />
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${healthConfig.bg} ${healthConfig.color}`}>
            {insights.financialHealth.level.replace('_', ' ')}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-2">💪 Strengths</h4>
            <ul className="space-y-1">
              {insights.financialHealth.keyStrengths.map((strength, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-orange-400 mb-2">🎯 Areas to Improve</h4>
            <ul className="space-y-1">
              {insights.financialHealth.areasForImprovement.map((area, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5">•</span>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Educational Insights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>🎓</span>
          Educational Insights
        </h3>
        
        {insights.insights.map((insight, index) => {
          const categoryStyle = categoryConfig[insight.category];
          const priorityStyle = priorityConfig[insight.priority];
          
          return (
            <div key={index} className="bg-white/[0.05] rounded-2xl p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${categoryStyle.color} border ${categoryStyle.border}`}>
                    <span className="text-lg">{categoryStyle.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{insight.title}</h4>
                    <span className="text-xs text-gray-400 capitalize">
                      {insight.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${priorityStyle.color}`}>
                  <span className="mr-1">{priorityStyle.icon}</span>
                  {insight.priority}
                </div>
              </div>
              
              <div className="text-gray-300 leading-relaxed mb-4 whitespace-pre-line">
                {insight.content}
              </div>
              
              {insight.actionSteps.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-white mb-2">🚀 Action Steps</h5>
                  <ul className="space-y-1">
                    {insight.actionSteps.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Next Steps */}
      <div className="bg-white/[0.05] rounded-2xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🎯</span>
          <h3 className="text-lg font-semibold text-white">Your Action Plan</h3>
        </div>
        
        <div className="grid gap-4">
          <div>
            <h4 className="text-sm font-medium text-green-400 mb-2">⚡ This Week</h4>
            <ul className="space-y-1">
              {insights.nextSteps.immediate.map((step, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-blue-400 mb-2">📅 Next 1-3 Months</h4>
            <ul className="space-y-1">
              {insights.nextSteps.shortTerm.map((step, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-purple-400 mb-2">🌟 6-12 Months</h4>
            <ul className="space-y-1">
              {insights.nextSteps.longTerm.map((step, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Encouragement */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-4 border border-green-400/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">💪</span>
          <h3 className="text-lg font-semibold text-white">You've Got This!</h3>
        </div>
        <p className="text-gray-300 leading-relaxed">{insights.encouragement}</p>
      </div>

      {/* Resources */}
      {insights.resources.length > 0 && (
        <div className="bg-white/[0.05] rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📚</span>
            <h3 className="text-lg font-semibold text-white">Helpful Resources</h3>
          </div>
          
          <div className="grid gap-3">
            {insights.resources.map((resource, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/[0.03] rounded-lg border border-white/5">
                <div className="text-lg">
                  {resource.type === 'calculator' && '🧮'}
                  {resource.type === 'guide' && '📖'}
                  {resource.type === 'tip' && '💡'}
                  {resource.type === 'strategy' && '🎯'}
                </div>
                <div>
                  <h4 className="font-medium text-white">{resource.title}</h4>
                  <p className="text-sm text-gray-400">{resource.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}