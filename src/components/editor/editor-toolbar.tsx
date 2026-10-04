"use client"

import {
  ArrowLeft,
  ChevronDown,
  Crown,
  Download,
  Eye,
  Redo2,
  ThumbsDown,
  ThumbsUp,
  Undo2,
} from "lucide-react"
import { useRouter } from "@/lib/router"
import { useAuthStore } from "@/stores/auth"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type Rating = "up" | "down" | null

interface EditorToolbarProps {
  from: string
  dims: { w: number; h: number }
  hasResult: boolean
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  compare: boolean
  onToggleCompare: () => void
  rating: Rating
  onRate: (rating: "up" | "down") => void
  onDownloadPreview: () => void
  onDownloadFull: () => void
}

export function EditorToolbar(props: EditorToolbarProps) {
  const { navigate } = useRouter()
  const { toast } = useToast()
  const user = useAuthStore((state) => state.user)

  const previewW = Math.max(1, Math.round(props.dims.w * 0.75))
  const previewH = Math.max(1, Math.round(props.dims.h * 0.75))

  const iconBtn =
    "w-9 h-9 grid place-items-center rounded-lg text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:pointer-events-none"

  return (
    <header className="h-14 shrink-0 bg-white border-b border-gray-200 flex items-center gap-1.5 md:gap-2 px-2 md:px-4">
      <button
        type="button"
        className={iconBtn}
        aria-label="Back"
        onClick={() => navigate(props.from ? `/${props.from}` : "/background-remover")}
      >
        <ArrowLeft className="w-4.5 h-4.5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => navigate("/pricing")}
        className="h-8 px-4 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition inline-flex items-center gap-1.5"
      >
        <Crown className="w-3.5 h-3.5" aria-hidden="true" />
        Get Pro
      </button>

      <div className="flex-1" />

      {/* Rate this result */}
      <div className="hidden md:flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1">
        <span className="text-xs text-gray-500 mr-1 hidden lg:inline">
          Rate this result
        </span>
        <button
          type="button"
          aria-label="Thumbs up"
          onClick={() => props.onRate("up")}
          className={cn(
            "w-7 h-7 grid place-items-center rounded-full hover:bg-gray-100 transition",
            props.rating === "up" ? "text-green-600" : "text-gray-500"
          )}
        >
          <ThumbsUp className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Thumbs down"
          onClick={() => props.onRate("down")}
          className={cn(
            "w-7 h-7 grid place-items-center rounded-full hover:bg-gray-100 transition",
            props.rating === "down" ? "text-red-500" : "text-gray-500"
          )}
        >
          <ThumbsDown className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Undo / Redo */}
      <button
        type="button"
        className={iconBtn}
        aria-label="Undo"
        disabled={!props.canUndo}
        onClick={props.onUndo}
      >
        <Undo2 className="w-4.5 h-4.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        className={iconBtn}
        aria-label="Redo"
        disabled={!props.canRedo}
        onClick={props.onRedo}
      >
        <Redo2 className="w-4.5 h-4.5" aria-hidden="true" />
      </button>

      {/* Compare */}
      <button
        type="button"
        onClick={props.onToggleCompare}
        aria-pressed={props.compare}
        className={cn(
          "hidden lg:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition",
          props.compare && "bg-gray-100 text-black font-medium"
        )}
      >
        <Eye className="w-4 h-4" aria-hidden="true" />
        Compare original and result
      </button>

      {/* Download */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={!props.hasResult}
            className="h-9 px-4 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition inline-flex items-center gap-1.5 disabled:opacity-40"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Download</span>
            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Download image</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              props.onDownloadPreview()
            }}
            className="justify-between cursor-pointer"
          >
            <span>Preview resolution</span>
            <span className="text-xs text-gray-500">
              {previewW}×{previewH} · Free
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              props.onDownloadFull()
            }}
            className="justify-between cursor-pointer"
          >
            <span>Full resolution</span>
            <span className="text-xs text-gray-500">
              {props.dims.w || "—"}×{props.dims.h || "—"} ·{" "}
              {user ? "Free" : "Free with sign in"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled
            className="text-xs text-gray-400 justify-center"
          >
            JPG, PNG up to 16K
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Open Designer */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            Designer
            <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              toast({
                title: "Designer coming soon",
                description:
                  "The Pixelcut Designer is a separate app — stubbed in this build.",
              })
            }}
            className="cursor-pointer"
          >
            Open in Designer
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              toast({
                title: "Designer coming soon",
                description:
                  "The Pixelcut Designer is a separate app — stubbed in this build.",
              })
            }}
            className="cursor-pointer"
          >
            Duplicate to Designer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
