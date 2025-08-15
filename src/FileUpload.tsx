import { useState, useRef } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { toast } from "sonner";

interface FileUploadProps {
  profileId: Id<"profiles">;
  threadId?: string | null; // Current thread context
  onDataProcessed: (message: string) => void;
  onThreadCreated?: (threadId: string, title: string) => void; // For new thread creation
  disabled?: boolean;
}

export function FileUpload({ profileId, threadId, onDataProcessed, onThreadCreated, disabled }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const generateUploadUrl = useMutation(api.profiles.generateUploadUrl);
  const processFinancialFileWithThread = useAction(api.files.processFinancialFileWithThread);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['text/csv'];
    const isCSV = file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');
    
    if (!isCSV) {
      toast.error("Please upload a CSV file. Excel files need to be saved as CSV first.", {
        description: "In Excel: File → Save As → CSV (Comma delimited)"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Step 1: Get upload URL
      const postUrl = await generateUploadUrl();
      
      // Step 2: Upload file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      const json = await result.json();
      if (!result.ok) {
        throw new Error(`Upload failed: ${JSON.stringify(json)}`);
      }
      
      const { storageId } = json;
      
      // Step 3: Process file with AI within thread context
      const processedData = await processFinancialFileWithThread({
        profileId,
        storageId,
        fileName: file.name,
        threadId: threadId || undefined,
      });
      
      toast.success(`Successfully processed ${file.name}`, {
        description: `Found ${processedData.itemsProcessed.incomes} incomes, ${processedData.itemsProcessed.expenses} expenses, ${processedData.itemsProcessed.loans} loans`
      });
      
      // Handle thread creation if a new thread was created
      if (processedData.threadId && processedData.threadTitle && onThreadCreated) {
        console.log("File upload created new thread:", { threadId: processedData.threadId, title: processedData.threadTitle });
        onThreadCreated(processedData.threadId, processedData.threadTitle);
      }
      
      // The agent has already generated a response, so pass that instead of creating a new message
      onDataProcessed(processedData.response);
      
    } catch (error) {
      console.error("File upload error:", error);
      if (error instanceof Error && error.message.includes("Excel files need to be converted")) {
        toast.error("Excel file detected", {
          description: "Please save your Excel file as CSV format and try again."
        });
      } else {
        toast.error("Failed to process file", {
          description: "Please ensure it's a valid CSV file with financial data."
        });
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading || disabled}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading || disabled}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Upload CSV file (Excel files need to be saved as CSV first)"
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm">Processing...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm">CSV</span>
          </>
        )}
      </button>
    </div>
  );
}
