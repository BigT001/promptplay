"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileTextIcon, PlusIcon } from "@/components/icons"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Project = {
  id: number
  title: string
  description: string | null
  category: string | null
  progress: number
}

interface ProjectsListProps {
  projects: Project[]
  loading: boolean
  onCreateProject: () => void
  onOpenProject: (projectId: number) => void
}

export function ProjectsList({ projects, loading, onCreateProject, onOpenProject }: ProjectsListProps) {
  const router = useRouter()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-800 p-4 rounded-lg animate-pulse">
            <div className="h-5 w-1/2 bg-gray-700 rounded mb-4"></div>
            <div className="h-2 w-full bg-gray-700 rounded mb-2"></div>
            <div className="h-2 w-3/4 bg-gray-700 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
              <div className="h-4 w-1/6 bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <p className="text-gray-400">You haven&apos;t created any projects yet.</p>
            <Button
              onClick={() => router.push("/dashboard/create-project")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Projects</h2>
        <Button
          onClick={() => router.push("/dashboard/create-project")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="bg-gray-900 border-gray-800 cursor-pointer hover:border-gray-700 transition-colors"
            onClick={() => router.push(`/dashboard/projects/${project.id}`)}
          >
            <CardHeader>
              <CardTitle className="line-clamp-1">{project.title}</CardTitle>
              {project.category && (
                <CardDescription className="text-gray-400">
                  {project.category}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {project.description && (
                <p className="text-gray-400 line-clamp-2">{project.description}</p>
              )}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}