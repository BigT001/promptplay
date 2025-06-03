"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResizable } from "@/hooks/use-resizable";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  RotateCcw,
  X,
  MoreHorizontal,
  Paperclip,
  ChevronDown,
  MessageSquare,
  History,
  Settings,
  Play,
  Save,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PromptSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface ScriptResponse {
  script: {
    plot: any;
    characters: any;
    scenes: any;
    continuity_notes: any;
  };
  status: string;
  message?: string;
}

export function PromptSidebar({ isOpen, setIsOpen }: PromptSidebarProps) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"prompt" | "history">("prompt");
  const { width, isResizing, startResizing } = useResizable({
    minWidth: 280,
    maxWidth: 800,
    defaultWidth: 320,
  });

  const formatScriptResponse = (script: ScriptResponse["script"]): string => {
    return `📝 Generated Script:

${script.plot ? `📌 PLOT:
${JSON.stringify(script.plot, null, 2)}

` : ''}${script.characters ? `👥 CHARACTERS:
${JSON.stringify(script.characters, null, 2)}

` : ''}${script.scenes ? `🎬 SCENES:
${JSON.stringify(script.scenes, null, 2)}

` : ''}${script.continuity_notes ? `✅ CONTINUITY NOTES:
${JSON.stringify(script.continuity_notes, null, 2)}` : ''}`;
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    const userMessage: Message = {
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/scripts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          parameters: {}
        }),
      });

      const data: ScriptResponse = await response.json();

      if (data.status === "error") {
        throw new Error(data.message || "Failed to generate script");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: formatScriptResponse(data.script),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setPrompt("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      const assistantMessage: Message = {
        role: "assistant",
        content: `Error: ${errorMessage}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div
      className={cn(
        "vscode-sidebar border-l border-[var(--vscode-border)] flex flex-col relative bg-[#1e1e1e]",
        isOpen ? "" : "w-0",
        isResizing && "select-none"
      )}
      style={{ width: isOpen ? width : 0 }}
    >
      {/* Resize handle */}
      <div
        className={cn(
          "absolute left-0 top-0 w-1 h-full cursor-ew-resize hover:bg-blue-500/50 transition-colors",
          isResizing && "bg-blue-500/50"
        )}
        onMouseDown={startResizing}
      />
      
      {/* Header */}
      <div className="h-[48px] flex items-center justify-between px-3 border-b border-[#333333]">
        <div className="text-sm font-medium">CHAT</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => setMessages([])}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>      {/* Main content - Scrollable messages with fixed input */}
      <div className="flex flex-col h-full relative">
        {/* Messages area with bottom padding to prevent overlap with fixed input */}
        <div className="absolute inset-0 bottom-[104px] overflow-y-auto">
          <div className="p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "mb-4 p-3 rounded-lg",
                  message.role === "user"
                    ? "bg-blue-500/10 ml-8"
                    : "bg-[#2d2d2d] mr-8"
                )}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input area - Truly fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[#333333] bg-[#1e1e1e]">
          <div className="p-3">
            <div className="relative">
              <textarea
                placeholder="Generate a script or ask me anything..."
                className="w-full bg-[#2d2d2d] text-sm rounded-md px-3 py-2 pr-10 resize-none h-[80px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Button
                className="absolute right-2 bottom-2 h-6 w-6 p-1"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
