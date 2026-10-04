"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useAuthStore } from "@/stores/auth"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type Step = "method" | "email" | "code"
type Busy = null | "google" | "apple" | "email" | "code"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.07H2.18a11 11 0 0 0 0 9.87l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.05 12.9c-.03-2.89 2.36-4.27 2.47-4.34-1.34-1.96-3.43-2.23-4.18-2.26-1.78-.18-3.47 1.05-4.37 1.05-.9 0-2.29-1.02-3.77-1-1.94.03-3.72 1.12-4.72 2.86-2.01 3.49-.51 8.66 1.45 11.49.95 1.37 2.08 2.9 3.56 2.84 1.43-.06 1.97-.91 3.7-.91s2.21.91 3.72.89c1.54-.03 2.52-1.38 3.46-2.75.63-.92 1.11-1.95 1.44-3.03-2.11-.89-3.75-2.87-3.76-5.84ZM14.16 4.06c.78-.95 1.31-2.26 1.17-3.57-1.13.05-2.5.75-3.31 1.69-.73.83-1.36 2.17-1.19 3.45 1.26.1 2.55-.62 3.33-1.57Z" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="3" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  )
}

export function AuthModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [step, setStep] = useState<Step>("method")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [devCode, setDevCode] = useState<string | null>(null)
  const [busy, setBusy] = useState<Busy>(null)
  const setUser = useAuthStore((s) => s.setUser)
  const { toast } = useToast()
  const verifying = useRef(false)

  // Reset all state each time the modal opens.
  useEffect(() => {
    if (open) {
      setStep("method")
      setEmail("")
      setCode("")
      setError(null)
      setDevCode(null)
      setBusy(null)
      verifying.current = false
    }
  }, [open])

  const handleOpenChange = (next: boolean) => {
    if (!next) onClose()
  }

  async function handleSocial(provider: "google" | "apple") {
    setBusy(provider)
    setError(null)
    const label = provider === "google" ? "Google" : "Apple"
    const missing =
      provider === "google" ? "GOOGLE_CLIENT_ID" : "APPLE_CLIENT_ID"
    try {
      const res = await fetch(`/api/auth/${provider}`, { method: "POST" })
      const data = (await res.json().catch(() => null)) as {
        error?: string
      } | null
      if (res.status === 501) {
        toast({
          title: `${label} sign-in unavailable`,
          description:
            data?.error ?? `${label} sign-in requires ${missing} configuration`,
        })
      } else {
        toast({
          title: "Something went wrong",
          description: `${label} sign-in failed. Please try again.`,
        })
      }
    } catch {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
      })
    } finally {
      setBusy(null)
    }
  }

  async function requestCode(targetEmail: string): Promise<boolean> {
    setBusy("email")
    setError(null)
    setDevCode(null)
    try {
      const res = await fetch("/api/auth/email/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      })
      const data = (await res.json().catch(() => null)) as {
        success?: boolean
        error?: string
        devCode?: string
      } | null
      if (res.ok && data?.success) {
        if (data.devCode) setDevCode(String(data.devCode))
        return true
      }
      setError(
        data?.error ?? "Something went wrong while sending the code. Please try again."
      )
      return false
    } catch {
      setError("Network error. Please check your connection and try again.")
      return false
    } finally {
      setBusy(null)
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email) || busy) return
    const ok = await requestCode(email)
    if (ok) {
      setCode("")
      setStep("code")
    }
  }

  const verify = useCallback(
    async (value: string) => {
      verifying.current = true
      setBusy("code")
      setError(null)
      try {
        const res = await fetch("/api/auth/email/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: value }),
        })
        const data = (await res.json().catch(() => null)) as {
          success?: boolean
          user?: { id: string; email: string; name: string | null; credits: number; plan: string }
          isNewUser?: boolean
          error?: string
        } | null
        if (res.ok && data?.success && data.user) {
          setUser(data.user)
          toast({
            title: data.isNewUser ? "Welcome to Pixelcut!" : "Welcome back!",
            description: data.isNewUser
              ? "Your account is ready — you start with free AI credits."
              : `You are signed in as ${data.user.email}.`,
          })
          onSuccess()
        } else {
          setCode("")
          setError(
            res.status === 400
              ? "Invalid or expired code. Please request a new one."
              : data?.error ?? "Verification failed. Please try again."
          )
        }
      } catch {
        setCode("")
        setError("Network error. Please try again.")
      } finally {
        setBusy(null)
        verifying.current = false
      }
    },
    [email, onSuccess, setUser, toast]
  )

  // Auto-submit as soon as all 6 digits are entered.
  useEffect(() => {
    if (step === "code" && code.length === 6 && !verifying.current) {
      void verify(code)
    }
  }, [code, step, verify])

  async function handleResend() {
    const ok = await requestCode(email)
    if (ok) {
      setCode("")
      toast({
        title: "Code resent",
        description: `A new 6-digit code was sent to ${email}.`,
      })
    }
  }

  const socialButton =
    "flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-gray-100 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 rounded-2xl border-gray-100 p-6 sm:max-w-[400px]">
        {step === "method" && (
          <>
            <DialogHeader className="sm:text-center">
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
                Sign Up or Log In
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm leading-relaxed text-gray-500">
                Use your email or another service to continue, signing up is
                free!
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                className={socialButton}
                onClick={() => void handleSocial("google")}
                disabled={busy !== null}
              >
                {busy === "google" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <GoogleIcon className="h-4 w-4" />
                )}
                Continue with Google
              </button>
              <button
                type="button"
                className={socialButton}
                onClick={() => void handleSocial("apple")}
                disabled={busy !== null}
              >
                {busy === "apple" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AppleIcon className="h-4 w-4" />
                )}
                Continue with Apple
              </button>
              <button
                type="button"
                className={socialButton}
                onClick={() => {
                  setError(null)
                  setStep("email")
                }}
                disabled={busy !== null}
              >
                <MailIcon className="h-4 w-4" />
                Continue with email
              </button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                className="text-xs text-gray-500 underline underline-offset-2 transition-colors hover:text-gray-700"
                onClick={() =>
                  toast({
                    title: "Terms of Service",
                    description: "Legal pages are stubbed in this recreation.",
                  })
                }
              >
                Terms of Service
              </button>
              <button
                type="button"
                className="text-xs text-gray-500 underline underline-offset-2 transition-colors hover:text-gray-700"
                onClick={() =>
                  toast({
                    title: "Privacy Policy",
                    description: "Legal pages are stubbed in this recreation.",
                  })
                }
              >
                Privacy Policy
              </button>
            </div>
          </>
        )}

        {step === "email" && (
          <>
            <button
              type="button"
              aria-label="Back"
              onClick={() => {
                setStep("method")
                setError(null)
                setDevCode(null)
              }}
              className="-ml-2 mb-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <DialogHeader className="sm:text-center">
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
                Enter your email
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-gray-500">
                Enter your personal or work email.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
              <Input
                id="auth-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoFocus
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy === "email"}
                aria-invalid={!!error}
                className="h-11 rounded-lg"
              />
              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={!EMAIL_RE.test(email) || busy !== null}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy === "email" && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Continue
              </button>
            </form>
          </>
        )}

        {step === "code" && (
          <>
            <button
              type="button"
              aria-label="Back"
              onClick={() => {
                setStep("email")
                setError(null)
                setDevCode(null)
              }}
              className="-ml-2 mb-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <DialogHeader className="sm:text-center">
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
                Enter your code
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-gray-500">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-gray-700">{email}</span>.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex flex-col items-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                disabled={busy === "code"}
                autoFocus
                aria-label="Verification code"
              >
                <InputOTPGroup className="gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className={cn(
                        "h-12 w-12 rounded-lg border border-gray-200 text-xl font-semibold text-gray-900 shadow-xs",
                        "first:rounded-lg first:border-l last:rounded-lg",
                        "data-[active=true]:border-gray-900 data-[active=true]:ring-gray-900/10"
                      )}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {busy === "code" && (
                <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Verifying code…
                </p>
              )}
              {error && (
                <div role="alert" className="mt-4 text-center">
                  <p className="text-sm text-red-600">{error}</p>
                  <button
                    type="button"
                    onClick={() => void handleResend()}
                    disabled={busy !== null}
                    className="mt-2 text-sm font-medium text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-700 disabled:opacity-50"
                  >
                    Resend code
                  </button>
                </div>
              )}
              {!error && (
                <p className="mt-4 text-sm text-gray-500">
                  Code sent to wrong address?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email")
                      setCode("")
                      setError(null)
                      setDevCode(null)
                    }}
                    className="font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700"
                  >
                    Go back
                  </button>
                </p>
              )}
            </div>
            {devCode && (
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
                Email delivery is not configured — your verification code is:{" "}
                <span className="font-bold tracking-wider">{devCode}</span>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
