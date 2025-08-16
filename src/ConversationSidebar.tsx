import { useState, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { useSchematicFlag } from "@schematichq/schematic-react";

interface ConversationSidebarProps {
  profileId: string;
  currentThreadId: string | null;
  onThreadSelect: (threadId: string | null, title?: string) => void;
  onNewConversation: () => void;
  refreshTrigger?: number; // Used to trigger refresh when new threads are created
}

export function ConversationSidebar({ 
  profileId, 
  currentThreadId, 
  onThreadSelect, 
  onNewConversation,
  refreshTrigger
}: ConversationSidebarProps) {
  const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);

  const isFeatureEnabled = useSchematicFlag("basic_kpis");
  console.log("basic_kpis", isFeatureEnabled)
  
  // Use action to get thread data
  const listUserThreads = useAction(api.threads.listUserThreads);
  const deleteThread = useAction(api.threads.deleteThread);
  
  // Load threads on component mount and when dependencies change
  const loadThreads = async () => {
    try {
      setLoadingThreads(true);
      console.log("Loading threads...");
      const threadList = await listUserThreads();
      console.log("Loaded threads:", threadList);
      setThreads(threadList || []);
    } catch (error) {
      console.error("Error loading threads:", error);
      setThreads([]);
    } finally {
      setLoadingThreads(false);
    }
  };
  
  // Load threads on mount and when refresh trigger changes
  useEffect(() => {
    loadThreads();
  }, [refreshTrigger]); // Remove listUserThreads from deps to avoid infinite loop
  
  const handleDeleteThread = async (threadId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent thread selection
    
    if (!confirm("Are you sure you want to delete this conversation?")) {
      return;
    }
    
    setDeletingThreadId(threadId);
    try {
      await deleteThread({ threadId });
      toast.success("Conversation deleted");
      
      // Refresh thread list
      await loadThreads();
      
      // If we deleted the current thread, clear selection
      if (threadId === currentThreadId) {
        onThreadSelect(null);
      }
    } catch (error) {
      console.error("Error deleting thread:", error);
      toast.error("Failed to delete conversation");
    } finally {
      setDeletingThreadId(null);
    }
  };


  return (
    <div className="h-full flex flex-col">
      <div className="p-5 flex-1 overflow-y-auto">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Chats</h3>
        </div>
            {/* New Conversation Button */}
            <button
              onClick={onNewConversation}
              className="w-full mb-4 px-4 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>



            {/* Threads List */}
            <div className="space-y-2">
              {loadingThreads ? (
                // Loading state
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-black/20 rounded-xl p-3">
                      <div className="h-4 bg-white/10 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-white/10 rounded animate-pulse w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : threads && threads.length > 0 ? (
                // Show actual threads
                threads
                  .sort((a, b) => (b.lastUpdateTime || b.creationTime) - (a.lastUpdateTime || a.creationTime))
                  .map((thread) => {
                    console.log("Rendering individual thread:", thread);
                    return (
                    <div key={thread.threadId} className="relative group">
                      <button
                        onClick={() => onThreadSelect(thread.threadId, thread.title)}
                        className={`w-full text-left p-3 rounded-xl transition-all ${
                          currentThreadId === thread.threadId
                            ? 'bg-primary text-white'
                            : 'bg-black/20 hover:bg-white/[0.05] text-gray-300 hover:text-white'
                        }`}
                      >
                        <div className="font-medium truncate pr-6">{thread.title}</div>
                        <div className="text-xs opacity-60 mt-1">
                          {new Date(thread.lastUpdateTime || thread.creationTime).toLocaleDateString()}
                        </div>
                      </button>
                      
                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDeleteThread(thread.threadId, e)}
                        disabled={deletingThreadId === thread.threadId}
                        className="absolute top-2 right-2 p-1 rounded-lg hover:bg-financial-danger/20 text-white/40 hover:text-financial-danger transition-all opacity-0 group-hover:opacity-100"
                        title="Delete conversation"
                      >
                        {deletingThreadId === thread.threadId ? (
                          <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                              </div>
                    );
                  })
              ) : (
                // Empty state
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1">Start a new chat to begin</p>
                  
                </div>
              )}
            </div>
      </div>
    </div>
  );
}
