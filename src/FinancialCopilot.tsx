import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { ProfileSetup } from "./ProfileSetup";
import { ChatInterface } from "./ChatInterface";
import { FinancialDashboard } from "./FinancialDashboard";
import { ConversationSidebar } from "./ConversationSidebar";
import { MobileNavigation } from "./MobileNavigation";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export function FinancialCopilot() {
  const profile = useQuery(api.profiles.getUserProfile);
  const pendingFacts = useQuery(api.domain.facts.getPendingFacts, 
    profile ? { profileId: profile._id } : "skip"
  );
  
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [currentThreadTitle, setCurrentThreadTitle] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [mobileView, setMobileView] = useState<'chat' | 'dashboard' | 'history'>('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      // Auto-collapse sidebar on smaller screens, but allow manual control on larger screens
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (profile === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return <ProfileSetup />;
  }

  const handleNewConversation = () => {
    // Reset to null - new thread will be created automatically on first message
    console.log("New conversation button clicked - clearing current thread");
    setCurrentThreadId(null);
    setCurrentThreadTitle("");
    // Trigger a small refresh to ensure sidebar updates
    setRefreshTrigger(prev => prev + 1);
  };

  const handleThreadSelect = (threadId: string | null, title?: string) => {
    console.log("Thread selected:", { threadId, title });
    setCurrentThreadId(threadId);
    setCurrentThreadTitle(title || "");
  };

  const handleThreadCreated = (threadId: string, title: string) => {
    console.log("Thread created:", { threadId, title });
    setCurrentThreadId(threadId);
    setCurrentThreadTitle(title);
    // Trigger sidebar refresh to show new thread
    setRefreshTrigger(prev => prev + 1);
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="h-full flex flex-col"> {/* Use flex layout for proper mobile height */}
        <div className="flex-1 overflow-hidden pb-16"> {/* Add padding bottom for mobile nav */}
          {mobileView === 'chat' && (
            <ChatInterface 
              profileId={profile._id} 
              threadId={currentThreadId}
              threadTitle={currentThreadTitle}
              onThreadCreated={handleThreadCreated}
            />
          )}
          {mobileView === 'dashboard' && (
            <div className="h-full overflow-y-auto">
              <FinancialDashboard profileId={profile._id} />
            </div>
          )}
          {mobileView === 'history' && (
            <ConversationSidebar
              profileId={profile._id}
              currentThreadId={currentThreadId}
              onThreadSelect={(threadId, title) => {
                handleThreadSelect(threadId, title);
                setMobileView('chat');
              }}
              onNewConversation={() => {
                handleNewConversation();
                setMobileView('chat');
              }}
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>
        <div className="flex-shrink-0">
          <MobileNavigation 
            activeView={mobileView}
            onViewChange={setMobileView}
            pendingCount={pendingFacts?.length || 0}
          />
        </div>
      </div>
    );
  }

  // Tablet and Desktop Layout - True overlay sidebar
  return (
    <div className="relative h-full">
      {/* Sidebar Overlay */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-700 transform transition-transform duration-300 ${
        sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        <ConversationSidebar
          profileId={profile._id}
          currentThreadId={currentThreadId}
          onThreadSelect={(threadId, title) => {
            handleThreadSelect(threadId, title);
            // Auto-collapse on tablet, stay open on desktop
            if (isTablet) {
              setSidebarCollapsed(true);
            }
          }}
          onNewConversation={() => {
            handleNewConversation();
            // Auto-collapse on tablet, stay open on desktop
            if (isTablet) {
              setSidebarCollapsed(true);
            }
          }}
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* Backdrop */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Hamburger Menu - Always show when sidebar is collapsed */}
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="fixed left-4 top-20 z-50 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </button>
      )}

      {/* Main Content Area - Always full width, resizable panels */}
      <div className="h-full">
        {isTablet ? (
          // Tablet: Fixed layout
          <div className="h-full flex">
            <div className="flex-1 border-r border-gray-700">
              <ChatInterface 
                profileId={profile._id} 
                threadId={currentThreadId}
                threadTitle={currentThreadTitle}
                onThreadCreated={handleThreadCreated}
              />
            </div>
            <div className="w-80">
              <FinancialDashboard profileId={profile._id} />
            </div>
          </div>
        ) : (
          // Desktop: Resizable panels
          <PanelGroup direction="horizontal" className="h-full">
            {/* Chat Interface */}
            <Panel defaultSize={60} minSize={40}>
              <ChatInterface 
                profileId={profile._id} 
                threadId={currentThreadId}
                threadTitle={currentThreadTitle}
                onThreadCreated={handleThreadCreated}
              />
            </Panel>
            
            <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600 transition-colors" />
            
            {/* Financial Dashboard */}
            <Panel defaultSize={40} minSize={30} maxSize={60}>
              <FinancialDashboard profileId={profile._id} />
            </Panel>
          </PanelGroup>
        )}
      </div>
    </div>
  );
}
