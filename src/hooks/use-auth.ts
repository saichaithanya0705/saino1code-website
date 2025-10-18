"use client"

import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  subscription_status: 'active' | 'inactive' | 'trial' | 'cancelled'
  razorpay_subscription_id: string | null
  razorpay_plan_id: string | null
  razorpay_current_period_end: string | null
  plan_name: string | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error fetching profile:", error)
      } else if (data) {
        setProfile({
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          subscription_status: data.subscription_status,
          razorpay_subscription_id: data.razorpay_subscription_id,
          razorpay_plan_id: data.razorpay_plan_id,
          razorpay_current_period_end: data.razorpay_current_period_end,
          plan_name: data.plan_name,
        })
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = () => {
    if (user?.id) {
      fetchProfile(user.id)
    }
  }

  // Helper functions
  const isAuthenticated = !!user
  
  const hasActiveSubscription = () => {
    if (!profile) return false
    return profile.subscription_status === 'active'
  }

  const isInTrial = () => {
    if (!profile) return false
    return profile.subscription_status === 'trial'
  }

  const hasActiveSubscriptionOrTrial = () => {
    return hasActiveSubscription() || isInTrial()
  }

  const shouldShowTrialButton = () => {
    if (!isAuthenticated || !profile) return false
    return !hasActiveSubscriptionOrTrial()
  }

  const getUserInitials = () => {
    if (!user) return "?"
    
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase()
    }
    
    return "?"
  }

  const getUserDisplayName = () => {
    if (!user) return ""
    return profile?.full_name || user.email || "User"
  }

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    hasActiveSubscription: hasActiveSubscription(),
    isInTrial: isInTrial(),
    hasActiveSubscriptionOrTrial: hasActiveSubscriptionOrTrial(),
    shouldShowTrialButton: shouldShowTrialButton(),
    getUserInitials,
    getUserDisplayName,
    refreshProfile,
  }
}
