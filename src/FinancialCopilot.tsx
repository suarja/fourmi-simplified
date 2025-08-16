import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { ProfileSetup } from "./ProfileSetup";
import { ChatInterface } from "./ChatInterface";
import { FinancialDashboard } from "./components/financial-dashboard/FinancialDashboard";
import { ConversationSidebar } from "./ConversationSidebar";
import { MobileNavigation } from "./MobileNavigation";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ProjectCanvas } from "./components/projects/ProjectCanvas";
import { ProjectsList } from "./components/projects/ProjectsList";
import { RightPanelNavigation } from "./components/RightPanelNavigation";

export function FinancialCopilot() {
  const profile = useQuery(api.profiles.getUserProfile);
  const pendingFacts = useQuery(api.domain.facts.getPendingFacts, 
    profile ? { profileId: profile._id } : "skip"
  );
  
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [currentThreadTitle, setCurrentThreadTitle] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [mobileView, setMobileView] = useState<'chat' | 'dashboard' | 'projects' | 'history' | 'project'>('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  // Project view state - expanded to include projects list
  const [viewMode, setViewMode] = useState<'dashboard' | 'projects' | 'project'>('dashboard');
  
  // Get active project for current thread
  const activeProject = useQuery(
    api.threadProjects.getActiveProjectByThread,
    currentThreadId ? { threadId: currentThreadId } : "skip"
  );

  // Mutation to set active project
  const setActiveProject = useMutation(api.threadProjects.setActiveProjectByThread);

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
  }, [activeProject, isMobile, mobileView, viewMode]);

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

  const handleProjectSelect = async (projectId: Id<"projects">) => {
    // Set this project as active for the current thread
    if (currentThreadId) {
      try {
        await setActiveProject({
          threadId: currentThreadId,
          projectId,
        });
        
        // Switch to project view
        setViewMode('project');
        if (isMobile) {
          setMobileView('project');
        }
      } catch (error) {
        console.error("Error setting active project:", error);
      }
    } else {
      // If no current thread, we could create one or just show the project
      setViewMode('project');
      if (isMobile) {
        setMobileView('project');
      }
    }
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
          {mobileView === 'projects' && (
            <div className="h-full overflow-y-auto">
              <ProjectsList 
                profileId={profile._id}
                onProjectSelect={handleProjectSelect}
                onBack={() => setMobileView('chat')}
              />
            </div>
          )}
          {mobileView === 'project' && activeProject && (
            <div className="h-full overflow-y-auto">
              <ProjectCanvas 
                project={activeProject} 
                onBack={() => setMobileView('projects')} 
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
              // Auto-collapse sidebar after selection
              setSidebarCollapsed(true);
            }}
            onNewConversation={() => {
              handleNewConversation();
              // Auto-collapse sidebar after new conversation
              setSidebarCollapsed(true);
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
            <div className="w-80 flex flex-col">
              {/* Navigation Header */}
              <div className="bg-white/5 backdrop-blur-2xl border-b border-white/10 p-4">
                {viewMode === 'project' && activeProject ? (
                  // Project-specific header
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setViewMode('projects')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      </button>
                      <div>
                        <h3 className="text-white font-semibold text-sm">{activeProject.name}</h3>
                        <p className="text-white/60 text-xs">{activeProject.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setViewMode('dashboard')}
                        className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => setViewMode('projects')}
                        className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                      >
                        Projects
                      </button>
                    </div>
                  </div>
                ) : (
                  // General navigation tabs
                  <div className="flex space-x-1 bg-white/5 p-1 rounded-lg">
                    <button
                      onClick={() => setViewMode('dashboard')}
                      className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                        viewMode === 'dashboard'
                          ? 'bg-primary text-white shadow-lg'
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setViewMode('projects')}
                      className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                        viewMode === 'projects'
                          ? 'bg-primary text-white shadow-lg'
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Projects
                    </button>
                  </div>
                )}
              </div>
              
              {/* Content Area */}
              <div className="flex-1 overflow-hidden">
                {viewMode === 'dashboard' ? (
                  <FinancialDashboard profileId={profile._id} />
                ) : viewMode === 'projects' ? (
                  <ProjectsList 
                    profileId={profile._id}
                    onProjectSelect={handleProjectSelect}
                  />
                ) : activeProject ? (
                  <ProjectCanvas 
                    project={activeProject} 
                    onBack={() => setViewMode('projects')} 
                  />
                ) : (
                  <FinancialDashboard profileId={profile._id} />
                )}
              </div>
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
            
            {/* Financial Dashboard / Projects / Project Canvas */}
            <Panel defaultSize={70} minSize={50} maxSize={70}>
              <div className="h-full flex flex-col">
                {/* Navigation Header */}
                <div className="bg-white/5 backdrop-blur-2xl border-b border-white/10 p-4">
                  {viewMode === 'project' && activeProject ? (
                    // Project-specific header
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setViewMode('projects')}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                        </button>
                        <div>
                          <h3 className="text-white font-semibold">{activeProject.name}</h3>
                          <p className="text-white/60 text-sm">{activeProject.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewMode('dashboard')}
                          className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => setViewMode('projects')}
                          className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                        >
                          All Projects
                        </button>
                      </div>
                    </div>
                  ) : (
                    // General navigation tabs
                    <div className="flex space-x-1 bg-white/5 p-1 rounded-lg">
                      <button
                        onClick={() => setViewMode('dashboard')}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          viewMode === 'dashboard'
                            ? 'bg-primary text-white shadow-lg'
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => setViewMode('projects')}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          viewMode === 'projects'
                            ? 'bg-primary text-white shadow-lg'
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Projects
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Content Area */}
                <div className="flex-1 overflow-hidden">
                  {viewMode === 'dashboard' ? (
                    <FinancialDashboard profileId={profile._id} />
                  ) : viewMode === 'projects' ? (
                    <ProjectsList 
                      profileId={profile._id}
                      onProjectSelect={handleProjectSelect}
                    />
                  ) : activeProject ? (
                    <ProjectCanvas 
                      project={activeProject} 
                      onBack={() => setViewMode('projects')} 
                    />
                  ) : (
                    <FinancialDashboard profileId={profile._id} />
                  )}
                </div>
              </div>
            </Panel>
          </PanelGroup>
        )}
      </div>
    </div>
  );
}
