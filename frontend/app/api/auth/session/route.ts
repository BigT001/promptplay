import { NextResponse } from "next/server"
import auth from "@/lib/auth"
import { getUserById } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth.getCurrentSession()

    // Set cache headers
    const headers = {
      'Cache-Control': 'private, s-maxage=10',
      'Surrogate-Control': 'no-store',
    }

    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { headers }
      )
    }

    // Get user data
    const user = await getUserById(session.user_id)

    if (!user) {
      return NextResponse.json(
        { authenticated: false },
        { headers }
      )
    }

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        authenticated: true,
        user: userWithoutPassword,
        session: {
          expires: session.expires_at,
        },
      },
      { headers }
    )
  } catch (error: any) {
    console.error("Session error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to get session" },
      { status: 500 }
    )
  }
}
