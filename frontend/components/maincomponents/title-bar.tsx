"use client"

import { ChevronLeft, ChevronRight, Search, Settings } from "lucide-react"

export function TitleBar() {
  return (
    <div className="vscode-titlebar flex items-center h-9 px-2 text-xs">
      <div className="flex items-center gap-4">
        <span>File</span>
        <span>Edit</span>
        <span>Selection</span>
        <span>View</span>
        <span>Go</span>
        <span>Run</span>
        <span>Terminal</span>
        <span>Help</span>
      </div>
      <div className="flex items-center mx-2">
        <ChevronLeft className="w-4 h-4" />
        <ChevronRight className="w-4 h-4" />
      </div>
      <div className="flex-1 mx-2 relative">
        <Search className="w-3 h-3 absolute left-2 top-1.5 text-gray-500" />
        <input
          type="text"
          className="w-full bg-[#3c3c3c] text-xs rounded px-7 py-1 focus:outline-none"
          placeholder="firstagent"
        />
      </div>
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4" />
      </div>
      <div className="flex items-center ml-auto gap-3">
        <span className="flex items-center gap-1">
          <span className="bg-[#252526] px-1">⊞</span>
          <span className="bg-[#252526] px-1">◧</span>
          <span className="bg-[#252526] px-1">◨</span>
        </span>
        <span className="px-1">—</span>
        <span className="px-1">□</span>
        <span className="px-1">×</span>
      </div>
    </div>
  )
}
