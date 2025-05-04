"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CameraIcon, LoaderIcon, SaveIcon, UserIcon } from "@/components/icons"

interface UserProfile {
  id: number
  name: string
  email: string
  bio: string | null
  avatar_url: string | null
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar_url: "",
  })

  // Fetch user profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/user/profile")

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/auth")
            return
          }
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setProfile(data)
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router, toast])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const data = await response.json()
      setProfile(data.user)

      toast({
        title: "Success",
        description: "Your profile has been updated.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Handle avatar upload (placeholder for now)
  const handleAvatarUpload = () => {
    // In a real implementation, this would open a file picker and upload the image
    toast({
      title: "Feature coming soon",
      description: "Avatar upload functionality will be available soon.",
    })
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-2">
          <LoaderIcon className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-lg text-gray-300">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar Card */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription className="text-gray-400">
                Upload a profile picture to personalize your account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="h-32 w-32 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url || "/placeholder.svg"}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-16 w-16 text-gray-600" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 shadow-lg"
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
              </div>
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={handleAvatarUpload}
              >
                Change Picture
              </Button>
            </CardContent>
          </Card>

          {/* Profile Info Card */}
          <Card className="bg-gray-900 border-gray-800 md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription className="text-gray-400">Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-gray-800 border-gray-700 text-gray-400"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-gray-800 border-gray-700 text-white focus-visible:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    className="bg-gray-800 border-gray-700 text-white focus-visible:ring-blue-500 min-h-[120px]"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {saving ? (
                      <>
                        <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card className="bg-gray-900 border-gray-800 md:col-span-3">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription className="text-gray-400">Details about your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Member Since</p>
                    <p className="text-base text-white">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Account ID</p>
                    <p className="text-base text-white">#{profile?.id || "N/A"}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <h3 className="text-lg font-medium mb-2">Account Security</h3>
                  <Button variant="outline" className="mr-4 border-gray-700 text-gray-300 hover:bg-gray-800">
                    Change Password
                  </Button>
                  <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    Two-Factor Authentication
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
                  <Button variant="destructive" className="bg-red-900/30 hover:bg-red-900/50 text-red-400">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
