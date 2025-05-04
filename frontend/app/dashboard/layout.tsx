"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, checkAuth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    async function verifyAuth() {
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated && !loading) {
        router.push("/auth")
      }
    }

    verifyAuth()
  }, [checkAuth, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-lg text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, the useEffect will redirect
  // If authenticated, render the dashboard layout
  return <>{children}</>
}
