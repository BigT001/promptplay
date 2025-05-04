import { type NextRequest, NextResponse } from "next/server"
import { getCurrentSession } from "@/lib/auth"
import { getUserProjects, createProject, logUserActivity } from "@/lib/db"

export async function GET() {
  try {
    const session = await getCurrentSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user projects
    const projects = await getUserProjects(session.user_id)

    return NextResponse.json(projects)
  } catch (error: any) {
    console.error("Projects error:", error)

    return NextResponse.json({ error: error.message || "Failed to get projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category } = body

    // Validate input
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Create project
    const project = await createProject(session.user_id, title, description, category)

    // Log activity
    await logUserActivity(
      session.user_id,
      "project_create",
      { project_id: project.id, title },
      request.headers.get("x-forwarded-for") || undefined,
    )

    return NextResponse.json({
      message: "Project created successfully",
      project,
    })
  } catch (error: any) {
    console.error("Project creation error:", error)

    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 })
  }
}
