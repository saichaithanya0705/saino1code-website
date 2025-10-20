"use client"

import { useState } from "react"
import { regenerateApiKey, generateApiKey } from "@/app/dashboard/actions"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CodeBlock } from "./code-block"
import { Loader2, ShieldAlert, KeyRound, ShieldX } from "lucide-react"

interface ApiKeyManagerProps {
  apiKeyPrefix: string | null
  initialApiKey?: string | null
}

export function ApiKeyManager({ apiKeyPrefix, initialApiKey = null }: ApiKeyManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [newApiKey, setNewApiKey] = useState<string | null>(initialApiKey)

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const result = await generateApiKey()
      if (result.newApiKey) {
        setNewApiKey(result.newApiKey)
      }
    } catch (error) {
      console.error(error)
      alert("Failed to generate API key.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerate = async () => {
    setIsLoading(true)
    try {
      const result = await regenerateApiKey()
      if (result.newApiKey) {
        setNewApiKey(result.newApiKey)
      }
    } catch (error) {
      console.error(error)
      alert("Failed to regenerate API key.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">VS Code Extension API Key</h2>
      <p className="text-muted-foreground mt-2 mb-4">
        Generate API keys for connecting the SaiNo1Code VS Code extension. You can have up to 3 active keys for different devices.
      </p>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <div className="font-mono text-sm">
            {apiKeyPrefix ? `${apiKeyPrefix}...` : "No key generated yet."}
          </div>
          <div className="flex gap-2">
            {/* Generate New Key (keeps old keys active) */}
            <Button
              variant="default"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <KeyRound className="mr-2 h-4 w-4" />
              Generate New Key
            </Button>

            {/* Regenerate (revokes ALL keys) */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isLoading}>
                  <ShieldX className="mr-2 h-4 w-4" />
                  Revoke All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Revoke ALL API Keys?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently revoke ALL your existing API keys and generate a new one. 
                    The VS Code extension on ALL devices will stop working until you update them with the new key.
                    <br /><br />
                    <strong>Use "Generate New Key" instead if you just need a key for another device.</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRegenerate} className="bg-destructive text-destructive-foreground">
                    Revoke All & Generate New
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Info box explaining the difference */}
        <div className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 rounded-lg">
          <div className="flex gap-2 items-start">
            <ShieldAlert className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm space-y-2">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Two ways to manage keys:
              </p>
              <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                <li>
                  <strong>Generate New Key:</strong> Creates a new key while keeping existing keys active. 
                  Use this for adding the extension on another device (up to 3 active keys).
                </li>
                <li>
                  <strong>Revoke All:</strong> Deactivates ALL keys and creates one new key. 
                  Use this if you suspect a key was compromised or want to reset everything.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!newApiKey} onOpenChange={() => setNewApiKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New API Key Generated</DialogTitle>
            <DialogDescription className="flex items-center gap-2 pt-2">
                <ShieldAlert className="h-8 w-8 text-amber-500" />
                Please save this key somewhere secure. You will not be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <CodeBlock code={newApiKey || ""} language="text" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}