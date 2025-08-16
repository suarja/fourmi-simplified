import { useTranslation } from 'react-i18next';

export function DocsHome() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">{t('docs.home.title')}</h1>
        <p className="text-xl text-white/70 mb-6">
          {t('docs.home.subtitle')}
        </p>
        <div className="bg-primary/20 border border-primary/30 rounded-lg p-4">
          <p className="text-white/90">
            {t('docs.home.welcome')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-3">🤖 {t('docs.home.agents.title')}</h3>
          <p className="text-white/70 mb-4">
            {t('docs.home.agents.description')}
          </p>
          <ul className="text-sm text-white/60 space-y-1">
            <li>• {t('docs.home.agents.features.extraction')}</li>
            <li>• {t('docs.home.agents.features.advice')}</li>
            <li>• {t('docs.home.agents.features.tools')}</li>
            <li>• {t('docs.home.agents.features.validation')}</li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-3">💰 {t('docs.home.financial.title')}</h3>
          <p className="text-white/70 mb-4">
            {t('docs.home.financial.description')}
          </p>
          <ul className="text-sm text-white/60 space-y-1">
            <li>• {t('docs.home.financial.features.terms')}</li>
            <li>• {t('docs.home.financial.features.calculations')}</li>
            <li>• {t('docs.home.financial.features.values')}</li>
            <li>• {t('docs.home.financial.features.formulas')}</li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-3">⚙️ {t('docs.home.implementation.title')}</h3>
          <p className="text-white/70 mb-4">
            {t('docs.home.implementation.description')}
          </p>
          <ul className="text-sm text-white/60 space-y-1">
            <li>• {t('docs.home.implementation.features.audit')}</li>
            <li>• {t('docs.home.implementation.features.patterns')}</li>
            <li>• {t('docs.home.implementation.features.architecture')}</li>
            <li>• {t('docs.home.implementation.features.testing')}</li>
          </ul>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-3">📊 {t('docs.home.projects.title')}</h3>
          <p className="text-white/70 mb-4">
            {t('docs.home.projects.description')}
          </p>
          <ul className="text-sm text-white/60 space-y-1">
            <li>• {t('docs.home.projects.features.consolidation')}</li>
            <li>• {t('docs.home.projects.features.rentVsBuy')}</li>
            <li>• {t('docs.home.projects.features.strategies')}</li>
            <li>• {t('docs.home.projects.features.comparisons')}</li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-6 border border-primary/30">
        <h3 className="text-xl font-semibold text-white mb-3">🎯 {t('docs.home.mission.title')}</h3>
        <p className="text-white/90 mb-4">
          {t('docs.home.mission.description')}
        </p>
        <p className="text-white/70">
          {t('docs.home.mission.fight')}
        </p>
      </div>
    </div>
  );
}