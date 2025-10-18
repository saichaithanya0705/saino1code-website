"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { FreeTrialModal } from "@/components/free-trial-modal"

export function DashboardTrialWrapper({ children }: { children: React.ReactNode }) {
  const [showTrialModal, setShowTrialModal] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const showTrial = searchParams.get("show_trial")
    if (showTrial === "true") {
      setShowTrialModal(true)
      // Remove the query parameter from URL without page reload
      const url = new URL(window.location.href)
      url.searchParams.delete("show_trial")
      window.history.replaceState({}, "", url.toString())
    }
  }, [searchParams])

  return (
    <>
      {children}
      <FreeTrialModal open={showTrialModal} onOpenChange={setShowTrialModal} />
    </>
  )
}
