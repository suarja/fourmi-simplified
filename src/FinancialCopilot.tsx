import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { ProfileSetup } from "./ProfileSetup";
import { ChatInterface } from "./ChatInterface";
import { FinancialDashboard } from "./FinancialDashboard";
import { ConversationSidebar } from "./ConversationSidebar";

export function FinancialCopilot() {
  const profile = useQuery(api.profiles.getUserProfile);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [currentThreadTitle, setCurrentThreadTitle] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

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

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversation Sidebar */}
      <ConversationSidebar
        profileId={profile._id}
        currentThreadId={currentThreadId}
        onThreadSelect={handleThreadSelect}
        onNewConversation={handleNewConversation}
        refreshTrigger={refreshTrigger}
      />
      
      {/* Chat Interface */}
      <div className="flex-1 border-r border-gray-700">
        <ChatInterface 
          profileId={profile._id} 
          threadId={currentThreadId}
          threadTitle={currentThreadTitle}
          onThreadCreated={handleThreadCreated}
        />
      </div>
      
      {/* Financial Dashboard */}
      <div className="w-96">
        <FinancialDashboard profileId={profile._id} />
      </div>
    </div>
  );
}
