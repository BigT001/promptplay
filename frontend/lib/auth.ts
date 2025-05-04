import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { getUserByEmail, createUser, getSessionByToken, createSession, deleteSession } from "./db"

// Constants
const SESSION_COOKIE_NAME = "auth_session"
const SESSION_DURATION_DAYS = 7

// Helper to generate a secure random token
export function generateToken(length = 32) {
  return crypto.randomBytes(length).toString("hex")
}

// Hash password using bcrypt
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

// Compare password with hash
export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

// Create a new user
export async function registerUser(name: string, email: string, password: string) {
  // Check if user already exists
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Hash password and create user
  const passwordHash = await hashPassword(password)
  const user = await createUser(name, email, passwordHash)

  return user
}

// Login user and create session
export async function loginUser(email: string, password: string, ipAddress?: string, userAgent?: string) {
  // Get user by email
  const user = await getUserByEmail(email)
  if (!user) {
    throw new Error("Invalid email or password")
  }

  // Compare password
  const passwordMatch = await comparePassword(password, user.password_hash)
  if (!passwordMatch) {
    throw new Error("Invalid email or password")
  }

  // Create session
  const token = generateToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

  await createSession(user.id, token, expiresAt, ipAddress, userAgent)

  // Set session cookie
  ;(await
    // Set session cookie
    cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  return user
}

// Logout user
export async function logoutUser() {
  const cookieStore = cookies()
  const sessionToken = (await cookieStore).get(SESSION_COOKIE_NAME)?.value

  if (sessionToken) {
    await deleteSession(sessionToken)
    ;(await cookieStore).delete(SESSION_COOKIE_NAME)
  }
}

// Get current session
export async function getCurrentSession() {
  const cookieStore = cookies()
  const sessionToken = (await cookieStore).get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    return null
  }

  const session = await getSessionByToken(sessionToken)

  if (!session || new Date(session.expires_at) < new Date()) {
    (await cookieStore).delete(SESSION_COOKIE_NAME)
    return null
  }

  return session
}

// Middleware to protect routes
export async function requireAuth() {
  const session = await getCurrentSession()

  if (!session) {
    redirect("/auth")
  }

  return session
}

// Re-export all functions as a named export object
export const auth = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentSession,
  requireAuth,
  generateToken,
  hashPassword,
  comparePassword,
}

// Also keep the individual exports for backward compatibility
export default auth
