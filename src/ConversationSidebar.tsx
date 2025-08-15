import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface ConversationSidebarProps {
  profileId: Id<"profiles">;
  currentConversationId: Id<"conversations"> | null;
  onConversationSelect: (conversationId: Id<"conversations">) => void;
  onNewConversation: () => void;
}

export function ConversationSidebar({ 
  profileId, 
  currentConversationId, 
  onConversationSelect, 
  onNewConversation 
}: ConversationSidebarProps) {
  const conversations = useQuery(api.conversations.getConversations, { profileId });
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!conversations) {
    return (
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`${isCollapsed ? 'w-12' : 'w-64'} bg-gray-800 border-r border-gray-700 transition-all duration-200`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <h3 className="text-lg font-semibold text-white">Conversations</h3>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            <svg 
              className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* New Conversation Button */}
            <button
              onClick={onNewConversation}
              className="w-full mb-4 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>

            {/* Conversations List */}
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation._id}
                  onClick={() => onConversationSelect(conversation._id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentConversationId === conversation._id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="font-medium truncate">{conversation.title}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(conversation.lastMessage).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>

            {conversations.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Start a new chat to begin</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
