"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAIEngine } from "@/hooks/use-ai-engine"
import { SaveIcon, RefreshIcon } from "@/components/icons"
import debounce from "lodash/debounce"

interface ScriptEditorProps {
  projectId: number
  initialContent?: string
}

export function ScriptEditor({ projectId, initialContent = "" }: ScriptEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const { toast } = useToast()
  const { generateScript } = useAIEngine()
  const router = useRouter()

  // Debounced autosave
  const saveContent = useCallback(
    debounce(async (content: string) => {
      try {
        setSaving(true)
        await fetch(`/api/projects/${projectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save changes",
          variant: "destructive",
        })
      } finally {
        setSaving(false)
      }
    }, 1000),
    [projectId, toast]
  )

  // Handle content changes and trigger autosave
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    saveContent(newContent)
  }

  // Generate script suggestions
  const handleGenerateSuggestions = async () => {
    try {
      setGenerating(true)
      const result = await generateScript(content, { provider: "auto" })
      if (result.content) {
        setContent(result.content)
        saveContent(result.content)
        toast({
          title: "Success",
          description: "Generated new script content",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestions",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateSuggestions}
            disabled={generating}
          >
            <RefreshIcon className="mr-2 h-4 w-4" />
            {generating ? "Generating..." : "Get Suggestions"}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {saving ? "Saving..." : "All changes saved"}
        </div>
      </div>

      <Textarea
        value={content}
        onChange={handleChange}
        placeholder="Start writing your script..."
        className="min-h-[500px] font-mono"
      />
    </div>
  )
}