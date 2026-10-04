"use client"

import { useState } from "react"
import { ArrowUp, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const MODELS = ["Nano Banana", "Flux 2 Pro", "Ideogram 3"]

interface PromptBarProps {
  onSubmit: (prompt: string, model: string) => void
  processing: boolean
  className?: string
}

export function PromptBar({ onSubmit, processing, className }: PromptBarProps) {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState(MODELS[0])

  function submit() {
    const trimmed = prompt.trim()
    if (!trimmed || processing) return
    onSubmit(trimmed, model)
    setPrompt("")
  }

  return (
    <div
      className={cn(
        "rounded-full bg-neutral-900 px-3 md:px-4 py-2 md:py-2.5 flex items-center gap-2 md:gap-3 shadow-2xl",
        className
      )}
      role="form"
      aria-label="AI background prompt bar"
    >
      <span className="hidden sm:inline-flex items-center bg-white text-neutral-900 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap">
        AI Backgrounds
      </span>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            submit()
          }
        }}
        placeholder="Generate a new background…"
        disabled={processing}
        className="flex-1 min-w-0 bg-transparent text-white placeholder:text-neutral-500 text-sm outline-none disabled:opacity-60"
        aria-label="Background prompt"
      />
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        disabled={processing}
        className="hidden md:block bg-transparent border border-neutral-700 text-neutral-300 text-xs rounded-md px-1.5 py-1 outline-none cursor-pointer"
        aria-label="AI model"
      >
        {MODELS.map((name) => (
          <option key={name} value={name} className="text-black">
            {name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={submit}
        disabled={processing || !prompt.trim()}
        aria-label="Generate background"
        className="w-8 h-8 shrink-0 rounded-full bg-white text-black grid place-items-center hover:bg-neutral-200 transition disabled:opacity-40"
      >
        {processing ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowUp className="w-4 h-4" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
