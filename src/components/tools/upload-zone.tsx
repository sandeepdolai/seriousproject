"use client"

import { useRef, useState } from "react"
import { useRouter } from "@/lib/router"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Progress } from "@/components/ui/progress"
import { Loader2, Info } from "lucide-react"
import type { ToolConfig } from "./tool-configs"
import { cn } from "@/lib/utils"

const MAX_FILE_BYTES = 50 * 1024 * 1024 // 50MB
const MAX_DIM = 6000
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/heic", "image/webp"]
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/x-matroska"]
const VIDEO_EXTS = /\.(mp4|mov|webm|mkv)$/i
const SCALES = [2, 4, 8, 16]

export const UPLOAD_STASH_KEY = "pc_upload"

interface UploadStash {
  dataUrl: string
  name: string
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Could not read file"))
    reader.readAsDataURL(file)
  })
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Could not read file"))
    reader.readAsDataURL(blob)
  })
}

function measureImage(dataUrl: string): Promise<{ w: number; h: number } | null> {
  return new Promise((resolve) => {
    const image = new window.Image()
    image.onload = () =>
      resolve({ w: image.naturalWidth, h: image.naturalHeight })
    image.onerror = () => resolve(null)
    image.src = dataUrl
  })
}

function measureVideo(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement("video")
    const done = (value: number | null) => {
      URL.revokeObjectURL(url)
      resolve(value)
    }
    video.preload = "metadata"
    video.onloadedmetadata = () =>
      done(Number.isFinite(video.duration) ? video.duration : null)
    video.onerror = () => done(null)
    video.src = url
  })
}

