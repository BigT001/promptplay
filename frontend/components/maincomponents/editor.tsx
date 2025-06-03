"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState, useRef } from "react"

interface Tab {
  id: string
  name: string
  content: string
  isDirty?: boolean
}

interface EditorProps {
  openFile?: {
    id: string
    name: string
    content?: string
  }
  onContentChange?: (id: string, content: string) => void
}

export function Editor({ openFile, onContentChange }: EditorProps) {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (openFile && !tabs.find(tab => tab.id === openFile.id)) {
      const newTab = {
        id: openFile.id,
        name: openFile.name,
        content: openFile.content || '',
        isDirty: false
      }
      setTabs(prev => [...prev, newTab])
      setActiveTab(openFile.id)
    }
  }, [openFile])

  useEffect(() => {
    if (activeTab && editorRef.current) {
      editorRef.current.focus()
    }
  }, [activeTab])

  const closeTab = (tabId: string) => {
    setTabs(prev => prev.filter(tab => tab.id !== tabId))
    if (activeTab === tabId) {
      setActiveTab(tabs[tabs.length - 2]?.id || null)
    }
  }

  const handleContentChange = (content: string) => {
    if (!activeTab) return

    setTabs(prev => prev.map(tab => 
      tab.id === activeTab 
        ? { ...tab, content, isDirty: true }
        : tab
    ))

    onContentChange?.(activeTab, content)
  }

  return (
    <div className="vscode-editor flex-1 flex flex-col">
      {/* Tab bar */}
      <div className="flex items-center h-9 bg-[#252526] border-b border-[#1e1e1e] overflow-x-auto">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={cn(
              "flex items-center px-3 py-1 text-xs border-r border-[#1e1e1e] cursor-pointer",
              activeTab === tab.id ? "bg-[#1e1e1e]" : "bg-[#2d2d2d] hover:bg-[#2d2d2d]/80"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.name}{tab.isDirty ? " •" : ""}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 ml-2"
              onClick={(e) => {
                e.stopPropagation()
                closeTab(tab.id)
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      
      {/* Editor content */}
      <div className="flex-1 overflow-auto relative">
        {activeTab ? (
          <textarea
            ref={editorRef}
            className="w-full h-full bg-transparent p-4 resize-none outline-none font-mono text-sm"
            value={tabs.find(tab => tab.id === activeTab)?.content || ''}
            onChange={(e) => handleContentChange(e.target.value)}
            spellCheck={false}
          />
        ) : (
          <div className="p-4">
            <h1 className="text-xl mb-4">Welcome to PromptPlay</h1>
            <p className="text-sm text-[var(--vscode-text-muted)]">
              Start by exploring the file tree or creating a new file.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
