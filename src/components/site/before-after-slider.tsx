"use client"

import { useCallback, useRef, useState } from "react"
import { ChevronsLeftRight } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Draggable before/after comparison slider.
 * - Pointer drag / click anywhere to move the divider.
 * - Keyboard: focus the handle, arrow keys step by 5%.
 */
export function BeforeAfterSlider({
  before,
  after,
  alt,
  className,
}: {
  before: string
  after: string
  alt: string
  className?: string
}) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, pct)))
  }, [])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    containerRef.current?.setPointerCapture(e.pointerId)
    updateFromClientX(e.clientX)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current) updateFromClientX(e.clientX)
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false
    if (containerRef.current?.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault()
      setPos((p) => Math.max(0, p - 5))
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault()
      setPos((p) => Math.min(100, p + 5))
    }
  }

  const rounded = Math.round(pos)

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label={`Before and after comparison for ${alt}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={rounded}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={cn(
        "group relative aspect-[4/3] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20",
        className
      )}
    >
      <img
        src={before}
        alt={`${alt} — before`}
        draggable={false}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        <img
          src={after}
          alt={`${alt} — after`}
          draggable={false}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Divider + handle */}
      <div
        className="absolute inset-y-0 z-10"
        style={{ left: `${pos}%` }}
        aria-hidden="true"
      >
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_4px_rgba(0,0,0,0.35)]" />
        <div className="absolute top-1/2 left-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white opacity-95 shadow-lg transition-transform duration-200 group-hover:scale-110">
          <ChevronsLeftRight className="h-4 w-4 text-gray-700" />
        </div>
      </div>

      <span className="absolute top-3 left-3 z-10 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
        Before
      </span>
      <span className="absolute top-3 right-3 z-10 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
        After
      </span>
    </div>
  )
}
