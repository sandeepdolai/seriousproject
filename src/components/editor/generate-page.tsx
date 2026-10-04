"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  Copy,
  Download,
  Loader2,
  Maximize2,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react"
import { useRouter } from "@/lib/router"
import { useAuthStore } from "@/stores/auth"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { downloadImage } from "./image-utils"
import { runTool } from "./tool-api"
import type { ToolRunHelpers } from "./tool-api"
import { cn } from "@/lib/utils"

const MODELS = ["Nano Banana", "Flux 2 Pro", "Ideogram 3", "Seedream 4"]
const SIZES = [
  { label: "1:1", value: "1:1" },
  { label: "9:16", value: "9:16" },
  { label: "16:9", value: "16:9" },
]

interface LoadingTile {
  kind: "loading"
  id: string
  prompt: string
}

interface FailedTile {
  kind: "failed"
  id: string
  prompt: string
  message: string
}

interface ImageTile {
  kind: "image"
  id: string
  url: string
  prompt: string
  createdAt: number
  projectId?: number
}

type Tile = LoadingTile | FailedTile | ImageTile

interface ProjectRow {
  id: number
  tool: string
  title: string
  prompt: string | null
  resultImage: string
  createdAt: string
}

function timeAgo(input: number | string): string {
  const date = typeof input === "number" ? input : new Date(input).getTime()
  if (!Number.isFinite(date)) return ""
  const seconds = Math.floor((Date.now() - date) / 1000)
  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

export function GeneratePage() {
  const { route, navigate } = useRouter()
  const { toast } = useToast()
  const { user, setAuthModalOpen, setCredits } = useAuthStore()

  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState(MODELS[0])
  const [size, setSize] = useState("1:1")
  const [count, setCount] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [lightbox, setLightbox] = useState<ImageTile | null>(null)

  const helpers = useMemo<ToolRunHelpers>(
    () => ({
      toast,
      navigate,
      setAuthModalOpen,
      setCredits,
    }),
    [toast, navigate, setAuthModalOpen, setCredits]
  )

  // Prefill from ?prompt= handoff (e.g. the AI Image Generator landing page).
  useEffect(() => {
    const handed = route.query.get("prompt")
    if (handed) setPrompt(handed)
     
  }, [])

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects", { cache: "no-store" })
      if (!res.ok) return
      const data = (await res.json()) as { projects?: ProjectRow[] }
      const generateProjects = (data.projects ?? []).filter(
        (project) => project.tool === "generate"
      )
      setProjects(generateProjects)
    } catch {
      // history is best-effort
    }
  }, [])

  useEffect(() => {
    if (user?.id) void loadProjects()
  }, [user?.id, loadProjects])

  const projectTiles: ImageTile[] = useMemo(
    () =>
      projects.map((project) => ({
        kind: "image" as const,
        id: `p-${project.id}`,
        url: project.resultImage,
        prompt: project.prompt || project.title,
        createdAt: new Date(project.createdAt).getTime(),
        projectId: project.id,
      })),
    [projects]
  )

  async function generateTile(tile: Tile) {
    setGenerating(true)
    const ok = await runTool(
      "generate",
      { prompt: tile.prompt, size, model },
      {
        label: "Generating image…",
        onSuccess: (result) => {
          setTiles((prev) =>
            prev.map((t) =>
              t.id === tile.id
                ? {
                    kind: "image",
                    id: t.id,
                    url: result.imageUrl,
                    prompt: tile.prompt,
                    createdAt: Date.now(),
                  }
                : t
            )
          )
          if (user) void loadProjects()
        },
        retry: () => {
          setTiles((prev) =>
            prev.map((t) =>
              t.id === tile.id
                ? { kind: "loading", id: t.id, prompt: tile.prompt }
                : t
            )
          )
          void generateTile(tile)
        },
      },
      helpers
    )
    if (!ok) {
      // Keep the tile visible as a failed state with a retry button.
      setTiles((prev) =>
        prev.map((t) =>
          t.id === tile.id && t.kind === "loading"
            ? {
                kind: "failed",
                id: t.id,
                prompt: t.prompt,
                message: "Generation failed. Check the prompt and try again.",
              }
            : t
        )
      )
    }
    setGenerating(false)
    return ok
  }

  async function generate() {
    const trimmed = prompt.trim()
    if (!trimmed || generating) return
    const batch: Tile[] = Array.from({ length: count }, (_, index) => ({
      kind: "loading" as const,
      id: `t-${Date.now()}-${index}`,
      prompt: trimmed,
    }))
    setTiles((prev) => [...batch, ...prev])
    for (const tile of batch) {
      const ok = await generateTile(tile)
      if (!ok) break
    }
  }

  async function copyPrompt(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: "Prompt copied" })
    } catch {
      toast({
        title: "Couldn't copy",
        description: "Your browser blocked clipboard access.",
        variant: "destructive",
      })
    }
  }

  async function downloadTile(tile: ImageTile) {
    try {
      await downloadImage(tile.url, `pixelcut-${tile.id}.png`, 1)
      toast({ title: "Image downloaded" })
    } catch {
      toast({
        title: "Download failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  async function deleteTile(tile: ImageTile) {
    if (!tile.projectId) return
    try {
      const res = await fetch(`/api/projects/${tile.projectId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("delete failed")
      setTiles((prev) => prev.filter((t) => t.id !== tile.id))
      setProjects((prev) => prev.filter((p) => p.id !== tile.projectId))
      toast({ title: "Image deleted" })
    } catch {
      toast({
        title: "Couldn't delete",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const hasContent = tiles.length > 0 || projectTiles.length > 0

  // Session tiles are deduped against persisted projects (the project refetch
  // after a generation picks up the same image with delete/persist support).
  const sessionTiles: Tile[] = useMemo(
    () =>
      tiles.filter(
        (tile) =>
          tile.kind !== "image" ||
          !projectTiles.some((project) => project.url === tile.url)
      ),
    [tiles, projectTiles]
  )

  const composer = (
    <div className="rounded-2xl bg-neutral-900 p-4 shadow-xl">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={2}
        placeholder="Describe the image you want to create… be detailed for best results"
        className="w-full bg-transparent text-white placeholder:text-neutral-500 text-sm md:text-base resize-none outline-none"
        aria-label="Image prompt"
      />
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {MODELS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setModel(name)}
            aria-pressed={model === name}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition",
              model === name
                ? "bg-white text-neutral-900"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            )}
          >
            {name}
          </button>
        ))}
        <span className="w-px h-4 bg-neutral-700 mx-1" aria-hidden="true" />
        {SIZES.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSize(option.value)}
            aria-pressed={size === option.value}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition",
              size === option.value
                ? "bg-white text-neutral-900"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            )}
          >
            {option.label}
          </button>
        ))}
        <span className="w-px h-4 bg-neutral-700 mx-1" aria-hidden="true" />
        {[1, 4].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setCount(value)}
            aria-pressed={count === value}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition",
              count === value
                ? "bg-white text-neutral-900"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            )}
            aria-label={`Generate ${value} image${value > 1 ? "s" : ""}`}
          >
            {value}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void generate()}
          disabled={generating || !prompt.trim()}
          className="ml-auto h-9 px-5 rounded-full bg-white text-neutral-900 text-sm font-medium hover:bg-neutral-200 transition inline-flex items-center gap-2 disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          )}
          {generating ? "Generating…" : "Generate"}
        </button>
      </div>
    </div>
  )

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-white overflow-hidden">
      {/* Top bar */}
      <header className="h-14 shrink-0 border-b border-gray-200 bg-white flex items-center px-3 md:px-4 gap-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Back to home"
          className="w-9 h-9 grid place-items-center rounded-lg text-gray-600 hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-4.5 h-4.5" aria-hidden="true" />
        </button>
        <span className="font-bold text-lg text-neutral-900">Pixelcut</span>
        <span className="flex-1 text-center text-sm font-semibold text-neutral-900 hidden sm:block">
          Generate
        </span>
        <div className="flex-1 sm:hidden" />
        {user ? (
          <>
            <button
              type="button"
              onClick={() => navigate("/pricing")}
              className="h-8 px-3 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition inline-flex items-center gap-1.5"
              aria-label={`${user.credits} credits`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              {user.credits}
            </button>
            <div
              className="w-8 h-8 rounded-full bg-neutral-900 text-white text-xs font-semibold grid place-items-center"
              aria-label={`Account: ${user.email}`}
            >
              {(user.email || "u").charAt(0).toUpperCase()}
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="h-8 px-4 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition"
          >
            Log in
          </button>
        )}
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Main column */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10 w-full">
            {!hasContent ? (
              <div className="flex flex-col items-center pt-10 md:pt-20 pb-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 via-pink-100 to-violet-200 grid place-items-center shadow-sm">
                  <Sparkles className="w-8 h-8 text-neutral-700" aria-hidden="true" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 mt-6 text-center">
                  What will you create today?
                </h2>
                <p className="text-gray-500 mt-2 text-center max-w-md">
                  Describe an image and Pixelcut generates it with leading AI
                  models. Each image costs 1 credit.
                </p>
                <div className="w-full max-w-2xl mt-8">{composer}</div>
                {!user && (
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="mt-5 text-sm text-gray-500 hover:text-black underline underline-offset-4 transition"
                  >
                    Sign in to save your history and get free credits
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="sticky top-0 z-10 pt-0 pb-4 bg-white/95 backdrop-blur">
                  {composer}
                </div>
                <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
                  {sessionTiles.map((tile) => {
                    if (tile.kind === "loading") {
                      return <LoadingCard key={tile.id} aspect={size} />
                    }
                    if (tile.kind === "failed") {
                      return (
                        <div
                          key={tile.id}
                          className="mb-4 break-inside-avoid aspect-square rounded-2xl border border-red-100 bg-red-50 flex flex-col items-center justify-center gap-2 p-4 text-center"
                        >
                          <p className="text-xs text-red-600 font-medium">
                            Generation failed
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {tile.message}
                          </p>
                          <button
                            type="button"
                            onClick={() => void generateTile(tile)}
                            className="h-8 px-4 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition"
                          >
                            Try again
                          </button>
                        </div>
                      )
                    }
                    return (
                      <ImageCard
                        key={tile.id}
                        tile={tile}
                        onDownload={() => void downloadTile(tile)}
                        onExpand={() => setLightbox(tile)}
                        onDelete={
                          tile.projectId ? () => void deleteTile(tile) : null
                        }
                        onCopy={() => void copyPrompt(tile.prompt)}
                      />
                    )
                  })}
                  {projectTiles.map((tile) => (
                    <ImageCard
                      key={tile.id}
                      tile={tile}
                      onDownload={() => void downloadTile(tile)}
                      onExpand={() => setLightbox(tile)}
                      onDelete={() => void deleteTile(tile)}
                      onCopy={() => void copyPrompt(tile.prompt)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* History sidebar */}
        <aside className="hidden xl:block w-72 shrink-0 border-l border-gray-200 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Recent
          </h3>
          {user ? (
            projectTiles.length > 0 ? (
              <div className="mt-3 space-y-2">
                {projectTiles.map((tile) => (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => setLightbox(tile)}
                    className="w-full flex items-center gap-3 rounded-xl border border-gray-100 p-2 hover:border-gray-300 hover:shadow-sm transition text-left"
                  >
                    { }
                    <img
                      src={tile.url}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs text-gray-700 truncate">
                        {tile.prompt || "Untitled"}
                      </span>
                      <span className="block text-[11px] text-gray-400 mt-0.5">
                        {timeAgo(tile.createdAt)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                Images you generate appear here and are saved to your account.
              </p>
            )
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500">
                Sign in to save your generation history.
              </p>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="mt-3 h-8 px-4 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition"
              >
                Log in
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Lightbox */}
      <Dialog
        open={lightbox !== null}
        onOpenChange={(open) => {
          if (!open) setLightbox(null)
        }}
      >
        <DialogContent className="max-w-3xl">
          {lightbox && (
            <>
              <DialogHeader>
                <DialogTitle className="text-sm font-medium text-gray-600">
                  {timeAgo(lightbox.createdAt)}
                </DialogTitle>
                <DialogDescription className="line-clamp-4">
                  {lightbox.prompt}
                </DialogDescription>
              </DialogHeader>
              { }
              <img
                src={lightbox.url}
                alt={lightbox.prompt.slice(0, 80)}
                className="w-full rounded-xl"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => void copyPrompt(lightbox.prompt)}
                  className="h-9 px-4 rounded-full border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-50 transition"
                >
                  Copy prompt
                </button>
                <button
                  type="button"
                  onClick={() => void downloadTile(lightbox)}
                  className="h-9 px-4 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition"
                >
                  Download
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TileButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="w-8 h-8 rounded-full bg-white/90 text-neutral-900 grid place-items-center hover:bg-white transition"
    >
      {children}
    </button>
  )
}

function LoadingCard({ aspect }: { aspect: string }) {
  const aspectClass =
    aspect === "9:16"
      ? "aspect-[9/16]"
      : aspect === "16:9"
        ? "aspect-video"
        : "aspect-square"
  return (
    <div
      className={`mb-4 break-inside-avoid ${aspectClass} rounded-2xl bg-neutral-100 border border-neutral-200 animate-pulse flex flex-col items-center justify-center gap-2`}
      role="status"
      aria-label="Generating image"
    >
      <Loader2 className="w-5 h-5 animate-spin text-gray-400" aria-hidden="true" />
      <span className="text-[11px] text-gray-400">Generating…</span>
    </div>
  )
}

function ImageCard({
  tile,
  onDownload,
  onExpand,
  onDelete,
  onCopy,
}: {
  tile: ImageTile
  onDownload: () => void
  onExpand: () => void
  onDelete: (() => void) | null
  onCopy: () => void
}) {
  return (
    <div className="group relative mb-4 break-inside-avoid rounded-2xl overflow-hidden border border-gray-200">
      { }
      <img
        src={tile.url}
        alt={tile.prompt.slice(0, 80)}
        className="w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-3">
        <div className="flex justify-end gap-1.5">
          <TileButton label="Download image" onClick={onDownload}>
            <Download className="w-4 h-4" aria-hidden="true" />
          </TileButton>
          <TileButton label="Expand image" onClick={onExpand}>
            <Maximize2 className="w-4 h-4" aria-hidden="true" />
          </TileButton>
          {onDelete && (
            <TileButton label="Delete image" onClick={onDelete}>
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </TileButton>
          )}
          <TileButton label="Copy prompt" onClick={onCopy}>
            <Copy className="w-4 h-4" aria-hidden="true" />
          </TileButton>
        </div>
        <p className="text-[11px] text-white/90 line-clamp-3 leading-snug">
          {tile.prompt}
        </p>
      </div>
    </div>
  )
}
