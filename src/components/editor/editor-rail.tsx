"use client"

import {
  Layers,
  Maximize2,
  Sparkles,
  Wand2,
  ZoomIn,
  Droplets,
  Palette,
  History,
  Shirt,
  Frame,
  ScanFace,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type PanelId =
  | "background"
  | "retouch"
  | "expand"
  | "upscale"
  | "enhance"
  | "blur"
  | "colorize"
  | "restore"
  | "recolor"
  | "resize"
  | "tryon"
  | "profile"

export const RAIL_TOOLS: { id: PanelId; label: string; icon: typeof Layers }[] = [
  { id: "background", label: "Background", icon: Layers },
  { id: "retouch", label: "Retouch", icon: Wand2 },
  { id: "expand", label: "Expand", icon: Maximize2 },
  { id: "upscale", label: "Upscale", icon: ZoomIn },
  { id: "enhance", label: "Enhance", icon: Sparkles },
  { id: "blur", label: "Blur", icon: Droplets },
  { id: "colorize", label: "Colorize", icon: Palette },
  { id: "restore", label: "Restore", icon: History },
  { id: "recolor", label: "Recolor", icon: Shirt },
  { id: "resize", label: "Resize", icon: Frame },
  { id: "tryon", label: "Try On", icon: Shirt },
  { id: "profile", label: "Profile", icon: ScanFace },
]

interface EditorRailProps {
  active: PanelId
  onSelect: (panel: PanelId) => void
  variant: "vertical" | "horizontal"
}

export function EditorRail({ active, onSelect, variant }: EditorRailProps) {
  if (variant === "horizontal") {
    // Horizontal (mobile) rail: scrollable, first 8 tools + scroll for rest
    return (
      <nav
        aria-label="Editor tools"
        className="flex items-center justify-start md:justify-around gap-1 w-full overflow-x-auto pc-no-scrollbar"
      >
        {RAIL_TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onSelect(tool.id)}
              aria-pressed={active === tool.id}
              className={cn(
                "min-w-[64px] py-1.5 rounded-xl flex flex-col items-center gap-0.5 text-[11px] transition shrink-0",
                active === tool.id
                  ? "bg-gray-100 font-medium text-black"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              {tool.label}
            </button>
          )
        })}
      </nav>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex flex-col gap-0.5 overflow-y-auto max-h-full">
      {RAIL_TOOLS.map((tool) => {
        const Icon = tool.icon
        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => onSelect(tool.id)}
            aria-pressed={active === tool.id}
            className={cn(
              "w-16 py-1.5 rounded-xl flex flex-col items-center gap-0.5 text-[11px] transition",
              active === tool.id
                ? "bg-gray-100 font-medium text-black"
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            {tool.label}
          </button>
        )
      })}
    </div>
  )
}
