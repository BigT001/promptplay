import { type NextRequest, NextResponse } from "next/server"
import { getCurrentSession } from "@/lib/auth"
import {
  getProjectById,
  getCharacterById,
  updateCharacter, 
  deleteCharacter,
} from "@/lib/db"
import { z } from "zod"

// Schema for character update
const characterUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  role: z.string().optional(),
  description: z.string().optional(),
  background: z.string().optional(),
  personality: z.string().optional(),
  goals: z.string().optional(),
})

// Get a specific character
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; characterId: string } }
) {
  try {
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = parseInt(params.id)
    const characterId = parseInt(params.characterId)
    if (isNaN(projectId) || isNaN(characterId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    // Verify project belongs to user
    const project = await getProjectById(projectId, session.user_id)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const character = await getCharacterById(characterId)
    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 })
    }

    // Verify character belongs to project
    if (character.project_id !== projectId) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 })
    }

    return NextResponse.json(character)
  } catch (error: any) {
    console.error("Error in GET /api/projects/[id]/characters/[characterId]:", error)
    return NextResponse.json(
      { error: error.message || "Failed to get character" },
      { status: 500 }
    )
  }
}

// Update a specific character
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; characterId: string } }
) {
  try {
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = parseInt(params.id)
    const characterId = parseInt(params.characterId)
    if (isNaN(projectId) || isNaN(characterId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    // Verify project belongs to user
    const project = await getProjectById(projectId, session.user_id)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Verify character exists and belongs to project
    const existingCharacter = await getCharacterById(characterId)
    if (!existingCharacter || existingCharacter.project_id !== projectId) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = characterUpdateSchema.parse(body)

    const updatedCharacter = await updateCharacter(characterId, validatedData)
    if (!updatedCharacter) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 })
    }

    return NextResponse.json(updatedCharacter)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error in PUT /api/projects/[id]/characters/[characterId]:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update character" },
      { status: 500 }
    )
  }
}

// Delete a specific character
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; characterId: string } }
) {
  try {
    const session = await getCurrentSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = parseInt(params.id)
    const characterId = parseInt(params.characterId)
    if (isNaN(projectId) || isNaN(characterId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    // Verify project belongs to user
    const project = await getProjectById(projectId, session.user_id)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Verify character exists and belongs to project
    const character = await getCharacterById(characterId)
    if (!character || character.project_id !== projectId) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 })
    }

    await deleteCharacter(characterId)
    return NextResponse.json({ message: "Character deleted successfully" })
  } catch (error: any) {
    console.error("Error in DELETE /api/projects/[id]/characters/[characterId]:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete character" },
      { status: 500 }
    )
  }
}