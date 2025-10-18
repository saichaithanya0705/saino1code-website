"use client"

import { useState } from "react"
import { Check, Sparkles, X } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"

interface FreeTrialModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const trialFeatures = [
  "Full access to AI-powered code generation",
  "Unlimited semantic search across your codebase",
  "Multi-model AI brain (GPT-4, Claude, Gemini)",
  "Context-aware code suggestions",
  "Real-time collaboration features",
  "Priority support for 14 days",
  "No credit card required",
]

export function FreeTrialModal({ open, onOpenChange }: FreeTrialModalProps) {
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { refreshProfile } = useAuth()
  const router = useRouter()

  const handleStartTrial = async () => {
    setIsStarting(true)
    setError(null)

    try {
      const response = await fetch("/api/start-trial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to start trial")
      }

      // Refresh profile to update subscription status
      await refreshProfile()
      
      // Close modal and redirect to dashboard
      onOpenChange(false)
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      console.error("Error starting trial:", err)
      setError(err instanceof Error ? err.message : "Failed to start trial")
    } finally {
      setIsStarting(false)
    }
  }

  const handleMaybeLater = () => {
    onOpenChange(false)
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle className="text-2xl">Start Your Free Trial</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-base pt-2">
            Get full access to SaiNo1Code for 14 days. Experience the power of AI-assisted
            development with no commitment required.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="space-y-3">
            {trialFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground flex-1">{feature}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-1">
                  Start coding smarter, today
                </h4>
                <p className="text-xs text-muted-foreground">
                  Your trial starts immediately. After 14 days, choose a plan that works for
                  you or continue with our free tier.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-3">
              <div className="flex items-start gap-2">
                <X className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleMaybeLater}
            disabled={isStarting}
            className="w-full sm:w-auto"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleStartTrial}
            disabled={isStarting}
            className="w-full sm:w-auto"
          >
            {isStarting ? (
              <>
                <span className="mr-2">Starting Trial...</span>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Start Free Trial
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
