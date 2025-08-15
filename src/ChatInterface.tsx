import { useState, useRef, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";
import { FileUpload } from "./FileUpload";
import { SpeechToText } from "./SpeechToText";

interface Message {
  _id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: number;
  isLoading?: boolean;
}

interface ChatInterfaceProps {
  profileId: Id<"profiles">;
  threadId: string | null; // Agent thread ID, not conversation ID
  threadTitle?: string;
  onThreadCreated?: (threadId: string, title: string) => void;
}

export function ChatInterface({ profileId, threadId, threadTitle, onThreadCreated }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  // Use agent actions directly
  const startFinancialConversation = useAction(api.domain.agents.startFinancialConversation);
  const continueFinancialConversation = useAction(api.domain.agents.continueFinancialConversation);
  const getThreadMessages = useAction(api.threads.getThreadMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load thread messages when threadId changes
  useEffect(() => {
    const loadThreadHistory = async () => {
      if (threadId) {
        try {
          const threadMessages = await getThreadMessages({ threadId });
          
          // Convert thread messages to our Message format
          const convertedMessages: Message[] = threadMessages.map((msg: any) => ({
            _id: msg.id,
            type: msg.type,
            content: msg.content,
            timestamp: msg.timestamp,
          }));
          
          setMessages(convertedMessages);
        } catch (error) {
          console.error("Error loading thread history:", error);
          setMessages([]);
        }
      } else {
        // Clear messages when starting new chat
        setMessages([]);
      }
    };

    loadThreadHistory();
  }, [threadId]); // Remove getThreadMessages to avoid infinite loop

  const processMessage = async (messageText: string) => {
    setIsProcessing(true);

    try {
      // Don't add messages locally - let the backend handle persistence
      // The useEffect will reload all messages after the API call

      let result;
      
      if (!threadId) {
        console.log("Creating new thread for message:", messageText);
        // Start new conversation with agent
        result = await startFinancialConversation({
          profileId,
          message: messageText,
        });
        
        // Notify parent component about new thread creation
        if (result.threadId && result.threadTitle && onThreadCreated) {
          console.log("Calling onThreadCreated with:", { threadId: result.threadId, title: result.threadTitle });
          onThreadCreated(result.threadId, result.threadTitle);
        }
      } else {
        // Continue existing conversation
        result = await continueFinancialConversation({
          threadId,
          message: messageText,
          profileId,
        });
      }

      // Always reload messages after processing to ensure consistency
      const targetThreadId = result.threadId || threadId;
      if (targetThreadId) {
        try {
          const updatedMessages = await getThreadMessages({ threadId: targetThreadId });
          const convertedMessages: Message[] = updatedMessages.map((msg: any) => ({
            _id: msg.id,
            type: msg.type,
            content: msg.content,
            timestamp: msg.timestamp,
          }));
          setMessages(convertedMessages);
        } catch (error) {
          console.error("Error reloading messages:", error);
          // Keep the error handling simple - just log it
        }
      }

    } catch (error) {
      console.error("Error processing message:", error);
      
      // Add error message to local state
      const errorMessage: Message = {
        _id: `error-${Date.now()}`,
        type: "assistant",
        content: "Sorry, I encountered an error processing your message. Please try again or use voice recording or file upload!",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const messageText = input.trim();
    setInput("");
    await processMessage(messageText);
  };

  const handleVoiceTranscript = async (transcript: string) => {
    await processMessage(transcript);
  };

  const handleFileProcessed = async (agentResponse: string) => {
    // File upload now generates agent responses directly within threads
    // Just add the response to the chat without additional processing
    const assistantMessage: Message = {
      _id: `assistant-${Date.now()}`,
      type: "assistant", 
      content: agentResponse,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, assistantMessage]);
  };

  // Always show the chat interface - agent threads are created automatically

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🐜</span>
          {threadTitle || "Chat with Fourmi"}
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          {threadId ? 
            "Continue your conversation with Fourmi" : 
            "Tell me about your finances using text, voice, or files"
          }
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!messages || messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-gray-400">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.sort((a, b) => a.timestamp - b.timestamp).map((message) => {
            // Normalize message type to handle potential inconsistencies
            const messageType = message.type === "user" ? "user" : "assistant";
            
            return (
            <div
              key={message._id}
              className={`flex items-start gap-3 ${messageType === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                messageType === "user" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-600 text-white"
              }`}>
                {messageType === "user" ? "👤" : "🐜"}
              </div>
              
              {/* Message Bubble */}
              <div className={`flex flex-col max-w-[75%] ${messageType === "user" ? "items-end" : "items-start"}`}>
                {/* Role Label */}
                <div className={`text-xs font-medium mb-1 ${
                  messageType === "user" ? "text-blue-400" : "text-green-400"
                }`}>
                  {messageType === "user" ? "You" : "Fourmi"}
                </div>
                
                {/* Message Content */}
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    messageType === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-gray-700 text-gray-100 rounded-bl-md border border-gray-600"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  
                  {/* Copy button for assistant messages */}
                  {messageType === "assistant" && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(message.content);
                        // Could add toast notification here
                      }}
                      className="mt-2 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                      title="Copy message"
                    >
                      📋 Copy
                    </button>
                  )}
                </div>
                
                {/* Timestamp */}
                <div className={`text-xs text-gray-500 mt-1 ${
                  messageType === "user" ? "text-right" : "text-left"
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
            );
          }))
        }
        
        {isProcessing && (
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center text-sm font-medium">
              🐜
            </div>
            
            {/* Message Bubble */}
            <div className="flex flex-col max-w-[75%] items-start">
              {/* Role Label */}
              <div className="text-xs font-medium mb-1 text-green-400">
                Fourmi
              </div>
              
              {/* Message Content */}
              <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-gray-700 text-gray-100 border border-gray-600 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                  <span>Analyzing your message...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-800">
        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me about your finances..."
            className="flex-1 min-w-0 px-3 sm:px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm sm:text-base"
            disabled={isProcessing}
          />
          
          {/* Action Buttons Container */}
          <div className="flex gap-2 sm:gap-3">
            {/* Voice Recording Button */}
            <SpeechToText 
              onTranscript={handleVoiceTranscript}
              disabled={isProcessing}
            />
            
            {/* File Upload Button */}
            <FileUpload 
              profileId={profileId}
              threadId={threadId}
              onDataProcessed={handleFileProcessed}
              onThreadCreated={onThreadCreated}
              disabled={false}
            />
            
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="px-4 sm:px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
            >
              {isProcessing ? "..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
