"use client"

import { Layers, Maximize2, Sparkles, Wand2, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"

export type PanelId = "background" | "retouch" | "expand" | "upscale" | "enhance"

export const RAIL_TOOLS: { id: PanelId; label: string; icon: typeof Layers }[] = [
  { id: "background", label: "Background", icon: Layers },
  { id: "retouch", label: "Retouch", icon: Wand2 },
  { id: "expand", label: "Expand", icon: Maximize2 },
  { id: "upscale", label: "Upscale", icon: ZoomIn },
  { id: "enhance", label: "Enhance", icon: Sparkles },
]

interface EditorRailProps {
  active: PanelId
  onSelect: (panel: PanelId) => void
  variant: "vertical" | "horizontal"
}

export function EditorRail({ active, onSelect, variant }: EditorRailProps) {
  if (variant === "horizontal") {
    return (
      <nav
        aria-label="Editor tools"
        className="flex items-center justify-around gap-1 w-full"
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
                "flex-1 py-1.5 rounded-xl flex flex-col items-center gap-0.5 text-[11px] transition",
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex flex-col gap-1">
      {RAIL_TOOLS.map((tool) => {
        const Icon = tool.icon
        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => onSelect(tool.id)}
            aria-pressed={active === tool.id}
            className={cn(
              "w-16 py-2 rounded-xl flex flex-col items-center gap-1 text-xs transition",
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
