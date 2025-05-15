"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import ResumeBuilder from "@/components/resume-builder"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold">Resume Builder</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Logged in as {user?.username}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <ResumeBuilder />
      </Suspense>
    </main>
  )
}
