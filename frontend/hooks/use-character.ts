"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

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

  const fetchCharacters = useCallback(async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/projects/${projectId}/characters`)
      // const data = await response.json()
      // setCharacters(data)
      setCharacters([]) // Temporary
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
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/projects/${projectId}/characters`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(data),
        // })
        // const newCharacter = await response.json()
        // setCharacters(prev => [...prev, newCharacter])

        // Temporary mock implementation
        const newCharacter = {
          id: Math.random(),
          ...data,
        }
        setCharacters(prev => [...prev, newCharacter])

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
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/projects/${projectId}/characters/${id}`, {
        //   method: "PATCH",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(data),
        // })
        // const updatedCharacter = await response.json()

        // Temporary mock implementation
        const updatedCharacter = {
          ...characters.find(c => c.id === id)!,
          ...data,
        }
        setCharacters(prev => prev.map(c => (c.id === id ? updatedCharacter : c)))

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
    [characters, toast]
  )

  const deleteCharacter = useCallback(
    async (id: number) => {
      setLoading(true)
      try {
        // TODO: Replace with actual API call
        // await fetch(`/api/projects/${projectId}/characters/${id}`, {
        //   method: "DELETE",
        // })

        // Temporary mock implementation
        setCharacters(prev => prev.filter(c => c.id !== id))

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
    [toast]
  )

  const generateCharacterBackground = useCallback(
    async (character: Character) => {
      setLoading(true)
      try {
        // TODO: Replace with actual API call to AI service
        // const response = await fetch(`/api/ai/generate-background`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     name: character.name,
        //     role: character.role,
        //     description: character.description,
        //     personality: character.personality,
        //     goals: character.goals,
        //   }),
        // })
        // const { background } = await response.json()

        // Temporary mock implementation
        const background = `Generated background for ${character.name}...`
        await updateCharacter(character.id, { background })

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
    [updateCharacter, toast]
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