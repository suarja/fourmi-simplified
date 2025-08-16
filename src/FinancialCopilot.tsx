import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { ProfileSetup } from "./ProfileSetup";
import { ChatInterface } from "./ChatInterface";
import { FinancialDashboard } from "./components/financial-dashboard/FinancialDashboard";
import { ConversationSidebar } from "./ConversationSidebar";
import { MobileNavigation } from "./MobileNavigation";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ProjectCanvas } from "./components/projects/ProjectCanvas";

export function FinancialCopilot() {
  const profile = useQuery(api.profiles.getUserProfile);
  const pendingFacts = useQuery(api.domain.facts.getPendingFacts, 
    profile ? { profileId: profile._id } : "skip"
  );
  
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [currentThreadTitle, setCurrentThreadTitle] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [mobileView, setMobileView] = useState<'chat' | 'dashboard' | 'history' | 'project'>('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  // Project view state
  const [viewMode, setViewMode] = useState<'dashboard' | 'project'>('dashboard');
  
  // Get active project for current thread
  const activeProject = useQuery(
    api.conversations.getActiveProjectByThread,
    currentThreadId ? { threadId: currentThreadId } : "skip"
  );

  // Auto-switch to project mode when active project is available
  useEffect(() => {
    if (activeProject) {
      setViewMode('project');
      // Also switch mobile view if on mobile
      if (isMobile) {
        setMobileView('project');
      }
    } else {
      setViewMode('dashboard');
      // Switch back to dashboard on mobile if no active project
      if (isMobile && mobileView === 'project') {
        setMobileView('dashboard');
      }
    }
  }, [activeProject, isMobile, mobileView]);

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

  const handleBackToDashboard = () => {
    setViewMode('dashboard');
    // Could also clear active project if needed
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
          {mobileView === 'project' && activeProject && (
            <div className="h-full overflow-y-auto">
              <ProjectCanvas 
                project={activeProject} 
                onBack={() => setMobileView('dashboard')} 
              />
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
      <div className={`fixed inset-y-0 left-0 z-[80] w-64 transform transition-transform duration-300 ${
        sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        <div className="h-full bg-white/[0.03] backdrop-blur-2xl m-4 rounded-3xl overflow-hidden">
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
      </div>

      {/* Backdrop */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[70]"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Hamburger Menu - Always show when sidebar is collapsed */}
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="fixed left-4 top-20 z-[90] p-2 bg-white/[0.05] backdrop-blur-2xl rounded-xl hover:bg-white/[0.08] transition-all"
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
              {viewMode === 'dashboard' ? (
                <FinancialDashboard profileId={profile._id} />
              ) : activeProject ? (
                <ProjectCanvas 
                  project={activeProject} 
                  onBack={handleBackToDashboard} 
                />
              ) : (
                <FinancialDashboard profileId={profile._id} />
              )}
            </div>
          </div>
        ) : (
          // Desktop: Resizable panels
          <PanelGroup direction="horizontal" className="h-full">
            {/* Chat Interface */}
            <Panel defaultSize={40} minSize={20}>
              <ChatInterface 
                profileId={profile._id} 
                threadId={currentThreadId}
                threadTitle={currentThreadTitle}
                onThreadCreated={handleThreadCreated}
              />
            </Panel>
            
            <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600 transition-colors" />
            
            {/* Financial Dashboard / Project Canvas */}
            <Panel defaultSize={70} minSize={50} maxSize={70}>
              {viewMode === 'dashboard' ? (
                <FinancialDashboard profileId={profile._id} />
              ) : activeProject ? (
                <ProjectCanvas 
                  project={activeProject} 
                  onBack={handleBackToDashboard} 
                />
              ) : (
                <FinancialDashboard profileId={profile._id} />
              )}
            </Panel>
          </PanelGroup>
        )}
      </div>
    </div>
  );
}
