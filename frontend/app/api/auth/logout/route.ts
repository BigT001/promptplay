import { type NextRequest, NextResponse } from "next/server"
import auth from "@/lib/auth"
import { logUserActivity } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await auth.getCurrentSession()
    
    if (session) {
      // Log activity before logging out
      await logUserActivity(
        session.user_id,
        "logout",
        {},
        request.headers.get("x-forwarded-for") || undefined
      )
    }

    await auth.logoutUser()

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error: any) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to logout" },
      { status: 500 }
    )
  }
}
