"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { LifeBuoy, Maximize, Minus, Plus } from "lucide-react"
import { useRouter } from "@/lib/router"
import { useAuthStore } from "@/stores/auth"
import { useToast } from "@/hooks/use-toast"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UPLOAD_STASH_KEY } from "@/components/tools/upload-zone"
import {
  compositeOverColor,
  compositeOverImage,
  downloadImage,
  ensureDataUrl,
  loadImage,
  makeWhiteTransparent,
  measureImage,
} from "./image-utils"
import { runTool } from "./tool-api"
import type { ToolRunHelpers } from "./tool-api"
import { EditorToolbar } from "./editor-toolbar"
import type { Rating } from "./editor-toolbar"
import { EditorRail } from "./editor-rail"
import type { PanelId } from "./editor-rail"
import { RAIL_TOOLS } from "./editor-rail"
import { PanelContent, SCENE_PRESETS } from "./editor-panels"
import type { PanelBundle } from "./editor-panels"
import { EditorCanvas } from "./editor-canvas"
import type { CanvasError } from "./editor-canvas"
import { PromptBar } from "./prompt-bar"

const AUTO_TOOLS = ["removeBackground", "upscale"]
const SAMPLES = [
  "/images/sample-portrait.png",
  "/images/sample-product.png",
  "/images/mosaic-3.png",
]

const PANEL_BY_TOOL: Record<string, PanelId> = {
  removeBackground: "background",
  generateBackground: "background",
  productPhotography: "background",
  magicEraser: "retouch",
  generativeFill: "retouch",
  aiAds: "retouch",
  uncrop: "expand",
  upscale: "upscale",
  enhance: "enhance",
}

interface UploadStash {
  dataUrl: string
  name: string
}

function readStash(): UploadStash | null {
  try {
    const raw = sessionStorage.getItem(UPLOAD_STASH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as UploadStash
    return parsed?.dataUrl ? parsed : null
  } catch {
    return null
  }
}

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Could not read file"))
    reader.readAsDataURL(blob)
  })
}

async function fetchAsDataUrl(path: string): Promise<string> {
  const res = await fetch(path)
  if (!res.ok) throw new Error("fetch failed")
  const blob = await res.blob()
  return readAsDataUrl(blob)
}

