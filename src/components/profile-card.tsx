"use client"

import { User, Mail, Calendar, Shield } from "lucide-react"

interface ProfileCardProps {
  userId: string
  email: string
  fullName: string | null
  createdAt: string
  subscriptionStatus: string
  planName: string | null
}

export function ProfileCard({ 
  userId, 
  email, 
  fullName, 
  createdAt,
  subscriptionStatus,
  planName 
}: ProfileCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      active: { label: 'Active', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      trial: { label: 'Trial', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      inactive: { label: 'No Subscription', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
      expired: { label: 'Expired', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      cancelled: { label: 'Cancelled', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    }
    
    const badge = badges[status] || badges.inactive
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Profile Information</h2>
        <p className="text-sm text-muted-foreground">
          Your account details and subscription status
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Name Card */}
        <div className="flex items-start gap-3 p-4 border rounded-lg bg-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
            <p className="text-base font-semibold truncate">
              {fullName || 'Not set'}
            </p>
          </div>
        </div>

        {/* Email Card */}
        <div className="flex items-start gap-3 p-4 border rounded-lg bg-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground">Email Address</p>
            <p className="text-base font-semibold truncate" title={email}>
              {email}
            </p>
          </div>
        </div>

        {/* Subscription Status Card */}
        <div className="flex items-start gap-3 p-4 border rounded-lg bg-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground">Subscription</p>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(subscriptionStatus)}
              {planName && (
                <span className="text-sm font-medium text-foreground">
                  {planName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Member Since Card */}
        <div className="flex items-start gap-3 p-4 border rounded-lg bg-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground">Member Since</p>
            <p className="text-base font-semibold">
              {formatDate(createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* User ID - Collapsible/Copyable */}
      <details className="p-4 border rounded-lg bg-muted/50">
        <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
          Show User ID (for API configuration)
        </summary>
        <div className="mt-3 flex items-center gap-2">
          <code className="flex-1 px-3 py-2 text-xs bg-background border rounded font-mono break-all">
            {userId}
          </code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(userId)
              // You could add a toast notification here
            }}
            className="px-3 py-2 text-xs font-medium border rounded hover:bg-accent transition-colors"
            title="Copy to clipboard"
          >
            Copy
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Use this ID to configure special user access in the backend
        </p>
      </details>
    </div>
  )
}
