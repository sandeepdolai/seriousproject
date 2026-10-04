"use client"

import { Globe } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, ROUTES } from "@/lib/router"
import { useToast } from "@/hooks/use-toast"

const TOOLS_LINKS: { label: string; path: string }[] = [
  { label: "Image Upscaler", path: ROUTES.imageUpscaler },
  { label: "Background Remover", path: ROUTES.backgroundRemover },
  { label: "Video Background Remover", path: ROUTES.videoBackgroundRemover },
  { label: "Change Background", path: ROUTES.backgroundRemover },
  { label: "Magic Eraser", path: ROUTES.magicEraser },
  { label: "AI Image Generator", path: ROUTES.aiImageGenerator },
  { label: "AI Video Generator", path: ROUTES.videoBackgroundRemover },
  { label: "Generative Fill", path: ROUTES.generativeFill },
  { label: "Uncrop", path: ROUTES.uncrop },
  { label: "AI Ads", path: ROUTES.aiAds },
  { label: "AI Product Photography", path: ROUTES.aiProductPhotography },
  { label: "Bulk Image Editor", path: ROUTES.magicEraser },
]

const PRODUCTS_LINKS = [
  "Pixelcut for Claude",
  "iOS",
  "Android",
  "API",
].map((label) => ({ label, path: ROUTES.pricing }))

const LANGUAGES = ["English", "Español", "Français", "Deutsch", "日本語"]

function GoogleGIcon({ className }: { className?: string }) {
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

export function Footer() {
  const { navigate } = useRouter()
  const { toast } = useToast()

  const socialLink = (label: string) => {
    toast({
      title: `${label}`,
      description: "Social links are stubbed in this recreation.",
    })
  }

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <nav aria-label="Tools">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Tools</h3>
            <ul>
              {TOOLS_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => navigate(link.path)}
                    className="block py-1 text-left text-sm text-gray-500 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Products">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Products
            </h3>
            <ul>
              {PRODUCTS_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => navigate(link.path)}
                    className="block py-1 text-left text-sm text-gray-500 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Resources
            </h3>
            <ul>
              {[
                "About",
                "Affiliate",
                "Careers",
                "Blog",
                "API Docs",
                "Brand",
                "Terms",
                "API Terms",
                "Privacy",
                "What's New",
                "Sitemap",
                "llms.txt",
              ].map((label) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.pricing)}
                    className="block py-1 text-left text-sm text-gray-500 transition-colors hover:text-gray-900"
                  >
                    {label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() =>
                    toast({
                      title: "Cookie preferences",
                      description:
                        "Cookie settings are stubbed in this recreation.",
                    })
                  }
                  className="block py-1 text-left text-sm text-gray-500 transition-colors hover:text-gray-900"
                >
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </nav>

          <nav aria-label="Keep in touch">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Keep in touch
            </h3>
            <ul>
              {["Instagram", "X", "Contact Us"].map((label) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => socialLink(label)}
                    className="block py-1 text-left text-sm text-gray-500 transition-colors hover:text-gray-900"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 md:flex-row">
          <p className="text-xs text-gray-400">
            © 2026 Pixelcut. All rights reserved.
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
                aria-label="Select language"
              >
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                English
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-40 rounded-xl border-gray-100 p-1"
            >
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  className="rounded-lg px-3 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:text-black"
                  onSelect={() =>
                    toast({
                      title: "Language switching coming soon",
                      description: `${lang} is not available yet.`,
                    })
                  }
                >
                  {lang}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={() =>
              toast({
                title: "Google preferred source",
                description: "This badge is a stub in this recreation.",
              })
            }
            className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-500"
          >
            <GoogleGIcon className="h-3.5 w-3.5" />
            Add Pixelcut as a preferred source on Google
          </button>
        </div>
      </div>
    </footer>
  )
}
