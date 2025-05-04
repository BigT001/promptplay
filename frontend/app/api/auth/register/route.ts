import { type NextRequest, NextResponse } from "next/server"
import auth from "@/lib/auth"
import { logUserActivity } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Register user
    const user = await auth.registerUser(name, email, password)

    // Login user after registration
    const loggedInUser = await auth.loginUser(
      email,
      password,
      request.headers.get("x-forwarded-for") || undefined,
      request.headers.get("user-agent") || undefined
    )

    // Log activity
    await logUserActivity(
      user.id,
      "register",
      { email: user.email },
      request.headers.get("x-forwarded-for") || undefined
    )

    // Return user without password
    const { password_hash, ...userWithoutPassword } = loggedInUser

    return NextResponse.json({
      message: "User registered successfully",
      user: userWithoutPassword,
    })
  } catch (error: any) {
    console.error("Registration error:", error)

    return NextResponse.json(
      { error: error.message || "Failed to register user" },
      { status: error.message === "User with this email already exists" ? 409 : 500 }
    )
  }
}
