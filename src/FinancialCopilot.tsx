import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { ProfileSetup } from "./ProfileSetup";
import { ChatInterface } from "./ChatInterface";
import { FinancialDashboard } from "./FinancialDashboard";
import { ConversationSidebar } from "./ConversationSidebar";

export function FinancialCopilot() {
  const profile = useQuery(api.profiles.getUserProfile);
  const [currentConversationId, setCurrentConversationId] = useState<Id<"conversations"> | null>(null);
  
  const createConversation = useMutation(api.conversations.createConversation);

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

  const handleNewConversation = async () => {
    try {
      const conversationId = await createConversation({
        profileId: profile._id,
        title: `Chat ${new Date().toLocaleDateString()}`,
      });
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleConversationSelect = (conversationId: Id<"conversations">) => {
    setCurrentConversationId(conversationId);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversation Sidebar */}
      <ConversationSidebar
        profileId={profile._id}
        currentConversationId={currentConversationId}
        onConversationSelect={handleConversationSelect}
        onNewConversation={handleNewConversation}
      />
      
      {/* Chat Interface */}
      <div className="flex-1 border-r border-gray-700">
        <ChatInterface 
          profileId={profile._id} 
          conversationId={currentConversationId}
        />
      </div>
      
      {/* Financial Dashboard */}
      <div className="w-96">
        <FinancialDashboard profileId={profile._id} />
      </div>
    </div>
  );
}
