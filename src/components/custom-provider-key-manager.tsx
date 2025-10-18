"use client"

import { useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { addCustomProviderKey, deleteCustomProviderKey } from "@/app/dashboard/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Trash2 } from "lucide-react"

const supportedProviders = ["OpenAI", "Groq", "Anthropic", "OpenRouter"]

interface CustomProviderKeyManagerProps {
  savedProviders: { provider_name: string }[]
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Key
        </Button>
    )
}

export function CustomProviderKeyManager({ savedProviders }: CustomProviderKeyManagerProps) {
  const [selectedProvider, setSelectedProvider] = useState(supportedProviders[0])

  // This hook is not used for form state management here, but is a good pattern for handling form responses
  const [formState, formAction] = useFormState(async (prevState: any, formData: FormData) => {
    const providerName = formData.get('providerName') as string
    const apiKey = formData.get('apiKey') as string
    if (!providerName || !apiKey) return { message: "Provider and API Key are required." }

    try {
        await addCustomProviderKey(providerName, apiKey)
        // Reset input field on success if possible (requires more complex state management)
        return { message: "API Key saved successfully." }
    } catch (error: any) {
        return { message: error.message }
    }
  }, { message: "" })

  const handleRevoke = async (providerName: string) => {
      if (confirm(`Are you sure you want to revoke the key for ${providerName}?`)) {
          try {
              await deleteCustomProviderKey(providerName);
          } catch (error: any) {
              alert(error.message);
          }
      }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Custom Model Providers</h2>
      <p className="text-muted-foreground mt-2 mb-4">
        Add your own API keys from third-party services to use your own models within the extension.
      </p>

      <form action={formAction} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <Label htmlFor="provider-select">Provider</Label>
                 <Select name="providerName" value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger id="provider-select">
                        <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent>
                        {supportedProviders.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="md:col-span-2">
                <Label htmlFor="api-key-input">API Key</Label>
                <Input id="api-key-input" name="apiKey" type="password" placeholder="sk-..." required />
            </div>
        </div>
        <SubmitButton />
        {formState?.message && <p className="text-sm text-muted-foreground">{formState.message}</p>}
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-medium">Saved Keys</h3>
        <div className="mt-2 space-y-2">
            {savedProviders.length > 0 ? savedProviders.map(p => (
                <div key={p.provider_name} className="flex items-center justify-between p-3 border rounded-md">
                    <span className="font-semibold">{p.provider_name}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleRevoke(p.provider_name)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Revoke</span>
                    </Button>
                </div>
            )) : (
                <p className="text-sm text-muted-foreground">You haven't added any custom provider keys yet.</p>
            )}
        </div>
      </div>
    </div>
  )
}