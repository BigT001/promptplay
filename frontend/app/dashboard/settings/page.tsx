"use client"

import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>View and manage your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-lg">{user?.email || 'Not available'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Username</label>
              <p className="mt-1 text-lg">{user?.username || 'Not available'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Account Created</label>
              <p className="mt-1 text-lg">
                {user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'Not available'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}