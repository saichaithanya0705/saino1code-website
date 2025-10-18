"use client"

import { useState } from "react"
import { regenerateApiKey } from "@/app/dashboard/actions"
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
import { Loader2, ShieldAlert } from "lucide-react"

interface ApiKeyManagerProps {
  apiKeyPrefix: string | null
  initialApiKey?: string | null
}

export function ApiKeyManager({ apiKeyPrefix, initialApiKey = null }: ApiKeyManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [newApiKey, setNewApiKey] = useState<string | null>(initialApiKey)

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
        This is your unique API key for connecting the SaiNo1Code VS Code extension.
      </p>
      <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
        <div className="font-mono text-sm">
          {apiKeyPrefix ? `s1c_...${apiKeyPrefix.slice(-4)}` : "No key generated yet."}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Revoke & Generate New Key
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently revoke your current API key. The VS Code extension will stop working until you update it with the new key.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRegenerate}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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