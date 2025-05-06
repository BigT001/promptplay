"use client"

import { useState, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { AIScriptEngine } from "@/lib/ai-engine"

interface AIResponse {
  content?: string
  error?: string
}

interface AIOptions {
  provider?: "ollama" | "gemini" | "auto"
  model?: string
  maxTokens?: number
  temperature?: number
  timeout?: number
}

export interface AIStatus {
  isLoading: boolean
  error: Error | null
  progress?: number
}

const defaultConfig = {
  maxTokens: 2000,
  temperature: 0.7,
  model: "llama2",
  timeout: 30000
}

export function useAIEngine(config = defaultConfig) {
  const engineRef = useRef<AIScriptEngine>(new AIScriptEngine(config))
  const [status, setStatus] = useState<AIStatus>({ isLoading: false, error: null })
  const { toast } = useToast()

  const handleError = (error: Error, action: string) => {
    const errorMessage = error.message || `Failed to ${action}`
    console.error(`AI Engine ${action} error:`, error)
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    })
    setStatus(prev => ({ ...prev, error, isLoading: false }))
    throw error
  }

  const updateStatus = () => {
    const engineStatus = engineRef.current.status
    setStatus(engineStatus)
    return engineStatus
  }

  const generateScript = async (
    prompt: string,
    options: AIOptions = {}
  ): Promise<AIResponse> => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: null }))
      
      // Update engine config with any request-specific options
      engineRef.current = new AIScriptEngine({
        ...config,
        ...options,
      })

      const result = await engineRef.current.generateScript({ prompt })
      updateStatus()
      return { content: result.content }
    } catch (error) {
      if (error instanceof Error) {
        handleError(error, "generate script")
      }
      throw error
    }
  }

  const analyzeScript = async (
    content: string,
    options: AIOptions = {}
  ): Promise<AIResponse> => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: null }))

      engineRef.current = new AIScriptEngine({
        ...config,
        ...options,
      })

      const result = await engineRef.current.analyzeScript({ content })
      updateStatus()
      return { content: result.analysis }
    } catch (error) {
      if (error instanceof Error) {
        handleError(error, "analyze script")
      }
      throw error
    }
  }

  const generateCharacterBackground = async (
    character: {
      name: string
      role?: string
      description?: string
      personality?: string
      goals?: string
    },
    options: AIOptions = {}
  ) => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: null }))

      engineRef.current = new AIScriptEngine({
        ...config,
        ...options,
      })

      const result = await engineRef.current.generateCharacterBackground(character)
      updateStatus()
      return { content: result.background }
    } catch (error) {
      if (error instanceof Error) {
        handleError(error, "generate character background")
      }
      throw error
    }
  }

  const getSuggestions = async (
    content: string,
    targetAspect: string,
    context?: string,
    options: AIOptions = {}
  ) => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: null }))

      engineRef.current = new AIScriptEngine({
        ...config,
        ...options,
      })

      const result = await engineRef.current.getSuggestions({ content, targetAspect, context })
      updateStatus()
      return { content: result.suggestions }
    } catch (error) {
      if (error instanceof Error) {
        handleError(error, "get suggestions")
      }
      throw error
    }
  }

  const reset = () => {
    engineRef.current.reset()
    updateStatus()
  }

  return {
    status,
    generateScript,
    analyzeScript,
    generateCharacterBackground,
    getSuggestions,
    reset,
  }
}