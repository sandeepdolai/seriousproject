"use client"

import { create } from "zustand"

export interface User {
  id: string
  email: string
  name: string | null
  credits: number
  plan: string
}

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  authModalOpen: boolean
  authModalSuccess?: () => void
  setAuthModalOpen: (open: boolean, onSuccess?: () => void) => void
  fetchMe: () => Promise<void>
  setUser: (user: User | null) => void
  logout: () => Promise<void>
  setCredits: (credits: number) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  authModalOpen: false,
  setAuthModalOpen: (open, onSuccess) =>
    set({ authModalOpen: open, authModalSuccess: onSuccess }),
  fetchMe: async () => {
    if (get().loading) return
    set({ loading: true })
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        set({ user: data.user, initialized: true })
      } else {
        set({ user: null, initialized: true })
      }
    } catch {
      set({ user: null, initialized: true })
    } finally {
      set({ loading: false })
    }
  },
  setUser: (user) => set({ user }),
  setCredits: (credits) => {
    const user = get().user
    if (user) set({ user: { ...user, credits } })
  },
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {
      // ignore network errors on logout
    }
    set({ user: null })
  },
}))
