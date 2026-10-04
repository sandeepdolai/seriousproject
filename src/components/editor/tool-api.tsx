"use client"

import type { ReactNode } from "react"
import { ToastAction } from "@/components/ui/toast"
import type { ToastActionElement } from "@/components/ui/toast"

export interface ToolSuccess {
  success: true
  imageUrl: string
  width: number
  height: number
  credits?: number
}

export class ToolError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export type ToastFn = (options: {
  title?: string
  description?: ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive"
}) => unknown

/**
 * POST to a /api/tools/* endpoint with long-fetch tolerance and the
 * uniform error contract (400/401/402/500 → ToolError).
 */
export async function callTool(
  endpoint: string,
  body: Record<string, unknown>
): Promise<ToolSuccess> {
  let response: Response
  try {
    response = await fetch(`/api/tools/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch {
    throw new ToolError("Network error — please check your connection.", 0)
  }
  const data = (await response.json().catch(() => ({}))) as
    | { error?: string }
    | ToolSuccess
  if (!response.ok) {
    const message =
      "error" in data && typeof data.error === "string"
        ? data.error
        : "AI processing failed. Please try again."
    throw new ToolError(message, response.status)
  }
  return data as ToolSuccess
}

export interface ToolRunHelpers {
  toast: ToastFn
  navigate: (path: string) => void
  setAuthModalOpen: (open: boolean, onSuccess?: () => void) => void
  setCredits: (credits: number) => void
  onError?: (message: string) => void
}

/**
 * Shared runner that wires a tool call into the app's auth / credit /
 * error UX. Returns true on success, false otherwise (in which case the
 * auth modal / toast / error state have already been surfaced).
 */
export async function runTool(
  endpoint: string,
  body: Record<string, unknown>,
  callbacks: {
    label: string
    onSuccess: (result: ToolSuccess) => void | Promise<void>
    retry?: () => void
  },
  helpers: ToolRunHelpers
): Promise<boolean> {
  try {
    const result = await callTool(endpoint, body)
    if (typeof result.credits === "number") {
      helpers.setCredits(result.credits)
    }
    await callbacks.onSuccess(result)
    return true
  } catch (err) {
    const toolError = err instanceof ToolError ? err : null
    const message =
      err instanceof Error ? err.message : "AI processing failed. Please try again."
    if (toolError?.status === 401) {
      helpers.toast({ title: "Sign in required", description: message })
      helpers.setAuthModalOpen(true, callbacks.retry)
      return false
    }
    if (toolError?.status === 402) {
      helpers.toast({
        title: "You're out of credits",
        description: message,
        action: (
          <ToastAction
            altText="Upgrade for more credits"
            onClick={() => helpers.navigate("/pricing")}
          >
            Upgrade
          </ToastAction>
        ),
      })
      helpers.onError?.(message)
      return false
    }
    helpers.toast({
      title: "Something went wrong",
      description: message,
      action: callbacks.retry ? (
        <ToastAction
          altText="Try again"
          onClick={() => callbacks.retry?.()}
        >
          Try again
        </ToastAction>
      ) : undefined,
    })
    helpers.onError?.(message)
    return false
  }
}
