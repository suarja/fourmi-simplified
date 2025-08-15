import { useState, useRef, useEffect } from "react";
import { useMutation, useAction, useQuery } from "convex/react";
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
  conversationId: Id<"conversations"> | null;
}

export function ChatInterface({ profileId, conversationId }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(
    api.conversations.getMessages, 
    conversationId ? { conversationId } : "skip"
  );
  const addMessage = useMutation(api.conversations.addMessage);
  const processFinancialMessage = useAction(api.ai.processFinancialMessage);
  const generateFinancialAdvice = useAction(api.ai.generateFinancialAdvice);
  const getMonthlyBalance = useQuery(api.profiles.getMonthlyBalance, { profileId });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processMessage = async (messageText: string) => {
    if (!conversationId) {
      toast.error("Please start a new conversation first");
      return;
    }

    setIsProcessing(true);

    try {
      // Add user message
      await addMessage({
        conversationId,
        type: "user",
        content: messageText,
      });

      // Process the message with AI (this handles everything)
      const result = await processFinancialMessage({
        profileId,
        message: messageText,
      });

      let assistantResponse = result.message;

      // If data was added successfully, generate additional financial advice
      if (result.success && result.itemsProcessed.incomes + result.itemsProcessed.expenses + result.itemsProcessed.loans > 0) {
        try {
          if (getMonthlyBalance) {
            const advice = await generateFinancialAdvice({
              monthlyIncome: getMonthlyBalance.monthlyIncome,
              monthlyExpenses: getMonthlyBalance.monthlyExpenses,
              monthlyLoanPayments: getMonthlyBalance.monthlyLoanPayments,
              balance: getMonthlyBalance.balance,
              context: messageText,
            });
            assistantResponse += "\n\n💡 " + advice;
          }
        } catch (error) {
          console.error("Error generating advice:", error);
          // Don't fail the whole process if advice generation fails
        }
      }

      // Add assistant response
      await addMessage({
        conversationId,
        type: "assistant",
        content: assistantResponse,
      });

    } catch (error) {
      console.error("Error processing message:", error);
      await addMessage({
        conversationId,
        type: "assistant",
        content: "Sorry, I encountered an error processing your message. Please try again or use voice recording or file upload!",
      });
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

  const handleFileProcessed = async (message: string) => {
    await processMessage(message);
  };

  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-center p-8">
        <div className="text-6xl mb-4">🐜</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Welcome to Fourmi Financial
        </h3>
        <p className="text-gray-400 mb-6">
          Start a new conversation to begin managing your finances
        </p>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-left max-w-md">
          <h4 className="font-semibold text-white mb-2">You can:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Chat about your income and expenses</li>
            <li>• Upload CSV files with financial data</li>
            <li>• Use voice recording for hands-free input</li>
            <li>• Get AI-powered financial insights</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">🐜</span>
          Chat with Fourmi
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Tell me about your finances using text, voice, or files
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
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-100 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span>Analyzing your message...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me about your finances..."
            className="flex-1 px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            disabled={isProcessing || !conversationId}
          />
          
          {/* Voice Recording Button */}
          <SpeechToText 
            onTranscript={handleVoiceTranscript}
            disabled={isProcessing || !conversationId}
          />
          
          {/* File Upload Button */}
          <FileUpload 
            profileId={profileId}
            onDataProcessed={handleFileProcessed}
            disabled={!conversationId}
          />
          
          <button
            type="submit"
            disabled={!input.trim() || isProcessing || !conversationId}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
