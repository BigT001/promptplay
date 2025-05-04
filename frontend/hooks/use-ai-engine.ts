"use client"

import { useState } from "react"
import { AIScriptEngine } from "@/lib/ai-engine"
import { useToast } from "@/components/ui/use-toast"

const defaultConfig = {
  maxTokens: 2000,
  temperature: 0.7,
  model: "gpt-4",
}

export function useAIEngine(config = defaultConfig) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const engine = new AIScriptEngine(config)

  const handleError = (error: any, action: string) => {
    console.error(`AI Engine ${action} error:`, error)
    toast({
      title: "Error",
      description: `Failed to ${action}. Please try again.`,
      variant: "destructive",
    })
    setLoading(false)
    throw error
  }

  const generateScript = async (...args: Parameters<typeof engine.generateScript>) => {
    try {
      setLoading(true)
      const result = await engine.generateScript(...args)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error, "generate script")
    }
  }

  const analyzeScript = async (...args: Parameters<typeof engine.analyzeScript>) => {
    try {
      setLoading(true)
      const result = await engine.analyzeScript(...args)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error, "analyze script")
    }
  }

  const getSuggestions = async (...args: Parameters<typeof engine.getSuggestions>) => {
    try {
      setLoading(true)
      const result = await engine.getSuggestions(...args)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error, "get suggestions")
    }
  }

  const improveSentiment = async (...args: Parameters<typeof engine.improveSentiment>) => {
    try {
      setLoading(true)
      const result = await engine.improveSentiment(...args)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error, "improve sentiment")
    }
  }

  const generateCharacterDialogue = async (...args: Parameters<typeof engine.generateCharacterDialogue>) => {
    try {
      setLoading(true)
      const result = await engine.generateCharacterDialogue(...args)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error, "generate dialogue")
    }
  }

  const generateCharacterBackground = async (...args: Parameters<typeof engine.generateCharacterBackground>) => {
    try {
      setLoading(true)
      const result = await engine.generateCharacterBackground(...args)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error, "generate character background")
    }
  }

  return {
    loading,
    generateScript,
    analyzeScript,
    getSuggestions,
    improveSentiment,
    generateCharacterDialogue,
    generateCharacterBackground,
  }
}