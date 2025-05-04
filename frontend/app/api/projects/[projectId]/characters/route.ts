import { type NextRequest, NextResponse } from "next/server"
import { getCurrentSession } from "@/lib/auth"
import { getProjectById, getCharactersByProject, createCharacter } from "@/lib/db"
import { z } from "zod"

// Schema for character creation/update
const characterInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.string().optional(),
  description: z.string().optional(),
  background: z.string().optional(),
  personality: z.string().optional(),
  goals: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = parseInt(params.projectId)
    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Verify project belongs to user
    const project = await getProjectById(projectId, session.user_id)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const characters = await getCharactersByProject(projectId)
    return NextResponse.json(characters)
  } catch (error: any) {
    console.error("Error in GET /api/projects/[projectId]/characters:", error)
    return NextResponse.json(
      { error: error.message || "Failed to get characters" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = parseInt(params.projectId)
    if (isNaN(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Verify project belongs to user
    const project = await getProjectById(projectId, session.user_id)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = characterInputSchema.parse(body)

    const character = await createCharacter(projectId, validatedData)
    return NextResponse.json(character, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error in POST /api/projects/[projectId]/characters:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create character" },
      { status: 500 }
    )
  }
}