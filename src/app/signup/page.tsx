"use client"

import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

export default function SignupPage() {
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)
  const [microsoftLoading, setMicrosoftLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOAuthSignIn = async (provider: 'github' | 'google' | 'azure') => {
    try {
      setError(null)
      
      // Set loading state for specific provider
      if (provider === 'google') setGoogleLoading(true)
      else if (provider === 'github') setGithubLoading(true)
      else if (provider === 'azure') setMicrosoftLoading(true)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error(`${provider} OAuth error:`, error)
        setError(`Failed to sign up with ${provider}. Please try again.`)
        // Reset loading state on error
        if (provider === 'google') setGoogleLoading(false)
        else if (provider === 'github') setGithubLoading(false)
        else if (provider === 'azure') setMicrosoftLoading(false)
      }
      // If successful, user will be redirected automatically
    } catch (err) {
      console.error('OAuth sign up error:', err)
      setError('An unexpected error occurred. Please try again.')
      // Reset loading states
      setGoogleLoading(false)
      setGithubLoading(false)
      setMicrosoftLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input id="full-name" name="full_name" placeholder="SaiNo1Code" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" formAction="/auth/signup" className="w-full">
              Create an account
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>
           <div className="grid grid-cols-3 gap-2">
             <Button 
              variant="outline" 
              onClick={() => handleOAuthSignIn('github')}
              disabled={isLoading || githubLoading}
            >
              {githubLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.gitHub className="mr-2 h-4 w-4" />
              )}
              GitHub
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading || googleLoading}
            >
              {googleLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
             <Button 
              variant="outline" 
              onClick={() => handleOAuthSignIn('azure')}
              disabled={isLoading || microsoftLoading}
            >
              {microsoftLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.microsoft className="mr-2 h-4 w-4" />
              )}
              Microsoft
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}