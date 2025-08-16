import { useTranslation } from 'react-i18next';

export function AgentDocs() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">{t('docs.agents.title')}</h1>
        <p className="text-xl text-white/70 mb-6">
          {t('docs.agents.subtitle')}
        </p>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">🤖 {t('docs.agents.financial.title')}</h2>
        <p className="text-white/70 mb-4">
          {t('docs.agents.financial.description')}
        </p>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.agents.financial.capabilities.title')}</h3>
            <ul className="text-white/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong>{t('docs.agents.financial.capabilities.income.title')}:</strong> {t('docs.agents.financial.capabilities.income.description')}
                  <div className="text-sm text-white/50 mt-1">{t('docs.agents.financial.capabilities.income.keywords')}</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong>{t('docs.agents.financial.capabilities.expenses.title')}:</strong> {t('docs.agents.financial.capabilities.expenses.description')}
                  <div className="text-sm text-white/50 mt-1">{t('docs.agents.financial.capabilities.expenses.categories')}</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong>{t('docs.agents.financial.capabilities.loans.title')}:</strong> {t('docs.agents.financial.capabilities.loans.description')}
                  <div className="text-sm text-white/50 mt-1">{t('docs.agents.financial.capabilities.loans.types')}</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong>{t('docs.agents.financial.capabilities.duplicates.title')}:</strong> {t('docs.agents.financial.capabilities.duplicates.description')}
                  <div className="text-sm text-white/50 mt-1">{t('docs.agents.financial.capabilities.duplicates.detail')}</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <div>
                  <strong>{t('docs.agents.financial.capabilities.validation.title')}:</strong> {t('docs.agents.financial.capabilities.validation.description')}
                  <div className="text-sm text-white/50 mt-1">{t('docs.agents.financial.capabilities.validation.detail')}</div>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.agents.financial.examples.title')}</h3>
            <div className="bg-black/20 rounded-lg p-4 space-y-3">
              <div>
                <div className="text-green-400 text-sm">{t('docs.agents.financial.examples.input')}:</div>
                <div className="text-white/90">{t('docs.agents.financial.examples.example1.input')}</div>
                <div className="text-blue-400 text-sm">{t('docs.agents.financial.examples.output')}:</div>
                <div className="text-white/70">{t('docs.agents.financial.examples.example1.output')}</div>
              </div>
              <div>
                <div className="text-green-400 text-sm">{t('docs.agents.financial.examples.input')}:</div>
                <div className="text-white/90">{t('docs.agents.financial.examples.example2.input')}</div>
                <div className="text-blue-400 text-sm">{t('docs.agents.financial.examples.output')}:</div>
                <div className="text-white/70">
                  {t('docs.agents.financial.examples.example2.output')}
                </div>
              </div>
              <div>
                <div className="text-green-400 text-sm">{t('docs.agents.financial.examples.input')}:</div>
                <div className="text-white/90">{t('docs.agents.financial.examples.example3.input')}</div>
                <div className="text-blue-400 text-sm">{t('docs.agents.financial.examples.output')}:</div>
                <div className="text-white/70">{t('docs.agents.financial.examples.example3.output')}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.agents.financial.limitations.title')}</h3>
            <ul className="text-white/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">⚠</span>
                <div>
                  <strong>{t('docs.agents.financial.limitations.language.title')}:</strong> {t('docs.agents.financial.limitations.language.description')}
                  <div className="text-sm text-white/50 mt-1">{t('docs.agents.financial.limitations.language.detail')}</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">⚠</span>
                <div>
                  <strong>{t('docs.agents.financial.limitations.complex.title')}:</strong> {t('docs.agents.financial.limitations.complex.description')}
                  <div className="text-sm text-white/50 mt-1">{t('docs.agents.financial.limitations.complex.detail')}</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">⚠</span>
                <div>
                  <strong>{t('docs.agents.financial.limitations.rates.title')}:</strong> {t('docs.agents.financial.limitations.rates.description')}
                  <div className="text-sm text-white/50 mt-1">{t('docs.agents.financial.limitations.rates.detail')}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">🛠️ {t('docs.agents.tools.title')}</h2>
        <p className="text-white/70 mb-4">
          {t('docs.agents.tools.description')}
        </p>

        <div className="space-y-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.agents.tools.extract.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.agents.tools.extract.description')}
            </p>
            <div className="text-sm text-white/50">
              {t('docs.agents.tools.location')}: <code>convex/agents/financialTools.ts:14</code>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.agents.tools.summary.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.agents.tools.summary.description')}
            </p>
            <div className="text-sm text-white/50">
              {t('docs.agents.tools.location')}: <code>convex/agents/financialTools.ts:223</code>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-2">{t('docs.agents.tools.advice.title')}</h3>
            <p className="text-white/70 mb-2">
              {t('docs.agents.tools.advice.description')}
            </p>
            <div className="text-sm text-white/50">
              {t('docs.agents.tools.location')}: <code>convex/agents/financialTools.ts:268</code>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h2 className="text-2xl font-semibold text-white mb-4">🔄 {t('docs.agents.workflow.title')}</h2>
        <p className="text-white/70 mb-4">
          {t('docs.agents.workflow.description')}
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
            <div>
              <h3 className="text-white font-medium">{t('docs.agents.workflow.steps.processing.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.agents.workflow.steps.processing.description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
            <div>
              <h3 className="text-white font-medium">{t('docs.agents.workflow.steps.extraction.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.agents.workflow.steps.extraction.description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
            <div>
              <h3 className="text-white font-medium">{t('docs.agents.workflow.steps.duplicates.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.agents.workflow.steps.duplicates.description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">4</div>
            <div>
              <h3 className="text-white font-medium">{t('docs.agents.workflow.steps.pending.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.agents.workflow.steps.pending.description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">5</div>
            <div>
              <h3 className="text-white font-medium">{t('docs.agents.workflow.steps.validation.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.agents.workflow.steps.validation.description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">6</div>
            <div>
              <h3 className="text-white font-medium">{t('docs.agents.workflow.steps.storage.title')}</h3>
              <p className="text-white/70 text-sm">{t('docs.agents.workflow.steps.storage.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}