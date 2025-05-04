import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Project } from "../types"

interface ProjectOverviewProps {
  projects: Project[]
  loading: boolean
}

export function ProjectOverview({ projects, loading }: ProjectOverviewProps) {
  const completedProjects = projects.filter((p) => p.progress === 100).length

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription className="text-gray-400">
          Here's what's happening with your projects today.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Active Projects</div>
            <div className="text-2xl font-bold mt-1">{loading ? "-" : projects.length}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Completed</div>
            <div className="text-2xl font-bold mt-1">{loading ? "-" : completedProjects}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400">AI Credits</div>
            <div className="text-2xl font-bold mt-1">1,250</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}