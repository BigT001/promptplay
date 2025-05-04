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

export function useCharacter(projectId: number) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const ai = useAIEngine()

  const fetchCharacters = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/characters`)
      if (!response.ok) {
        throw new Error("Failed to fetch characters")
      }
      const data = await response.json()
      setCharacters(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch characters",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [projectId, toast])

  const createCharacter = useCallback(
    async (data: Omit<Character, "id">) => {
      setLoading(true)
      try {
        const response = await fetch(`/api/projects/${projectId}/characters`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to create character")
        }

        const newCharacter = await response.json()
        setCharacters((prev) => [...prev, newCharacter])

        toast({
          title: "Success",
          description: "Character created successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create character",
          variant: "destructive",
        })
        throw error
      } finally {
        setLoading(false)
      }
    },
    [projectId, toast]
  )

  const updateCharacter = useCallback(
    async (id: number, data: Partial<Character>) => {
      setLoading(true)
      try {
        const response = await fetch(`/api/projects/${projectId}/characters/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to update character")
        }

        const updatedCharacter = await response.json()
        setCharacters((prev) => prev.map((c) => (c.id === id ? updatedCharacter : c)))

        toast({
          title: "Success",
          description: "Character updated successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update character",
          variant: "destructive",
        })
        throw error
      } finally {
        setLoading(false)
      }
    },
    [projectId, toast]
  )

  const deleteCharacter = useCallback(
    async (id: number) => {
      setLoading(true)
      try {
        const response = await fetch(`/api/projects/${projectId}/characters/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete character")
        }

        setCharacters((prev) => prev.filter((c) => c.id !== id))

        toast({
          title: "Success",
          description: "Character deleted successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete character",
          variant: "destructive",
        })
        throw error
      } finally {
        setLoading(false)
      }
    },
    [projectId, toast]
  )

  const generateCharacterBackground = useCallback(
    async (character: Character) => {
      setLoading(true)
      try {
        const result = await ai.generateCharacterBackground(character)
        await updateCharacter(character.id, { background: result.background })

        toast({
          title: "Success",
          description: "Character background generated successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate character background",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [updateCharacter, ai, toast]
  )

  return {
    characters,
    loading,
    fetchCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    generateCharacterBackground,
  }
}