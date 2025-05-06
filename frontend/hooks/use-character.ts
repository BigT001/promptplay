"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAIEngine } from "@/hooks/use-ai-engine"

interface Character {
  id: number
  name: string
  role?: string
  description?: string
  personality?: string
  goals?: string
  background?: string
}

interface CharacterStatus {
  isLoading: boolean
  error: Error | null
  aiStatus?: {
    isGenerating: boolean
    error: Error | null
  }
}

export function useCharacter(projectId: number) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [status, setStatus] = useState<CharacterStatus>({
    isLoading: false,
    error: null,
    aiStatus: {
      isGenerating: false,
      error: null
    }
  })
  const { toast } = useToast()
  const { generateCharacterBackground, status: aiStatus } = useAIEngine()

  const updateStatus = (update: Partial<CharacterStatus>) => {
    setStatus(prev => ({ ...prev, ...update }))
  }

  const fetchCharacters = useCallback(async () => {
    updateStatus({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/projects/${projectId}/characters`)
      if (!response.ok) {
        throw new Error("Failed to fetch characters")
      }
      const data = await response.json()
      setCharacters(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch characters"
      updateStatus({ error: error as Error })
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      updateStatus({ isLoading: false })
    }
  }, [projectId, toast])

  const createCharacter = useCallback(
    async (data: Omit<Character, "id">) => {
      updateStatus({ isLoading: true, error: null })
      try {
        const response = await fetch(`/api/projects/${projectId}/characters`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || "Failed to create character")
        }

        const newCharacter = await response.json()
        setCharacters((prev) => [...prev, newCharacter])

        toast({
          title: "Success",
          description: "Character created successfully",
        })

        return newCharacter
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create character"
        updateStatus({ error: error as Error })
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        throw error
      } finally {
        updateStatus({ isLoading: false })
      }
    },
    [projectId, toast]
  )

  const updateCharacter = useCallback(
    async (id: number, data: Partial<Character>) => {
      updateStatus({ isLoading: true, error: null })
      try {
        const response = await fetch(`/api/projects/${projectId}/characters/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || "Failed to update character")
        }

        const updatedCharacter = await response.json()
        setCharacters((prev) => prev.map((c) => (c.id === id ? updatedCharacter : c)))

        toast({
          title: "Success",
          description: "Character updated successfully",
        })

        return updatedCharacter
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update character"
        updateStatus({ error: error as Error })
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        throw error
      } finally {
        updateStatus({ isLoading: false })
      }
    },
    [projectId, toast]
  )

  const deleteCharacter = useCallback(
    async (id: number) => {
      updateStatus({ isLoading: true, error: null })
      try {
        const response = await fetch(`/api/projects/${projectId}/characters/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || "Failed to delete character")
        }

        setCharacters((prev) => prev.filter((c) => c.id !== id))
        toast({
          title: "Success",
          description: "Character deleted successfully",
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete character"
        updateStatus({ error: error as Error })
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        throw error
      } finally {
        updateStatus({ isLoading: false })
      }
    },
    [projectId, toast]
  )

  const generateBackground = useCallback(
    async (character: Character) => {
      updateStatus({
        aiStatus: { isGenerating: true, error: null }
      })
      try {
        const result = await generateCharacterBackground({
          name: character.name,
          role: character.role,
          description: character.description,
          personality: character.personality,
          goals: character.goals
        })

        if (result.content) {
          await updateCharacter(character.id, {
            background: result.content
          })
        }

        toast({
          title: "Success",
          description: "Character background generated successfully",
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to generate background"
        updateStatus({
          aiStatus: { isGenerating: false, error: error as Error }
        })
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        throw error
      } finally {
        updateStatus({
          aiStatus: { isGenerating: false, error: null }
        })
      }
    },
    [generateCharacterBackground, updateCharacter, toast]
  )

  return {
    characters,
    status: {
      ...status,
      aiStatus: {
        ...status.aiStatus,
        ...aiStatus
      }
    },
    fetchCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    generateBackground
  }
}