export function EditorPage({ query }: { query: URLSearchParams }) {
  const { navigate } = useRouter()
  const { toast } = useToast()
  const { user, setAuthModalOpen, setCredits } = useAuthStore()

  const queryStr = query.toString()
  const tool = query.get("tool") || "removeBackground"
  const from = query.get("from") || ""
  const uploadName = query.get("name") || "image"
  const scaleParam = Math.min(
    16,
    Math.max(2, parseInt(query.get("scale") || "2", 10) || 2)
  )
  const presetIndex = parseInt(query.get("preset") || "0", 10)
  const presetPrompt =
    Number.isFinite(presetIndex) && SCENE_PRESETS[presetIndex]
      ? SCENE_PRESETS[presetIndex].prompt
      : ""

  const baseFileName = useMemo(
    () => uploadName.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]+/gi, "-").slice(0, 40) || "image",
    [uploadName]
  )

  // ---- editor state -------------------------------------------------------
  const [original, setOriginal] = useState<string | null>(null)
  const [current, setCurrent] = useState<string | null>(null)
  const [transparentBase, setTransparentBase] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 })
  const [processing, setProcessing] = useState<string | null>(null)
  const [error, setError] = useState<CanvasError | null>(null)
  const [compare, setCompare] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [panel, setPanel] = useState<PanelId>(
    PANEL_BY_TOOL[tool] ?? "background"
  )
  const [rating, setRating] = useState<Rating>(null)
  const [shadowOn, setShadowOn] = useState(false)
  const [blurValue, setBlurValue] = useState(5)
  const [expandAspect, setExpandAspect] = useState("1:1")
  const [upscaleScale, setUpscaleScale] = useState(
    AUTO_TOOLS.includes(tool) && tool === "upscale" ? scaleParam : 2
  )
  const [drawerOpen, setDrawerOpen] = useState(false)

  const originalRef = useRef<string | null>(null)
  const currentRef = useRef<string | null>(null)
  const transparentBaseRef = useRef<string | null>(null)
  const autoBusyRef = useRef<string | null>(null)
  const blurTimerRef = useRef<number | null>(null)

  const helpers = useMemo<ToolRunHelpers>(
    () => ({
      toast,
      navigate,
      setAuthModalOpen,
      setCredits,
      onError: (message) => setError({ message }),
    }),
    [toast, navigate, setAuthModalOpen, setCredits]
  )

  // ---- history management -------------------------------------------------
  async function measureAndSetDims(url: string) {
    const measured = await measureImage(url)
    if (measured) setDims(measured)
  }

  function commitResult(url: string, w?: number, h?: number) {
    const prev = currentRef.current
    if (prev) {
      setHistory((hist) => [...hist, prev])
      setRedoStack([])
    }
    setCurrent(url)
    currentRef.current = url
    setCompare(false)
    if (w && h) setDims({ w, h })
    else void measureAndSetDims(url)
    setZoom(100)
  }

  function undo() {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    const cur = current
    setHistory(history.slice(0, -1))
    if (cur) setRedoStack([...redoStack, cur])
    setCurrent(prev)
    currentRef.current = prev
    setZoom(100)
    void measureAndSetDims(prev)
  }

  function redo() {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    const cur = current
    setRedoStack(redoStack.slice(0, -1))
    if (cur) setHistory([...history, cur])
    setCurrent(next)
    currentRef.current = next
    setZoom(100)
    void measureAndSetDims(next)
  }

  // ---- tool execution -----------------------------------------------------
  async function execute(
    endpoint: string,
    body: Record<string, unknown>,
    label: string
  ): Promise<boolean> {
    const rawImage =
      typeof body.image === "string" ? body.image : currentRef.current
    if (!rawImage) {
      toast({
        title: "No image yet",
        description: "Upload a photo or pick a sample to get started.",
      })
      return false
    }
    setProcessing(label)
    setError(null)
    try {
      // Tool APIs accept data-URL images only — server paths must be re-read.
      const image = await ensureDataUrl(rawImage)
      return await runTool(
        endpoint,
        { ...body, image },
        {
          label,
          onSuccess: (result) => {
            commitResult(result.imageUrl, result.width, result.height)
            setRating(null)
          },
          retry: () => {
            void execute(endpoint, body, label)
          },
        },
        helpers
      )
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "AI processing failed. Please try again."
      toast({
        title: "Something went wrong",
        description: message,
        variant: "destructive",
      })
      setError({ message })
      return false
    } finally {
      setProcessing(null)
    }
  }

  async function runAuto(image: string, autoTool: string, scale: number) {
    const isUpscale = autoTool === "upscale"
    const label = isUpscale ? `Upscaling ${scale}x…` : "Removing background…"
    setProcessing(label)
    setError(null)
    try {
      await runTool(
        isUpscale ? "upscale" : "remove-background",
        isUpscale ? { image, scale } : { image },
        {
          label,
          onSuccess: async (result) => {
            if (!isUpscale) {
              // The API returns the subject on a flat white backdrop — key
              // it to a real transparent cutout for swatches & PNG export.
              try {
                const loaded = await loadImage(result.imageUrl)
                const keyed = makeWhiteTransparent(loaded)
                transparentBaseRef.current = keyed
                setTransparentBase(keyed)
                commitResult(keyed, result.width, result.height)
              } catch {
                transparentBaseRef.current = result.imageUrl
                setTransparentBase(result.imageUrl)
                commitResult(result.imageUrl, result.width, result.height)
              }
            } else {
              commitResult(result.imageUrl, result.width, result.height)
            }
            setRating(null)
          },
          retry: () => {
            void runAuto(image, autoTool, scale)
          },
        },
        helpers
      )
    } finally {
      setProcessing(null)
    }
  }

  function loadIntoEditor(dataUrl: string) {
    originalRef.current = dataUrl
    setOriginal(dataUrl)
    transparentBaseRef.current = dataUrl
    setTransparentBase(dataUrl)
    setHistory([])
    setRedoStack([])
    setError(null)
    setCompare(false)
    setZoom(100)
    setRating(null)
    setShadowOn(false)
    if (AUTO_TOOLS.includes(tool)) {
      currentRef.current = null
      setCurrent(null)
      setDims({ w: 0, h: 0 })
      void runAuto(dataUrl, tool, tool === "upscale" ? upscaleScale : 2)
    } else {
      currentRef.current = dataUrl
      setCurrent(dataUrl)
      void measureAndSetDims(dataUrl)
    }
  }

  // ---- initial load (sessionStorage upload stash) -------------------------
  useEffect(() => {
    setPanel(PANEL_BY_TOOL[tool] ?? "background")
    setHistory([])
    setRedoStack([])
    setError(null)
    setCompare(false)
    setZoom(100)
    setRating(null)
    setShadowOn(false)
    setDrawerOpen(false)
    const stash = readStash()
    if (stash?.dataUrl) {
      originalRef.current = stash.dataUrl
      setOriginal(stash.dataUrl)
      transparentBaseRef.current = stash.dataUrl
      setTransparentBase(stash.dataUrl)
      currentRef.current = stash.dataUrl
      setCurrent(stash.dataUrl)
      void measureAndSetDims(stash.dataUrl)
      if (AUTO_TOOLS.includes(tool)) {
        currentRef.current = null
        setCurrent(null)
        setDims({ w: 0, h: 0 })
        if (autoBusyRef.current !== queryStr) {
          autoBusyRef.current = queryStr
          void runAuto(stash.dataUrl, tool, tool === "upscale" ? scaleParam : 2)
        }
      }
    } else {
      originalRef.current = null
      setOriginal(null)
      currentRef.current = null
      setCurrent(null)
      transparentBaseRef.current = null
      setTransparentBase(null)
      setDims({ w: 0, h: 0 })
    }
     
  }, [queryStr])

  // Clear pending blur debounce on unmount.
  useEffect(
    () => () => {
      if (blurTimerRef.current) window.clearTimeout(blurTimerRef.current)
    },
    []
  )

  // ---- file / sample loading ----------------------------------------------
  async function handlePickFile(file: File) {
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Upload error",
        description: "File is too large. Images must be under 50MB.",
        variant: "destructive",
      })
      return
    }
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Upload error",
        description: "Please choose a JPG, PNG, or HEIC image.",
        variant: "destructive",
      })
      return
    }
    try {
      const dataUrl = await readAsDataUrl(file)
      loadIntoEditor(dataUrl)
    } catch {
      toast({
        title: "Upload error",
        description: "Something went wrong reading your file. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleSample(path: string) {
    try {
      const dataUrl = await fetchAsDataUrl(path)
      loadIntoEditor(dataUrl)
    } catch {
      toast({
        title: "Couldn't load that sample",
        description: "Please try uploading your own image.",
        variant: "destructive",
      })
    }
  }

  // ---- background panel actions -------------------------------------------
  async function applyColor(color: string | null) {
    const base = transparentBaseRef.current
    if (!base) {
      toast({
        title: "No cutout yet",
        description: "Remove the background first, then pick a color.",
      })
      return
    }
    setProcessing("Applying background…")
    try {
      const { url, w, h } = await compositeOverColor(base, color)
      commitResult(url, w, h)
    } catch {
      toast({
        title: "Couldn't apply background",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  async function applyImageBackground(bgPath: string) {
    const base = transparentBaseRef.current
    if (!base) {
      toast({
        title: "No cutout yet",
        description: "Remove the background first, then choose a backdrop.",
      })
      return
    }
    setProcessing("Applying background image…")
    try {
      const { url, w, h } = await compositeOverImage(base, bgPath)
      commitResult(url, w, h)
    } catch {
      toast({
        title: "Couldn't apply background",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  async function handleShadowToggle(on: boolean) {
    setShadowOn(on)
    if (!on) {
      toast({
        title: "Shadow toggle off",
        description: "Use Undo to revert a shadow that was already applied.",
      })
      return
    }
    await execute("shadow", { image: currentRef.current }, "Adding shadow…")
  }

  function handleBlurCommit(value: number) {
    setBlurValue(value)
    if (blurTimerRef.current) window.clearTimeout(blurTimerRef.current)
    blurTimerRef.current = window.setTimeout(() => {
      blurTimerRef.current = null
      void execute(
        "blur",
        { image: currentRef.current, intensity: value },
        "Blurring background…"
      )
    }, 600)
  }

  // ---- downloads -----------------------------------------------------------
  async function downloadPreview() {
    if (!currentRef.current) return
    try {
      await downloadImage(
        currentRef.current,
        `pixelcut-${baseFileName}-preview.png`,
        0.75
      )
      toast({ title: "Preview downloaded", description: "75% resolution — free." })
    } catch {
      toast({
        title: "Download failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  async function downloadFull() {
    if (!currentRef.current) return
    if (!user) {
      setAuthModalOpen(true, () => {
        void downloadFull()
      })
      return
    }
    try {
      await downloadImage(
        currentRef.current,
        `pixelcut-${baseFileName}.png`,
        1
      )
      toast({ title: "Full resolution downloaded", description: "Free with your account." })
    } catch {
      toast({
        title: "Download failed",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  // ---- misc ----------------------------------------------------------------
  function handleRate(value: "up" | "down") {
    setRating(value)
    toast({ title: "Thanks for your feedback!" })
  }

  function handlePromptSubmit(prompt: string, model: string) {
    void execute(
      "generate-background",
      { image: currentRef.current, prompt, model },
      "Generating background…"
    )
  }

  const bundle: PanelBundle = {
    entryTool: tool,
    presetPrompt,
    processing,
    hasImage: current !== null,
    onApplyColor: (color) => void applyColor(color),
    onCustomColor: (hex) => void applyColor(hex),
    onGenerateBackground: (prompt) =>
      void execute(
        "generate-background",
        { image: currentRef.current, prompt },
        "Generating background…"
      ),
    onImageBackground: (path) => void applyImageBackground(path),
    onProductPhoto: (prompt) =>
      void execute(
        "product-photography",
        { image: currentRef.current, prompt },
        "Creating product scene…"
      ),
    shadowOn,
    onShadowToggle: (on) => void handleShadowToggle(on),
    blurValue,
    onBlurCommit: handleBlurCommit,
    onCompareToggle: () => setCompare((c) => !c),
    onRetouch: (target) =>
      void execute(
        "magic-eraser",
        { image: currentRef.current, target },
        "Removing…"
      ),
    onGenerativeFill: (prompt) =>
      void execute(
        "generative-fill",
        { image: currentRef.current, prompt },
        "Filling…"
      ),
    onAiAds: (prompt) =>
      void execute(
        "ai-ads",
        { image: currentRef.current, prompt },
        "Creating your ad…"
      ),
    expandAspect,
    onExpandAspect: setExpandAspect,
    onExpand: () =>
      void execute(
        "uncrop",
        { image: currentRef.current, size: expandAspect },
        "Expanding image…"
      ),
    upscaleScale,
    onUpscaleScale: setUpscaleScale,
    onUpscale: () =>
      void execute(
        "upscale",
        { image: currentRef.current, scale: upscaleScale },
        `Upscaling ${upscaleScale}x…`
      ),
    onEnhance: () =>
      void execute(
        "enhance",
        { image: currentRef.current },
        "Enhancing…"
      ),
  }

  const activeRail = RAIL_TOOLS.find((t) => t.id === panel)

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-neutral-100 overflow-hidden">
      <EditorToolbar
        from={from}
        dims={dims}
        hasResult={current !== null}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={undo}
        onRedo={redo}
        compare={compare}
        onToggleCompare={() => setCompare((c) => !c)}
        rating={rating}
        onRate={handleRate}
        onDownloadPreview={() => void downloadPreview()}
        onDownloadFull={() => void downloadFull()}
      />

      <div className="flex-1 flex min-h-0">
        {/* Left rail (desktop) */}
        <div className="hidden md:flex flex-col p-3 shrink-0">
          <EditorRail
            variant="vertical"
            active={panel}
            onSelect={(p) => setPanel(p)}
          />
        </div>

        {/* Canvas + overlays */}
        <div className="flex-1 min-w-0 flex flex-col relative">
          <EditorCanvas
            current={current}
            original={original}
            compare={compare}
            processing={processing}
            error={error}
            zoom={zoom}
            samples={SAMPLES}
            onPickFile={(file) => void handlePickFile(file)}
            onSample={(path) => void handleSample(path)}
            onDismissError={() => setError(null)}
          />

          {/* Prompt bar (desktop) */}
          <div className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 w-[min(640px,92%)] z-10">
            <PromptBar
              onSubmit={handlePromptSubmit}
              processing={processing !== null}
            />
          </div>

          {/* Zoom controls (lifted above the prompt bar so they never overlap) */}
          <div className="absolute bottom-4 right-4 md:bottom-24 md:right-6 z-10 flex items-center rounded-lg bg-white shadow-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => setZoom((z) => Math.max(25, z - 25))}
              className="w-9 h-9 grid place-items-center text-gray-600 hover:bg-gray-100 transition"
            >
              <Minus className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Fit to screen"
              onClick={() => setZoom(100)}
              className="w-9 h-9 grid place-items-center text-gray-600 hover:bg-gray-100 transition border-x border-gray-200"
            >
              <Maximize className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => setZoom((z) => Math.min(400, z + 25))}
              className="w-9 h-9 grid place-items-center text-gray-600 hover:bg-gray-100 transition"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="px-2.5 text-xs text-gray-500 tabular-nums w-14 text-center">
              {zoom}%
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Help"
                  className="w-9 h-9 grid place-items-center text-gray-600 hover:bg-gray-100 transition border-l border-gray-200"
                >
                  <LifeBuoy className="w-4 h-4" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    toast({
                      title: "Need help?",
                      description: "support@pixelcut.ai — we usually reply within a day.",
                    })
                  }}
                  className="cursor-pointer"
                >
                  Contact support
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    toast({
                      title: "Pixelcut help center",
                      description: "help.pixelcut.io — external link stubbed in this build.",
                    })
                  }}
                  className="cursor-pointer"
                >
                  Visit help center
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Right panel (desktop) */}
        <aside className="hidden md:block w-72 shrink-0 p-3">
          <div className="w-full h-full bg-white rounded-2xl shadow-lg border border-gray-200 p-4 overflow-y-auto">
            <PanelContent panel={panel} bundle={bundle} />
          </div>
        </aside>
      </div>

      {/* Mobile bottom dock: prompt bar + tool rail */}
      <div className="md:hidden shrink-0 bg-white border-t border-gray-200 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        <PromptBar
          onSubmit={handlePromptSubmit}
          processing={processing !== null}
          className="mb-2"
        />
        <EditorRail
          variant="horizontal"
          active={panel}
          onSelect={(p) => {
            setPanel(p)
            setDrawerOpen(true)
          }}
        />
      </div>

      {/* Mobile panel drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[75vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>{activeRail?.label ?? "Tools"}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto max-h-[60vh]">
            <PanelContent panel={panel} bundle={bundle} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
