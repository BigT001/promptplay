"use client"

import { ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ExplorerProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function Explorer({ isOpen, setIsOpen }: ExplorerProps) {
  return (
    <div className={cn(
      "vscode-sidebar w-64 transition-all duration-200",
      !isOpen && "w-0"
    )}>
      <div className="flex items-center justify-between p-2 text-xs font-medium">
        <span className="uppercase">Explorer</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="px-2">
        {/* File Tree */}
        <div className="cursor-pointer hover:bg-black/10 py-1">
          <div className="flex items-center gap-1">
            <ChevronDown className="w-4 h-4" />
            <span>PROMPTPLAY</span>
          </div>
        </div>
        {/* Add more file tree items here */}
      </div>
    </div>
  )
}
