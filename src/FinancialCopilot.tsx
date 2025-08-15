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
      // Auto-collapse sidebar on tablet
      if (window.innerWidth < 1024) {
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
      <div className="h-[calc(100vh-4rem-3.5rem)]"> {/* Account for mobile nav */}
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
        <MobileNavigation 
          activeView={mobileView}
          onViewChange={setMobileView}
          pendingCount={pendingFacts?.length || 0}
        />
      </div>
    );
  }

  // Tablet Layout - Two columns with collapsible sidebar
  if (isTablet) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Collapsible Sidebar Overlay */}
        {!sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`${
          sidebarCollapsed ? 'w-0' : 'w-64'
        } transition-all duration-300 ${
          !sidebarCollapsed ? 'fixed left-0 top-16 bottom-0 z-50 bg-gray-900' : ''
        }`}>
          {!sidebarCollapsed && (
            <ConversationSidebar
              profileId={profile._id}
              currentThreadId={currentThreadId}
              onThreadSelect={(threadId, title) => {
                handleThreadSelect(threadId, title);
                setSidebarCollapsed(true);
              }}
              onNewConversation={() => {
                handleNewConversation();
                setSidebarCollapsed(true);
              }}
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Hamburger Menu */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute left-4 top-20 z-30 p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>

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
      </div>
    );
  }

  // Desktop Layout - Resizable panels
  return (
    <PanelGroup direction="horizontal" className="h-[calc(100vh-4rem)]">
      {/* Conversation Sidebar */}
      <Panel defaultSize={15} minSize={10} maxSize={25}>
        <ConversationSidebar
          profileId={profile._id}
          currentThreadId={currentThreadId}
          onThreadSelect={handleThreadSelect}
          onNewConversation={handleNewConversation}
          refreshTrigger={refreshTrigger}
        />
      </Panel>
      
      <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600 transition-colors" />
      
      {/* Chat Interface */}
      <Panel defaultSize={50} minSize={30}>
        <ChatInterface 
          profileId={profile._id} 
          threadId={currentThreadId}
          threadTitle={currentThreadTitle}
          onThreadCreated={handleThreadCreated}
        />
      </Panel>
      
      <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-600 transition-colors" />
      
      {/* Financial Dashboard */}
      <Panel defaultSize={35} minSize={25} maxSize={50}>
        <FinancialDashboard profileId={profile._id} />
      </Panel>
    </PanelGroup>
  );
}
