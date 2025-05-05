import { type NextRequest, NextResponse } from "next/server"
import { getCurrentSession } from "@/lib/auth"
import { getProjectById, updateProject, logUserActivity } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const session = await getCurrentSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = Number.parseInt(params.projectId)

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Get project
    const project = await getProjectById(projectId, session.user_id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error: any) {
    console.error("Project error:", error)
    return NextResponse.json({ error: error.message || "Failed to get project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const session = await getCurrentSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = Number.parseInt(params.projectId)

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const body = await request.json()
    const { title, description, content, progress } = body

    // Update project
    const updatedProject = await updateProject(projectId, session.user_id, {
      title,
      description,
      content,
      progress,
    })

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found or no changes to update" }, { status: 404 })
    }

    // Log activity
    await logUserActivity(
      session.user_id,
      "project_update",
      { project_id: projectId, fields: Object.keys(body) },
      request.headers.get("x-forwarded-for") || undefined,
    )

    return NextResponse.json({
      message: "Project updated successfully",
      project: updatedProject,
    })
  } catch (error: any) {
    console.error("Project update error:", error)
    return NextResponse.json({ error: error.message || "Failed to update project" }, { status: 500 })
  }
}
