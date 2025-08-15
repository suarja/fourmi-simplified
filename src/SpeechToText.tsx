import { useState, useRef } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

interface SpeechToTextProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function SpeechToText({ onTranscript, disabled }: SpeechToTextProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const transcribeAudio = useAction(api.ai.transcribeAudio);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started. Speak now!");
      
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      toast.success("Processing speech...");
      
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      // Transcribe using AI
      const transcript = await transcribeAudio({ audioData: base64Audio });
      
      if (transcript && transcript.trim()) {
        onTranscript(transcript);
        toast.success("Speech converted to text!");
      } else {
        toast.error("Could not understand the audio. Please try again.");
      }
      
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Failed to process speech. Please try typing instead.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isProcessing}
      className={`flex items-center justify-center gap-1 sm:gap-2 px-3 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-12 sm:w-auto ${
        isRecording 
          ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
          : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
      }`}
      title={isRecording ? "Stop recording" : "Start voice recording"}
    >
      {isProcessing ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 flex-shrink-0"></div>
          <span className="text-sm hidden sm:inline whitespace-nowrap">Processing</span>
        </>
      ) : isRecording ? (
        <>
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h12v12H6z"/>
          </svg>
          <span className="text-sm hidden sm:inline whitespace-nowrap">Stop</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          </svg>
          <span className="text-sm hidden sm:inline whitespace-nowrap">Record</span>
        </>
      )}
    </button>
  );
}
