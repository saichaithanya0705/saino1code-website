"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setHasCopied(true)
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  return (
    <div className="relative">
      <pre className={cn("p-4 rounded-lg border bg-slate-900 text-white overflow-x-auto", `language-${language}`)}>
        <code>{code.trim()}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 text-white hover:bg-slate-700 hover:text-white"
        onClick={copyToClipboard}
      >
        {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="sr-only">Copy code</span>
      </Button>
    </div>
  )
}