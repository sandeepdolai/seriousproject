"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  X,
  Zap,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, ROUTES } from "@/lib/router"
import { useAuthStore } from "@/stores/auth"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  path: string
}

const EDIT_ITEMS: NavItem[] = [
  { label: "Background Remover", path: ROUTES.backgroundRemover },
  { label: "Blur Background", path: ROUTES.blurBackground },
  { label: "Image Upscaler", path: ROUTES.imageUpscaler },
  { label: "Photo Enhancer", path: ROUTES.photoEnhancer },
  { label: "Magic Eraser", path: ROUTES.magicEraser },
  { label: "Uncrop", path: ROUTES.uncrop },
  { label: "Generative Fill", path: ROUTES.generativeFill },
  { label: "Colorize Photo", path: ROUTES.colorizePhoto },
  { label: "Photo Restoration", path: ROUTES.photoRestoration },
  { label: "Recolor", path: ROUTES.recolor },
  { label: "Image Resizer", path: ROUTES.resizeImage },
  { label: "Profile Picture Maker", path: ROUTES.profilePictureMaker },
  { label: "All tools", path: ROUTES.tools },
]

const GENERATE_ITEMS: NavItem[] = [
  { label: "AI Images", path: ROUTES.aiImageGenerator },
  { label: "AI Art", path: ROUTES.aiArtGenerator },
  { label: "AI Logos", path: ROUTES.aiLogos },
  { label: "AI Backgrounds", path: ROUTES.aiBackgroundGenerator },
  { label: "AI Ads", path: ROUTES.aiAds },
  { label: "AI Product Photography", path: ROUTES.aiProductPhotography },
  { label: "Virtual Try-On", path: ROUTES.virtualTryOn },
  { label: "AI Videos", path: ROUTES.videoBackgroundRemover },
]

const API_ITEMS: NavItem[] = [
  { label: "Overview", path: ROUTES.pricing },
  { label: "Background Remover API", path: ROUTES.pricing },
  { label: "Image Upscaler API", path: ROUTES.pricing },
  { label: "Generate Background API", path: ROUTES.pricing },
  { label: "Try On API", path: ROUTES.pricing },
  { label: "Looping Video API", path: ROUTES.pricing },
]

/** Desktop nav dropdown — opens on hover AND click, closes on Escape. */
function NavDropdown({ label, items }: { label: string; items: NavItem[] }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { navigate } = useRouter()

  const openNow = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }, [])

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 140)
  }, [])

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    },
    []
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-md py-2 text-sm font-medium text-gray-700 transition-colors hover:text-black"
      >
        {label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-gray-400 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-50 pt-2">
          <div
            role="menu"
            className="w-60 origin-top-left animate-in fade-in-0 zoom-in-95 rounded-xl border border-gray-100 bg-white p-2 shadow-lg duration-150"
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  navigate(item.path)
                }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MobileSection({
  label,
  items,
  onNavigate,
}: {
  label: string
  items: NavItem[]
  onNavigate: (path: string) => void
}) {
  return (
    <div className="py-2">
      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.path)}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Header() {
  const { navigate } = useRouter()
  const { toast } = useToast()
  const user = useAuthStore((s) => s.user)
  const setAuthModalOpen = useAuthStore((s) => s.setAuthModalOpen)
  const logout = useAuthStore((s) => s.logout)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const initial = (user?.name ?? user?.email ?? "?").charAt(0).toUpperCase()

  const handleLogout = async () => {
    await logout()
    toast({
      title: "Signed out",
      description: "You have been logged out of Pixelcut.",
    })
  }

  const mobileNavigate = (path: string) => {
    setMobileOpen(false)
    navigate(path)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={() => navigate(ROUTES.home)}
            aria-label="Pixelcut home"
            className="text-xl font-bold tracking-tight text-black"
          >
            Pixelcut
          </button>
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 md:flex"
          >
            <NavDropdown label="Edit" items={EDIT_ITEMS} />
            <NavDropdown label="Generate" items={GENERATE_ITEMS} />
            <NavDropdown label="API" items={API_ITEMS} />
            <button
              type="button"
              onClick={() => navigate(ROUTES.pricing)}
              className="py-2 text-sm font-medium text-gray-700 transition-colors hover:text-black"
            >
              Pricing
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.generate)}
              className="py-2 text-sm font-medium text-gray-700 transition-colors hover:text-black"
            >
              Download
            </button>
          </nav>
        </div>

        {/* Desktop auth area */}
        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-black"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate(ROUTES.pricing)}
                aria-label={`${user.credits} credits remaining`}
                className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                <Zap
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                {user.credits}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Account menu"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white uppercase transition-opacity hover:opacity-85"
                  >
                    {initial}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl border-gray-100 p-2"
                >
                  <DropdownMenuLabel className="px-3 py-1.5">
                    <span className="block truncate text-sm font-medium text-gray-900">
                      {user.name ?? "Pixelcut user"}
                    </span>
                    <span className="block truncate text-xs font-normal text-gray-400">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="rounded-lg px-3 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-black"
                    onSelect={() => navigate(ROUTES.generate)}
                  >
                    My Projects
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="rounded-lg px-3 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-black"
                    onSelect={() => navigate(ROUTES.pricing)}
                  >
                    <Settings className="size-4" aria-hidden="true" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="rounded-lg px-3 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-black"
                    onSelect={() => void handleLogout()}
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile slide-in drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="mobile-backdrop"
              className="fixed inset-0 z-[60] bg-black/30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="mobile-drawer"
              role="dialog"
              aria-label="Mobile navigation"
              className="fixed inset-y-0 right-0 z-[70] flex w-[85%] max-w-sm flex-col bg-white shadow-xl md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-6">
                <span className="text-xl font-bold tracking-tight text-black">
                  Pixelcut
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav
                aria-label="Mobile menu"
                className="pc-scroll flex-1 overflow-y-auto px-3 py-4"
              >
                <MobileSection
                  label="Edit"
                  items={EDIT_ITEMS}
                  onNavigate={mobileNavigate}
                />
                <MobileSection
                  label="Generate"
                  items={GENERATE_ITEMS}
                  onNavigate={mobileNavigate}
                />
                <MobileSection
                  label="API"
                  items={API_ITEMS}
                  onNavigate={mobileNavigate}
                />
                <div className="space-y-0.5 py-2">
                  <button
                    type="button"
                    onClick={() => mobileNavigate(ROUTES.pricing)}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
                  >
                    Pricing
                  </button>
                  <button
                    type="button"
                    onClick={() => mobileNavigate(ROUTES.generate)}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
                  >
                    Download
                  </button>
                </div>
              </nav>

              <div className="shrink-0 space-y-2.5 border-t border-gray-100 p-4">
                {!user ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false)
                        setAuthModalOpen(true)
                      }}
                      className="h-11 w-full rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                    >
                      Log in
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false)
                        setAuthModalOpen(true)
                      }}
                      className="h-11 w-full rounded-full bg-black text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white uppercase">
                        {initial}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-gray-900">
                          {user.name ?? "Pixelcut user"}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Zap
                            className="h-3 w-3 fill-amber-400 text-amber-400"
                            aria-hidden="true"
                          />
                          {user.credits} credits
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false)
                        void handleLogout()
                      }}
                      className="flex h-11 items-center gap-1.5 rounded-full border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
