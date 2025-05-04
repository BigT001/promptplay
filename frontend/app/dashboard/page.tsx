"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
  XIcon 
} from "@/components/icons"
import { ProjectsList } from "./components/projects-list"
import { ProjectOverview } from "./components/project-overview"
import { AnalyticsSection } from "./components/analytics-section"
import type { Project } from "./types"

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingProjects(false)
    }
  }

  const handleCreateProject = () => {
    router.push("/dashboard/create-project")
  }

  const handleOpenProject = (projectId: number) => {
    router.push(`/dashboard/projects/${projectId}`)
  }

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-900 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${
        mobileNavOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">PromptPlay</h1>
          <ThemeToggle />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white bg-gray-800"
          >
            <HomeIcon className="h-5 w-5" />
            Dashboard
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={() => router.push("/dashboard/settings")}
          >
            <SettingsIcon className="h-5 w-5" />
            Settings
          </Button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user?.name || "User"}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <UserIcon className="h-5 w-5" />
              )}
            </div>
            <span className="text-sm font-medium text-white">{user?.name || "User"}</span>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={logout}
          >
            <LogOutIcon className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-gray-900 border-b border-gray-800">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              {mobileNavOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </Button>
            <Button 
              className="ml-auto bg-blue-600 hover:bg-blue-700"
              onClick={handleCreateProject}
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Create New Project
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-950">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-gray-900 border border-gray-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <ProjectOverview projects={projects} loading={loadingProjects} />
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription className="text-gray-400">Your most recent writing projects.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectsList
                    projects={projects.slice(0, 3)}
                    loading={loadingProjects}
                    onCreateProject={handleCreateProject}
                    onOpenProject={handleOpenProject}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>All Projects</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage and organize your writing projects.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectsList
                    projects={projects}
                    loading={loadingProjects}
                    onCreateProject={handleCreateProject}
                    onOpenProject={handleOpenProject}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsSection />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
