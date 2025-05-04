import { type NextRequest, NextResponse } from "next/server"
import auth from "@/lib/auth"
import { logUserActivity } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Login user
    const user = await auth.loginUser(
      email,
      password,
      request.headers.get("x-forwarded-for") || undefined,
      request.headers.get("user-agent") || undefined
    )

    // Log activity
    await logUserActivity(
      user.id,
      "login",
      { email: user.email },
      request.headers.get("x-forwarded-for") || undefined
    )

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
    })
  } catch (error: any) {
    console.error("Login error:", error)

    return NextResponse.json(
      { error: error.message || "Failed to login" },
      { status: error.message === "Invalid email or password" ? 401 : 500 }
    )
  }
}