export function UploadZone({ config }: { config: ToolConfig }) {
  const { navigate } = useRouter()
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scale, setScale] = useState(2)
  const [presetIndex, setPresetIndex] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [sampleLoading, setSampleLoading] = useState<string | null>(null)
  const [videoProgress, setVideoProgress] = useState<number | null>(null)
  const [videoNotice, setVideoNotice] = useState(false)

  const isVideoTool = config.accepts === "video"
  const isGenerator = config.editorTool === "generate"
  const acceptAttr = isVideoTool
    ? [...VIDEO_TYPES, ".mp4", ".mov", ".webm", ".mkv"].join(",")
    : [...IMAGE_TYPES, "image/*"].join(",")

  function stashAndGo(dataUrl: string, name: string) {
    const stash: UploadStash = { dataUrl, name }
    try {
      sessionStorage.setItem(UPLOAD_STASH_KEY, JSON.stringify(stash))
    } catch {
      // Storage may exceed quota with very large images — the editor
      // still works via its own file picker if this fails.
    }
    if (isGenerator) {
      navigate("/generate")
      return
    }
    const query: Record<string, string> = {
      tool: config.editorTool,
      name,
      from: config.slug.replace(/^\//, ""),
    }
    if (config.scaleOptions) query.scale = String(scale)
    if (config.scenePresets && presetIndex !== null) {
      query.preset = String(presetIndex)
    }
    navigate("/editor", query)
  }

  async function validateImage(file: File, dataUrl: string): Promise<string | null> {
    if (file.size > MAX_FILE_BYTES) {
      return "File is too large. Images must be under 50MB."
    }
    const typeOk =
      IMAGE_TYPES.includes(file.type) ||
      file.type.startsWith("image/") ||
      /\.(jpe?g|png|heic|heif|webp)$/i.test(file.name)
    if (!typeOk) {
      return "Unsupported file type. Please upload a JPG, PNG, or HEIC image."
    }
    // HEIC can't be decoded by most browsers — skip the dimension check.
    if (file.type === "image/heic" || /\.hei[cf]$/i.test(file.name)) return null
    const dims = await measureImage(dataUrl)
    if (dims && (dims.w > MAX_DIM || dims.h > MAX_DIM)) {
      return `Image is too large. Maximum size is ${MAX_DIM} × ${MAX_DIM}px.`
    }
    return null
  }

  async function validateVideo(file: File): Promise<string | null> {
    if (file.size > MAX_FILE_BYTES) {
      return "File is too large. Videos must be under 50MB."
    }
    const typeOk =
      VIDEO_TYPES.includes(file.type) || VIDEO_EXTS.test(file.name)
    if (!typeOk) {
      return "Unsupported file type. Please upload an MP4, MOV, WebM, or MKV video."
    }
    const duration = await measureVideo(file)
    if (duration !== null && duration > 61) {
      return "Video is too long. Maximum length is 60 seconds."
    }
    return null
  }

  function simulateVideoProcessing() {
    setVideoNotice(false)
    setVideoProgress(0)
    const startedAt = Date.now()
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      const pct = Math.min(100, Math.round((elapsed / 4000) * 100))
      setVideoProgress(pct)
      if (pct >= 100) {
        window.clearInterval(timer)
        window.setTimeout(() => {
          setVideoProgress(null)
          setVideoNotice(true)
          toast({
            title: "Video processing not yet available",
            description:
              "Video background removal requires a video processing API (external dependency).",
            action: (
              <ToastAction
                altText="Try image background removal"
                onClick={() => navigate("/background-remover")}
              >
                Use images
              </ToastAction>
            ),
          })
        }, 350)
      }
    }, 120)
  }

  async function handleFile(file: File | undefined | null) {
    if (!file) return
    setError(null)
    setBusy(true)
    try {
      if (isVideoTool) {
        const problem = await validateVideo(file)
        if (problem) {
          setError(problem)
          toast({ title: "Upload error", description: problem, variant: "destructive" })
          return
        }
        simulateVideoProcessing()
        return
      }
      if (file.type.startsWith("video/")) {
        const problem = "That looks like a video. Please upload a JPG, PNG, or HEIC image."
        setError(problem)
        toast({ title: "Upload error", description: problem, variant: "destructive" })
        return
      }
      const dataUrl = await readFileAsDataUrl(file)
      const problem = await validateImage(file, dataUrl)
      if (problem) {
        setError(problem)
        toast({ title: "Upload error", description: problem, variant: "destructive" })
        return
      }
      stashAndGo(dataUrl, file.name)
    } catch {
      const message = "Something went wrong reading your file. Please try again."
      setError(message)
      toast({ title: "Upload error", description: message, variant: "destructive" })
    } finally {
      setBusy(false)
    }
  }

  async function handleSample(path: string) {
    setError(null)
    setSampleLoading(path)
    try {
      const res = await fetch(path)
      if (!res.ok) throw new Error("fetch failed")
      const blob = await res.blob()
      const dataUrl = await readBlobAsDataUrl(blob)
      const name = path.split("/").pop() || "sample.png"
      stashAndGo(dataUrl, name)
    } catch {
      toast({
        title: "Couldn't load that sample",
        description: "Please try uploading your own image instead.",
        variant: "destructive",
      })
    } finally {
      setSampleLoading(null)
    }
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragOver(false)
    const file = event.dataTransfer.files?.[0]
    if (file) void handleFile(file)
  }

  const showSamples = config.accepts === "image" && config.samples.length > 0

  return (
    <div className="w-full" id="upload">
      {config.scaleOptions && (
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-gray-500 mr-1">Upscale factor</span>
          {SCALES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScale(s)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium border transition",
                scale === s
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
              )}
              aria-pressed={scale === s}
            >
              {s}x
            </button>
          ))}
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload drop zone"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "border-2 rounded-3xl p-10 md:p-16 text-center cursor-pointer bg-gray-50/50 transition outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
          dragOver
            ? "border-blue-500 bg-blue-50/50"
            : "border-dashed border-gray-300 hover:border-gray-400"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptAttr}
          onChange={(e) => {
            const file = e.target.files?.[0]
            void handleFile(file)
            e.target.value = ""
          }}
          aria-hidden="true"
        />

        <button
          type="button"
          disabled={busy || videoProgress !== null}
          onClick={(e) => {
            e.stopPropagation()
            inputRef.current?.click()
          }}
          className="h-11 px-8 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition inline-flex items-center gap-2 disabled:opacity-60"
        >
          {(busy || videoProgress !== null) && (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          )}
          {isVideoTool
            ? "Upload video"
            : config.ctaLabel
              ? config.ctaLabel
              : "Upload image"}
        </button>

        <p className="text-gray-500 text-sm mt-3">
          {isVideoTool ? "or drop videos here" : "or drop photos here"}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {isVideoTool
            ? "Supports MP4, MOV, WebM, and MKV. Up to 50MB and 60 seconds"
            : "Supports JPG, PNG, and HEIC. Up to 50MB and 6000 × 6000px"}
        </p>

        {videoProgress !== null && (
          <div className="max-w-xs mx-auto mt-6">
            <Progress value={videoProgress} className="h-1.5" />
            <p className="text-xs text-gray-500 mt-2">
              Processing video… {videoProgress}%
            </p>
          </div>
        )}

        {videoNotice && (
          <div
            className="mt-6 max-w-md mx-auto flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left"
            role="status"
          >
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" aria-hidden="true" />
            <div className="text-sm text-amber-800">
              Video background removal requires a video processing API (external
              dependency). Try the{" "}
              <button
                type="button"
                className="underline font-medium"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate("/background-remover")
                }}
              >
                image Background Remover
              </button>{" "}
              in the meantime.
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 mt-4" role="alert">
            {error}
          </p>
        )}

        <p className="text-xs text-gray-400 mt-4">
          By uploading an image you agree to our{" "}
          <button
            type="button"
            className="underline hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation()
              toast({
                title: "Terms of Service",
                description:
                  "Legal pages are stubbed in this build — see pixelcut.ai/terms on the live site.",
              })
            }}
          >
            Terms
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="underline hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation()
              toast({
                title: "Privacy Policy",
                description:
                  "Legal pages are stubbed in this build — see pixelcut.ai/privacy on the live site.",
              })
            }}
          >
            Privacy Policy
          </button>
        </p>
      </div>

      {config.scenePresets && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-gray-500 mr-1">Scene</span>
          {config.scenePresets.map((preset, index) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setPresetIndex(presetIndex === index ? null : index)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium border transition",
                presetIndex === index
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
              )}
              aria-pressed={presetIndex === index}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {showSamples && (
        <div className="mt-6">
          <p className="text-sm text-gray-500 text-center">
            Don&apos;t have a photo? Try one of these
          </p>
          <div className="mt-3 flex items-center justify-center gap-4">
            {config.samples.slice(0, 3).map((path) => (
              <button
                key={path}
                type="button"
                onClick={() => void handleSample(path)}
                disabled={sampleLoading !== null}
                className="group relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border border-gray-200 transition hover:scale-105 hover:shadow-md disabled:opacity-60"
                aria-label={`Try sample ${path.split("/").pop()}`}
              >
                { }
                <img
                  src={path}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {sampleLoading === path && (
                  <span className="absolute inset-0 grid place-items-center bg-white/70">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-600" aria-hidden="true" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
