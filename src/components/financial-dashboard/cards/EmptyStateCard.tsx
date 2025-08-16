import { useTranslation } from 'react-i18next';

export function EmptyStateCard() {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-8 sm:py-12">
      <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📊</div>
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
        {t('cards.empty.title')}
      </h3>
      <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-4">
        {t('cards.empty.subtitle')}
      </p>
      <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 text-left max-w-sm sm:max-w-md mx-auto">
        <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">{t('cards.empty.trySaying')}:</h4>
        <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
          <li>• {t('cards.empty.suggestion1')}</li>
          <li>• {t('cards.empty.suggestion2')}</li>
          <li>• {t('cards.empty.suggestion3')}</li>
          <li>• {t('cards.empty.suggestion4')}</li>
        </ul>
      </div>
    </div>
  );
}