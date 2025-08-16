import { useTranslation } from 'react-i18next';

export function ImplementationDocs() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">{t('docs.implementation.title')}</h1>
        <p className="text-xl text-white/70 mb-6">
          {t('docs.implementation.subtitle')}
        </p>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">✅ {t('docs.implementation.completed.title')}</h2>
        <p className="text-white/70 mb-4">
          {t('docs.implementation.completed.description')}
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.completed.features.profiles.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.completed.features.profiles.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.location')}: <code>convex/profiles.ts</code></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.completed.features.tracking.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.completed.features.tracking.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.location')}: <code>convex/profiles.ts:getFinancialData</code></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.completed.features.extraction.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.completed.features.extraction.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.location')}: <code>convex/agents/financialTools.ts:extractFinancialDataTool</code></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.completed.features.duplicates.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.completed.features.duplicates.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.location')}: <code>convex/lib/validation.ts</code></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.completed.features.dashboard.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.completed.features.dashboard.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.location')}: <code>src/components/FinancialDashboard.tsx</code></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.completed.features.csv.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.completed.features.csv.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.location')}: <code>convex/ai.ts:processCsvAction</code></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.completed.features.i18n.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.completed.features.i18n.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.location')}: <code>src/i18n.ts</code>, <code>public/locales/</code>, <code>src/components/LanguageSwitcher.tsx</code></div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.completed.features.billing.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.completed.features.billing.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.location')}: <code>convex/schematic.ts</code>, <code>src/components/BillingPage.tsx</code></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">🚧 {t('docs.implementation.inProgress.title')}</h2>
        <p className="text-white/70 mb-4">
          {t('docs.implementation.inProgress.description')}
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">⚡</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.inProgress.features.validation.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.inProgress.features.validation.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.inProgress.features.validation.status')}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">⚡</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.inProgress.features.editDelete.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.inProgress.features.editDelete.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.inProgress.features.editDelete.status')}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">⚡</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.inProgress.features.logic.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.inProgress.features.logic.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.inProgress.features.logic.status')}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">⚡</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.inProgress.features.router.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.inProgress.features.router.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.inProgress.features.router.status')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">📋 {t('docs.implementation.todo.title')}</h2>
        <p className="text-white/70 mb-4">
          {t('docs.implementation.todo.description')}
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">◯</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.todo.features.realEstate.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.todo.features.realEstate.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.todo.features.realEstate.status')}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">◯</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.todo.features.simulations.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.todo.features.simulations.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.todo.features.simulations.requirements')}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">◯</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.todo.features.testing.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.todo.features.testing.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.todo.features.testing.setup')}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center mt-1">
              <span className="text-white text-sm">◯</span>
            </div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.todo.features.deployment.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.todo.features.deployment.description')}</p>
              <div className="text-xs text-white/50 mt-1">{t('docs.implementation.todo.features.deployment.prerequisites')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">🏗️ {t('docs.implementation.architecture.title')}</h2>
        <p className="text-white/70 mb-4">
          {t('docs.implementation.architecture.description')}
        </p>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.implementation.architecture.patterns.agents.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.implementation.architecture.patterns.agents.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.implementation.architecture.patterns.agents.benefits')}:</strong> {t('docs.implementation.architecture.patterns.agents.benefitsDetail')}<br/>
              <strong>{t('docs.implementation.architecture.patterns.agents.example')}:</strong> <code>extractFinancialDataTool</code>, <code>getFinancialSummaryTool</code><br/>
              <strong>{t('docs.implementation.architecture.patterns.agents.future')}:</strong> {t('docs.implementation.architecture.patterns.agents.futureDetail')}
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.implementation.architecture.patterns.realtime.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.implementation.architecture.patterns.realtime.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.implementation.architecture.patterns.realtime.pattern')}:</strong> {t('docs.implementation.architecture.patterns.realtime.patternDetail')}<br/>
              <strong>{t('docs.implementation.architecture.patterns.realtime.performance')}:</strong> {t('docs.implementation.architecture.patterns.realtime.performanceDetail')}<br/>
              <strong>{t('docs.implementation.architecture.patterns.realtime.usage')}:</strong> {t('docs.implementation.architecture.patterns.realtime.usageDetail')}
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.implementation.architecture.patterns.validation.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.implementation.architecture.patterns.validation.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.implementation.architecture.patterns.validation.flow')}:</strong> {t('docs.implementation.architecture.patterns.validation.flowDetail')}<br/>
              <strong>{t('docs.implementation.architecture.patterns.validation.benefit')}:</strong> {t('docs.implementation.architecture.patterns.validation.benefitDetail')}<br/>
              <strong>{t('docs.implementation.architecture.patterns.validation.implementation')}:</strong> <code>pendingFacts</code> table + dashboard UI
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.implementation.architecture.patterns.composition.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.implementation.architecture.patterns.composition.description')}
            </p>
            <div className="text-sm text-white/50">
              <strong>{t('docs.implementation.architecture.patterns.composition.pattern')}:</strong> {t('docs.implementation.architecture.patterns.composition.patternDetail')}<br/>
              <strong>{t('docs.implementation.architecture.patterns.composition.example')}:</strong> <code>FinancialCopilot</code> (container) + <code>FinancialDashboard</code> (presentation)<br/>
              <strong>{t('docs.implementation.architecture.patterns.composition.reusability')}:</strong> {t('docs.implementation.architecture.patterns.composition.reusabilityDetail')}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">🔄 {t('docs.implementation.workflow.title')}</h2>
        <p className="text-white/70 mb-4">
          {t('docs.implementation.workflow.description')}
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.workflow.steps.design.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.workflow.steps.design.description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.workflow.steps.backend.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.workflow.steps.backend.description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.workflow.steps.frontend.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.workflow.steps.frontend.description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">4</div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.workflow.steps.testing.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.workflow.steps.testing.description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">5</div>
            <div>
              <h3 className="text-white font-medium">{t('docs.implementation.workflow.steps.documentation.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.implementation.workflow.steps.documentation.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}