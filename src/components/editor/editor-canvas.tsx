"use client"

import { useRef, useState } from "react"
import { FileUp, Loader2 } from "lucide-react"
import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

/** 20px checkerboard used behind the canvas image = transparency. */
const CHECKER_CANVAS: CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
  backgroundColor: "white",
}

export interface CanvasError {
  message: string
  retry?: () => void
}

interface EditorCanvasProps {
  current: string | null
  original: string | null
  compare: boolean
  processing: string | null
  error: CanvasError | null
  zoom: number
  samples: string[]
  onPickFile: (file: File) => void
  onSample: (path: string) => void
  onDismissError: () => void
}

export function EditorCanvas(props: EditorCanvasProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const displayed =
    props.compare && props.original ? props.original : props.current

  return (
    <div
      className="relative flex-1 overflow-auto bg-neutral-100"
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files?.[0]
        if (file) props.onPickFile(file)
      }}
      role="img"
      aria-label={
        displayed ? "Working image canvas" : "Empty canvas — upload an image"
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/webp,image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) props.onPickFile(file)
          e.target.value = ""
        }}
        aria-hidden="true"
      />

      <div className="min-h-full w-full flex items-center justify-center p-4 md:p-10">
        {displayed ? (
          <div
            className="inline-block rounded-lg shadow-xl max-w-full"
            style={{ ...CHECKER_CANVAS, zoom: props.zoom / 100 }}
          >
            { }
            <img
              src={displayed}
              alt={props.compare ? "Original image" : "Edited image"}
              className="block max-h-[70vh] max-w-full object-contain rounded-lg"
              draggable={false}
            />
          </div>
        ) : (
          <div
            className={cn(
              "border-2 border-dashed rounded-3xl p-8 md:p-12 text-center bg-white/60 max-w-md w-full transition",
              dragOver ? "border-blue-500 bg-blue-50/50" : "border-gray-300"
            )}
          >
            <p className="text-lg font-medium text-neutral-900">
              Start with a photo
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Choose a file or drop one here
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-5 h-11 px-8 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition inline-flex items-center gap-2"
            >
              <FileUp className="w-4 h-4" aria-hidden="true" />
              Choose Files
            </button>
            <div className="mt-8">
              <p className="text-xs text-gray-400">
                or try one of these samples
              </p>
              <div className="flex gap-3 justify-center mt-3">
                {props.samples.map((path) => (
                  <button
                    key={path}
                    type="button"
                    onClick={() => props.onSample(path)}
                    className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 hover:scale-105 transition"
                    aria-label={`Use sample ${path.split("/").pop()}`}
                  >
                    { }
                    <img
                      src={path}
                      alt=""
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Processing overlay */}
      {props.processing && (
        <div
          className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[2px] grid place-items-center"
          role="status"
          aria-live="polite"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-8 py-6 flex flex-col items-center gap-3 max-w-xs mx-4 text-center">
            <Loader2
              className="w-8 h-8 animate-spin text-neutral-900"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-neutral-900">
              {props.processing}
            </p>
            <p className="text-xs text-gray-500">
              This usually takes 10–30 seconds
            </p>
            <div className="w-40 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full w-1/2 bg-neutral-800 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Error card */}
      {props.error && !props.processing && (
        <div className="absolute inset-0 z-10 bg-white/60 grid place-items-center">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 px-8 py-6 max-w-sm text-center mx-4">
            <p className="text-sm font-medium text-red-600">
              Something went wrong
            </p>
            <p className="text-sm text-gray-600 mt-1">{props.error.message}</p>
            <div className="mt-4 flex gap-2 justify-center">
              {props.error.retry && (
                <button
                  type="button"
                  onClick={props.error.retry}
                  className="h-9 px-5 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition"
                >
                  Try again
                </button>
              )}
              <button
                type="button"
                onClick={props.onDismissError}
                className="h-9 px-5 rounded-full border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-50 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
