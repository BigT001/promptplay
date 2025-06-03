"use client"

import { Files, Search as SearchIcon, GitBranch as GitBranchIcon, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityBarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  setIsExplorerOpen: (isOpen: boolean) => void
}

export function ActivityBar({ activeTab, setActiveTab, setIsExplorerOpen }: ActivityBarProps) {
  return (
    <div className="vscode-activity-bar">
      <button 
        className={cn(
          "vscode-icon-button",
          activeTab === 'files' && "bg-black/20"
        )}
        onClick={() => {
          setActiveTab('files')
          setIsExplorerOpen(true)
        }}
      >
        <Files className="w-5 h-5" />
      </button>
      <button 
        className={cn(
          "vscode-icon-button",
          activeTab === 'search' && "bg-black/20"
        )}
        onClick={() => {
          setActiveTab('search')
          setIsExplorerOpen(true)
        }}
      >
        <SearchIcon className="w-5 h-5" />
      </button>
      <button 
        className={cn(
          "vscode-icon-button",
          activeTab === 'git' && "bg-black/20"
        )}
        onClick={() => {
          setActiveTab('git')
          setIsExplorerOpen(true)
        }}
      >
        <GitBranchIcon className="w-5 h-5" />
      </button>
      <div className="flex-1" />
      <button className="vscode-icon-button">
        <Settings className="w-5 h-5" />
      </button>
    </div>
  )
}
