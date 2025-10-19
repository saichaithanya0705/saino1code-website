"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function StartTrialButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const handleClick = async () => {
    setIsLoading(true)

    try {
      // If not logged in, redirect to signup
      if (!user) {
        router.push("/signup")
        return
      }

      // If logged in, start trial directly
      const response = await fetch("/api/start-trial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        // If user already has subscription/trial, just go to dashboard
        if (response.status === 400) {
          router.push("/dashboard")
          return
        }
        throw new Error(data.error || "Failed to start trial")
      }

      // Success - redirect to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      console.error("Error starting trial:", err)
      // On error, redirect to signup to be safe
      router.push("/signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button size="lg" onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Starting Trial...
        </>
      ) : (
        <>
          Start Free Trial
          <ArrowRight className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  )
}
