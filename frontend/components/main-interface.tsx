"use client"

import { useState } from "react"
import { TitleBar } from "@/components/maincomponents/title-bar"
import { ActivityBar } from "@/components/maincomponents/activity-bar"
import { Explorer } from "@/components/maincomponents/explorer"
import { Editor } from "@/components/maincomponents/editor"
import { StatusBar } from "@/components/maincomponents/status-bar"
import { PromptSidebar } from "@/components/maincomponents/prompt-sidebar"

export default function MainInterface() {
  const [isExplorerOpen, setIsExplorerOpen] = useState(true)
  const [isPromptOpen, setIsPromptOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('files')
  const [openFile, setOpenFile] = useState<{ id: string; name: string; content?: string } | undefined>()

  const handleFileClick = (file: { id: string; name: string; content?: string }) => {
    setOpenFile(file)
  }

  const handleFileContentChange = (id: string, content: string) => {
    // Here you can implement saving the file content
    console.log('File content changed:', { id, content })
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--vscode-bg)] text-[var(--vscode-text)] overflow-hidden">      <TitleBar />
      
      <div className="flex-1 flex">
        <ActivityBar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setIsExplorerOpen={setIsExplorerOpen}
        />
        
        <Explorer 
          isOpen={isExplorerOpen}
          setIsOpen={setIsExplorerOpen}
          onFileClick={handleFileClick}
        />
        
        <Editor 
          openFile={openFile}
          onContentChange={handleFileContentChange}
        />
        
        <PromptSidebar 
          isOpen={isPromptOpen}
          setIsOpen={setIsPromptOpen}
        />
      </div>

      <StatusBar />
    </div>
  )
}
