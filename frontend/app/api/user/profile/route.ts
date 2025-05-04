import { type NextRequest, NextResponse } from "next/server"
import { getCurrentSession } from "@/lib/auth"
import { updateUser, logUserActivity } from "@/lib/db"

export async function GET() {
  try {
    const session = await getCurrentSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user data
    const user = await getUserById(session.user_id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error: any) {
    console.error("Profile error:", error)

    return NextResponse.json({ error: error.message || "Failed to get profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getCurrentSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, bio, avatar_url } = body

    // Update user
    const updatedUser = await updateUser(session.user_id, {
      name,
      bio,
      avatar_url,
    })

    if (!updatedUser) {
      return NextResponse.json({ error: "No changes to update" }, { status: 400 })
    }

    // Log activity
    await logUserActivity(
      session.user_id,
      "profile_update",
      { fields: Object.keys(body) },
      request.headers.get("x-forwarded-for") || undefined,
    )

    // Return user without password
    const { password_hash, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    })
  } catch (error: any) {
    console.error("Profile update error:", error)

    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 })
  }
}

import { getUserById } from "@/lib/db"
