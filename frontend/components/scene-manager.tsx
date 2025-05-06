"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { PlusIcon } from "@/components/icons"

interface Scene {
  id?: number
  project_id: number
  title: string
  sequence_number: number
  content?: string
  notes?: string
  status?: string
}

interface SceneManagerProps {
  projectId: number
}

export function SceneManager({ projectId }: SceneManagerProps) {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchScenes()
  }, [projectId])

  const fetchScenes = async () => {
    try {
      const response = await fetch(`/api/scenes/${projectId}`)
      if (!response.ok) throw new Error("Failed to fetch scenes")
      const data = await response.json()
      setScenes(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load scenes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createScene = async () => {
    try {
      const newScene: Scene = {
        project_id: projectId,
        title: "New Scene",
        sequence_number: scenes.length + 1,
      }

      const response = await fetch("/api/scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newScene),
      })

      if (!response.ok) throw new Error("Failed to create scene")
      const data = await response.json()
      setScenes([...scenes, data])
      
      toast({
        title: "Success",
        description: "Scene created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create scene",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading scenes...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Scenes</h2>
        <Button onClick={createScene}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Scene
        </Button>
      </div>

      <div className="grid gap-4">
        {scenes.map((scene) => (
          <Card key={scene.id} className="bg-card">
            <CardHeader>
              <CardTitle>{scene.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={scene.content || ""}
                placeholder="Scene content..."
                className="min-h-[100px]"
                readOnly
              />
              {scene.notes && (
                <Textarea
                  value={scene.notes}
                  placeholder="Notes..."
                  className="mt-2"
                  readOnly
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}