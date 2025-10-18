import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user already has an active subscription or trial
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("subscription_status, razorpay_current_period_end")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      )
    }

    // Check if user already has active subscription or trial
    if (profile.subscription_status === "active" || profile.subscription_status === "trial") {
      return NextResponse.json(
        { error: "You already have an active subscription or trial" },
        { status: 400 }
      )
    }

    // Calculate trial period (14 days from now)
    const trialStartDate = new Date()
    const trialEndDate = new Date()
    trialEndDate.setDate(trialEndDate.getDate() + 14)

    // Update user profile with trial information
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        subscription_status: "trial",
        razorpay_current_period_start: trialStartDate.toISOString(),
        razorpay_current_period_end: trialEndDate.toISOString(),
        plan_name: "Free Trial",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("Error updating profile:", updateError)
      return NextResponse.json(
        { error: "Failed to start trial" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Trial started successfully",
      trialEndDate: trialEndDate.toISOString(),
    })
  } catch (error) {
    console.error("Error in start-trial API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
