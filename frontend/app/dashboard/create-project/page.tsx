"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeftIcon } from "@/components/icons"
import { useAIEngine } from "@/hooks/use-ai-engine"

const categories = [
  "Novel",
  "Short Story",
  "Poetry",
  "Screenplay",
  "Blog Post",
  "Other"
]

export default function CreateProject() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { generateScript } = useAIEngine()

  const generateInitialScript = async (title: string, category: string, description: string) => {
    try {
      const prompt = `Generate a ${category} script titled "${title}". Context: ${description}`;
      const { content } = await generateScript(prompt);
      return content;
    } catch (error) {
      console.error('Error generating script:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    
    try {
      // First create the project
      const projectResponse = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
        }),
      })

      if (!projectResponse.ok) {
        const errorData = await projectResponse.json()
        throw new Error(errorData.error || "Failed to create project")
      }

      const { project } = await projectResponse.json()

      if (!project?.id) {
        throw new Error("Invalid project data received")
      }

      // Generate initial script content
      const scriptContent = await generateInitialScript(title, category, description)

      // Update project with generated content
      const updateResponse = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: scriptContent,
        }),
      })

      if (!updateResponse.ok) {
        throw new Error("Failed to update project with initial content")
      }

      toast({
        title: "Success",
        description: "Project created with initial script generated",
      })
      
      router.push(`/dashboard/projects/${project.id}`)
    } catch (error: any) {
      console.error("Project creation error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription className="text-gray-400">
            Start a new writing project and unleash your creativity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Enter your project title"
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter a brief description of your project"
                className="bg-gray-800 border-gray-700 min-h-[100px]"
              />
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}