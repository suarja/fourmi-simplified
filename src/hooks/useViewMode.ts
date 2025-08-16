import { useState, useEffect } from 'react';

export type ViewMode = 'dashboard' | 'projects' | 'project';

interface UseViewModeProps {
  activeProject: any;
  isMobile: boolean;
  mobileView: string;
  setMobileView: (view: any) => void;
}

export function useViewMode({ activeProject, isMobile, mobileView, setMobileView }: UseViewModeProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  // Auto-switch to project mode when active project is available
  useEffect(() => {
    if (activeProject) {
      setViewMode('project');
      // Also switch mobile view if on mobile
      if (isMobile) {
        setMobileView('project');
      }
    } else {
      // Only switch back to dashboard if we're currently in project mode
      if (viewMode === 'project') {
        setViewMode('dashboard');
      }
      // Switch back to dashboard on mobile if no active project
      if (isMobile && mobileView === 'project') {
        setMobileView('dashboard');
      }
    }
  }, [activeProject, isMobile, mobileView, viewMode, setMobileView]);

  return {
    viewMode,
    setViewMode,
  };
}