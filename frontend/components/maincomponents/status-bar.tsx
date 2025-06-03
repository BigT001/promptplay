"use client"

import { GitBranch, Circle } from "lucide-react"

export function StatusBar() {
  return (
    <div className="vscode-statusbar flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1">
          <GitBranch className="w-3 h-3" /> main
        </span>
        <span className="flex items-center gap-1">
          <Circle className="w-3 h-3" /> 0 ⚠️ 0 ❌
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span>UTF-8</span>
        <span>TypeScript React</span>
      </div>
    </div>
  )
}
