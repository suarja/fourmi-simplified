import { useTranslation } from 'react-i18next';

interface RightPanelNavigationProps {
  viewMode: 'dashboard' | 'projects' | 'project';
  onViewChange: (view: 'dashboard' | 'projects' | 'project') => void;
  activeProject?: any;
  onBackToProjects?: () => void;
}

export function RightPanelNavigation({ 
  viewMode, 
  onViewChange, 
  activeProject, 
  onBackToProjects 
}: RightPanelNavigationProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-white/5 backdrop-blur-2xl border-b border-white/10 p-4">
      {viewMode === 'project' && activeProject ? (
        // Project-specific header
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToProjects}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h3 className="text-white font-semibold">{activeProject?.name}</h3>
              <p className="text-white/60 text-sm">{activeProject?.type?.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onViewChange('dashboard')}
              className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
            >
              {t('navigation.dashboard')}
            </button>
            <button
              onClick={() => onViewChange('projects')}
              className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
            >
              {t('navigation.allProjects')}
            </button>
          </div>
        </div>
      ) : (
        // General navigation tabs
        <div className="flex space-x-1 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'dashboard'
                ? 'bg-primary text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {t('navigation.dashboard')}
          </button>
          <button
            onClick={() => onViewChange('projects')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'projects'
                ? 'bg-primary text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {t('navigation.projects')}
          </button>
        </div>
      )}
    </div>
  );
}