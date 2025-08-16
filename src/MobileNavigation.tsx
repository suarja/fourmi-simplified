interface MobileNavigationProps {
  activeView: 'chat' | 'dashboard' | 'projects' | 'history' | 'project';
  onViewChange: (view: 'chat' | 'dashboard' | 'projects' | 'history') => void;
  pendingCount?: number;
}

export function MobileNavigation({ activeView, onViewChange, pendingCount = 0 }: MobileNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-2 py-1 z-50 lg:hidden">
      <div className="flex justify-around items-center">
        {/* Chat Tab */}
        <button
          onClick={() => onViewChange('chat')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            activeView === 'chat' 
              ? 'bg-gray-700 text-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
          <span className="text-xs mt-1">Chat</span>
        </button>

        {/* Dashboard Tab */}
        <button
          onClick={() => onViewChange('dashboard')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors relative ${
            activeView === 'dashboard' 
              ? 'bg-gray-700 text-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
            />
          </svg>
          <span className="text-xs mt-1">Dashboard</span>
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {pendingCount}
            </span>
          )}
        </button>

        {/* Projects Tab */}
        <button
          onClick={() => onViewChange('projects')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            activeView === 'projects' 
              ? 'bg-gray-700 text-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
            />
          </svg>
          <span className="text-xs mt-1">Projects</span>
        </button>

        {/* History Tab */}
        <button
          onClick={() => onViewChange('history')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            activeView === 'history' 
              ? 'bg-gray-700 text-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <span className="text-xs mt-1">History</span>
        </button>
      </div>
    </div>
  );
}