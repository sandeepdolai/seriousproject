"use client"

import { useState } from "react"
import {
  ChevronDown,
  Eye,
  History,
  Loader2,
  Palette,
  ScanFace,
  Shirt,
  Sparkles,
} from "lucide-react"
import type { CSSProperties } from "react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { PanelId } from "./editor-rail"

/** Mini checkerboard used for the "transparent" swatch. */
export const CHECKER_STYLE: CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, #d1d5db 25%, transparent 25%), linear-gradient(-45deg, #d1d5db 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d1d5db 75%), linear-gradient(-45deg, transparent 75%, #d1d5db 75%)",
  backgroundSize: "8px 8px",
  backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
  backgroundColor: "white",
}

export const BG_IMAGE_PRESETS = [
  { label: "Marble", path: "/images/bg-marble.png" },
  { label: "Beach", path: "/images/bg-beach.png" },
  { label: "Studio", path: "/images/bg-studio-gray.png" },
  { label: "Gradient", path: "/images/bg-gradient-pink.png" },
  { label: "Wood", path: "/images/bg-wood.png" },
  { label: "City", path: "/images/bg-city.png" },
]

export const SCENE_PRESETS = [
  { label: "Marble table", prompt: "an elegant white marble table with soft natural window light and a minimal luxury aesthetic" },
  { label: "Beach scene", prompt: "a sunlit sandy beach with ocean waves in the background and warm golden light" },
  { label: "Studio gradient", prompt: "a professional photo studio with a seamless gray gradient background and soft even lighting" },
  { label: "Wood table", prompt: "a rustic warm wooden table with cozy ambient light and shallow depth of field" },
  { label: "City bokeh", prompt: "a blurred city skyline at night with warm bokeh lights and a premium feel" },
]

const SWATCHES: { label: string; color: string | null; style?: CSSProperties }[] = [
  { label: "Transparent", color: null, style: CHECKER_STYLE },
  { label: "White", color: "#FFFFFF" },
  { label: "Black", color: "#000000" },
  { label: "Light gray", color: "#F3F4F6" },
  { label: "Cream", color: "#FEF3C7" },
  {
    label: "Rainbow",
    color: "rainbow",
    style: { background: "conic-gradient(red, orange, yellow, green, blue, violet, red)" },
  },
]

export interface ResizeRequest {
  preset?: string
  width?: number
  height?: number
  fit?: "cover" | "contain"
}

export const RESIZE_PRESETS: { key: string; label: string; dims: string }[] = [
  { key: "instagramPost", label: "Instagram post", dims: "1080×1080" },
  { key: "instagramPortrait", label: "Instagram portrait", dims: "1080×1350" },
  { key: "instagramStory", label: "Story / Reel", dims: "1080×1920" },
  { key: "youtubeThumb", label: "YouTube thumbnail", dims: "1280×720" },
  { key: "xPost", label: "X post", dims: "1600×900" },
  { key: "facebookCover", label: "Facebook cover", dims: "1640×924" },
  { key: "linkedinCover", label: "LinkedIn banner", dims: "1584×396" },
  { key: "profile", label: "Profile picture", dims: "800×800" },
  { key: "print4x6", label: "Print 4×6", dims: "1200×1800" },
  { key: "print8x10", label: "Print 8×10", dims: "2400×3000" },
]

export const PROFILE_STYLES: { key: string; label: string; hint: string }[] = [
  { key: "studio", label: "Studio", hint: "Soft gray backdrop, pro light" },
  { key: "gradient", label: "Gradient", hint: "Vibrant modern backdrop" },
  { key: "outdoor", label: "Outdoor", hint: "Warm natural daylight" },
  { key: "bw", label: "Black & white", hint: "Timeless monochrome" },
  { key: "linkedin", label: "LinkedIn", hint: "Clean professional headshot" },
]

export const TRYON_PRESETS = [
  "an elegant flowing coral summer dress",
  "a casual denim jacket with a white tee",
  "a cream knit sweater with wide-leg trousers",
  "a tailored charcoal blazer",
]

export const RECOLOR_COLORS: { label: string; hex: string }[] = [
  { label: "Red", hex: "#E02424" },
  { label: "Blue", hex: "#2563EB" },
  { label: "Green", hex: "#16A34A" },
  { label: "Yellow", hex: "#FACC15" },
  { label: "Purple", hex: "#9333EA" },
  { label: "Pink", hex: "#EC4899" },
  { label: "Orange", hex: "#F97316" },
  { label: "Teal", hex: "#14B8A6" },
  { label: "White", hex: "#FFFFFF" },
  { label: "Black", hex: "#111827" },
]

export interface PanelBundle {
  entryTool: string
  presetPrompt: string
  processing: string | null
  hasImage: boolean
  onApplyColor: (color: string | null) => void
  onCustomColor: (hex: string) => void
  onGenerateBackground: (prompt: string) => void
  onImageBackground: (bgPath: string) => void
  onProductPhoto: (prompt: string) => void
  shadowOn: boolean
  onShadowToggle: (on: boolean) => void
  blurValue: number
  onBlurCommit: (value: number) => void
  onBlurApply: (value: number) => void
  onCompareToggle: () => void
  onRetouch: (target: string) => void
  onGenerativeFill: (prompt: string) => void
  onAiAds: (prompt: string) => void
  expandAspect: string
  onExpandAspect: (aspect: string) => void
  onExpand: () => void
  upscaleScale: number
  onUpscaleScale: (scale: number) => void
  onUpscale: () => void
  onEnhance: () => void
  onColorize: () => void
  onRestore: (colorize: boolean) => void
  onRecolor: (target: string, color: string) => void
  onResize: (request: ResizeRequest) => void
  onTryOn: (garment: string, model: string) => void
  onProfilePicture: (style: string) => void
}

function ActionButton({
  children,
  onClick,
  disabled,
  loading,
  variant = "primary",
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  variant?: "primary" | "secondary"
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "w-full rounded-lg py-2.5 text-sm font-medium transition inline-flex items-center justify-center gap-2 disabled:opacity-50",
        variant === "primary"
          ? "bg-black text-white hover:bg-neutral-800"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      )}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

function ChipRow({
  options,
  value,
  onSelect,
  disabled,
}: {
  options: { label: string; value: string | number }[]
  value: string | number
  onSelect: (value: string | number) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(option.value)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium border transition disabled:opacity-50",
            value === option.value
              ? "bg-black text-white border-black"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
          )}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function CollapsibleRow({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-gray-100 pt-3 mt-3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-black transition"
      >
        {title}
        <ChevronDown
          className={cn("w-4 h-4 text-gray-400 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

/* ---------------- Background panel ---------------- */

function BackgroundPanel({ bundle }: { bundle: PanelBundle }) {
  const [customColor, setCustomColor] = useState("#FBCFE8")
  const [showGenPrompt, setShowGenPrompt] = useState(false)
  const [genPrompt, setGenPrompt] = useState("")
  const [showImageBg, setShowImageBg] = useState(false)
  const [shadowOpen, setShadowOpen] = useState(false)
  const [blurOpen, setBlurOpen] = useState(false)
  const [productPrompt, setProductPrompt] = useState(bundle.presetPrompt)
  const busy = bundle.processing !== null
  const isProductPhotography = bundle.entryTool === "productPhotography"

  return (
    <div>
      <h3 className="font-semibold text-sm mb-3 text-neutral-900">Background</h3>

      {isProductPhotography && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Product photography
          </p>
          <textarea
            value={productPrompt}
            onChange={(e) => setProductPrompt(e.target.value)}
            rows={3}
            placeholder="Describe the scene for your product…"
            className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 resize-none"
            aria-label="Product scene description"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {SCENE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                disabled={busy}
                onClick={() => setProductPrompt(preset.prompt)}
                className="rounded-full px-2.5 py-1 text-xs border border-gray-200 text-gray-600 hover:border-gray-400 transition disabled:opacity-50"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <ActionButton
              onClick={() => bundle.onProductPhoto(productPrompt)}
              disabled={!bundle.hasImage || !productPrompt.trim()}
              loading={busy}
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Generate scene · 1 credit
            </ActionButton>
          </div>
        </div>
      )}

      {/* Color swatches */}
      <div className="grid grid-cols-6 gap-2 mb-3">
        {SWATCHES.map((swatch) => (
          <button
            key={swatch.label}
            type="button"
            title={swatch.label}
            aria-label={`Set ${swatch.label} background`}
            disabled={!bundle.hasImage || busy}
            onClick={() =>
              swatch.color === "rainbow"
                ? bundle.onCustomColor("rainbow")
                : bundle.onApplyColor(swatch.color)
            }
            className="w-8 h-8 rounded-full border border-gray-200 shadow-inner overflow-hidden disabled:opacity-40"
            style={swatch.style ?? { backgroundColor: swatch.color ?? "transparent" }}
          />
        ))}
      </div>

      {/* Custom color */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="color"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          onBlur={() => bundle.onCustomColor(customColor)}
          disabled={!bundle.hasImage || busy}
          className="w-8 h-8 rounded cursor-pointer border border-gray-200 bg-white p-0.5"
          aria-label="Custom background color"
        />
        <span className="text-xs text-gray-500 font-mono">{customColor}</span>
      </div>

      {/* Generate background */}
      <button
        type="button"
        onClick={() => setShowGenPrompt((v) => !v)}
        className="w-full rounded-lg bg-gray-100 hover:bg-gray-200 py-2.5 text-sm font-medium mb-2 transition text-gray-800"
      >
        Generate Background
      </button>
      {showGenPrompt && (
        <div className="mb-3">
          <textarea
            value={genPrompt}
            onChange={(e) => setGenPrompt(e.target.value)}
            rows={3}
            placeholder="Describe the background you want… e.g. a sunlit marble table with soft shadows"
            className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 resize-none"
            aria-label="Background prompt"
          />
          <ActionButton
            onClick={() => bundle.onGenerateBackground(genPrompt)}
            disabled={!bundle.hasImage || !genPrompt.trim()}
            loading={busy}
          >
            Generate · 1 credit
          </ActionButton>
          <p className="text-[11px] text-gray-400 mt-1.5">
            Uses 1 credit. Sign in required.
          </p>
        </div>
      )}

      {/* Image background */}
      <button
        type="button"
        onClick={() => setShowImageBg((v) => !v)}
        className="w-full rounded-lg bg-gray-100 hover:bg-gray-200 py-2.5 text-sm font-medium mb-2 transition text-gray-800"
      >
        Image Background
      </button>
      {showImageBg && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {BG_IMAGE_PRESETS.map((preset) => (
            <button
              key={preset.path}
              type="button"
              title={preset.label}
              aria-label={`Set ${preset.label} background image`}
              disabled={!bundle.hasImage || busy}
              onClick={() => bundle.onImageBackground(preset.path)}
              className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition disabled:opacity-40"
            >
              { }
              <img
                src={preset.path}
                alt={preset.label}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}

      {/* Shadow */}
      <CollapsibleRow
        title="Shadow"
        open={shadowOpen}
        onToggle={() => setShadowOpen((v) => !v)}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Add a soft studio shadow under the subject
          </span>
          <Switch
            checked={bundle.shadowOn}
            onCheckedChange={bundle.onShadowToggle}
            aria-label="Toggle shadow"
          />
        </div>
      </CollapsibleRow>

      {/* Blur */}
      <CollapsibleRow
        title="Blur"
        open={blurOpen}
        onToggle={() => setBlurOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <Slider
            value={[bundle.blurValue]}
            min={1}
            max={10}
            step={1}
            onValueChange={(v) => bundle.onBlurCommit(v[0] ?? bundle.blurValue)}
            onValueCommit={(v) => bundle.onBlurCommit(v[0] ?? bundle.blurValue)}
            aria-label="Background blur intensity"
            className="flex-1"
          />
          <span className="text-xs text-gray-500 w-6 text-right tabular-nums">
            {bundle.blurValue}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">
          Applies a bokeh blur — release the slider to apply.
        </p>
      </CollapsibleRow>

      {/* Compare */}
      <div className="border-t border-gray-100 pt-3 mt-3">
        <button
          type="button"
          onClick={bundle.onCompareToggle}
          className="w-full rounded-lg border border-gray-200 hover:bg-gray-50 py-2.5 text-sm font-medium transition text-gray-700 inline-flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" aria-hidden="true" />
          Compare results
        </button>
      </div>
    </div>
  )
}

/* ---------------- Retouch panel ---------------- */

function RetouchPanel({ bundle }: { bundle: PanelBundle }) {
  const [target, setTarget] = useState("")
  const [fillPrompt, setFillPrompt] = useState("")
  const [adsPrompt, setAdsPrompt] = useState("")
  const busy = bundle.processing !== null
  const isAiAds = bundle.entryTool === "aiAds"

  return (
    <div>
      <h3 className="font-semibold text-sm mb-3 text-neutral-900">Retouch</h3>

      <label htmlFor="retouch-target" className="text-sm text-gray-600 block mb-2">
        What should we remove?
      </label>
      <Input
        id="retouch-target"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="e.g. the person in the background"
        disabled={busy}
        className="mb-2"
      />
      <ActionButton
        onClick={() => bundle.onRetouch(target)}
        disabled={!bundle.hasImage || !target.trim()}
        loading={busy}
      >
        Remove
      </ActionButton>

      <div className="border-t border-gray-100 mt-4 pt-4">
        <label htmlFor="fill-prompt" className="text-sm text-gray-600 block mb-2">
          Generative fill
        </label>
        <textarea
          id="fill-prompt"
          value={fillPrompt}
          onChange={(e) => setFillPrompt(e.target.value)}
          rows={3}
          placeholder="Describe what to add or change… e.g. add a vase of tulips on the table"
          disabled={busy}
          className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 resize-none mb-2"
        />
        <ActionButton
          onClick={() => bundle.onGenerativeFill(fillPrompt)}
          disabled={!bundle.hasImage || !fillPrompt.trim()}
          loading={busy}
        >
          Apply edit
        </ActionButton>
      </div>

      {isAiAds && (
        <div className="border-t border-gray-100 mt-4 pt-4">
          <label htmlFor="ads-prompt" className="text-sm text-gray-600 block mb-2">
            Create an AI ad
          </label>
          <textarea
            id="ads-prompt"
            value={adsPrompt}
            onChange={(e) => setAdsPrompt(e.target.value)}
            rows={3}
            placeholder="Describe the creator and the pitch — e.g. a friendly creator holding the product, talking about the 30-day guarantee"
            disabled={busy}
            className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 resize-none mb-2"
          />
          <ActionButton
            onClick={() => bundle.onAiAds(adsPrompt)}
            disabled={!bundle.hasImage || !adsPrompt.trim()}
            loading={busy}
          >
            Generate ad · 1 credit
          </ActionButton>
        </div>
      )}
    </div>
  )
}

/* ---------------- Expand panel ---------------- */

function ExpandPanel({ bundle }: { bundle: PanelBundle }) {
  const busy = bundle.processing !== null
  return (
    <div>
      <h3 className="font-semibold text-sm mb-3 text-neutral-900">
        Expand your image
      </h3>
      <p className="text-xs text-gray-500 mb-3">
        Extend the canvas beyond the edges and let the AI outpaint the rest of
        the scene.
      </p>
      <ChipRow
        options={[
          { label: "1:1", value: "1:1" },
          { label: "4:3", value: "4:3" },
          { label: "16:9", value: "16:9" },
        ]}
        value={bundle.expandAspect}
        onSelect={(v) => bundle.onExpandAspect(String(v))}
        disabled={busy}
      />
      <div className="mt-4">
        <ActionButton
          onClick={bundle.onExpand}
          disabled={!bundle.hasImage}
          loading={busy}
        >
          Expand
        </ActionButton>
      </div>
    </div>
  )
}

/* ---------------- Upscale panel ---------------- */

function UpscalePanel({ bundle }: { bundle: PanelBundle }) {
  const busy = bundle.processing !== null
  return (
    <div>
      <h3 className="font-semibold text-sm mb-3 text-neutral-900">Upscale</h3>
      <p className="text-xs text-gray-500 mb-3">
        Increase resolution up to 16x while recovering detail and removing
        artifacts.
      </p>
      <ChipRow
        options={[
          { label: "2x", value: 2 },
          { label: "4x", value: 4 },
          { label: "8x", value: 8 },
          { label: "16x", value: 16 },
        ]}
        value={bundle.upscaleScale}
        onSelect={(v) => bundle.onUpscaleScale(Number(v))}
        disabled={busy}
      />
      <div className="mt-4">
        <ActionButton
          onClick={bundle.onUpscale}
          disabled={!bundle.hasImage}
          loading={busy}
        >
          Upscale
        </ActionButton>
      </div>
    </div>
  )
}

/* ---------------- Enhance panel ---------------- */

function EnhancePanel({ bundle }: { bundle: PanelBundle }) {
  const busy = bundle.processing !== null
  return (
    <div>
      <h3 className="font-semibold text-sm mb-3 text-neutral-900">Enhance</h3>
      <p className="text-xs text-gray-500 mb-4">
        One tap auto-enhance: optimized colors, contrast, exposure and white
        balance, with extra detail recovery.
      </p>
      <ActionButton
        onClick={bundle.onEnhance}
        disabled={!bundle.hasImage}
        loading={busy}
      >
        <Sparkles className="w-4 h-4" aria-hidden="true" />
        Enhance automatically · 1 credit
      </ActionButton>
      <p className="text-[11px] text-gray-400 mt-2">
        Uses 1 credit. Sign in required.
      </p>
    </div>
  )
}

/* ---------------- Blur panel ---------------- */

function BlurPanel({ bundle }: { bundle: PanelBundle }) {
  const busy = bundle.processing !== null
  const [value, setValue] = useState(bundle.blurValue)
  return (
    <div>
      <h3 className="font-semibold text-sm mb-3 text-neutral-900">Blur background</h3>
      <p className="text-xs text-gray-500 mb-4">
        Keep the subject in sharp focus while the background melts into smooth
        bokeh, like a fast portrait lens.
      </p>
      <div className="flex items-center gap-3 mb-4">
        <Slider
          value={[value]}
          min={1}
          max={10}
          step={1}
          onValueChange={(v) => setValue(v[0] ?? value)}
          aria-label="Background blur intensity"
          className="flex-1"
        />
        <span className="text-xs text-gray-500 w-6 text-right tabular-nums">
          {value}
        </span>
      </div>
      <ActionButton
        onClick={() => bundle.onBlurApply(value)}
        disabled={!bundle.hasImage}
        loading={busy}
      >
        Apply blur
      </ActionButton>
      <p className="text-[11px] text-gray-400 mt-2">Free — no credit needed.</p>
    </div>
  )
}

/* ---------------- Colorize panel ---------------- */

function ColorizePanel({ bundle }: { bundle: PanelBundle }) {
  const busy = bundle.processing !== null
  return (
    <div>
      <h3 className="font-semibold text-sm mb-3 text-neutral-900">Colorize photo</h3>
      <p className="text-xs text-gray-500 mb-4">
        Add natural, realistic color to black and white photos. Skin, clothing,
        and scenery get plausible colors while faces stay exactly as they are.
      </p>
      <ActionButton
        onClick={bundle.onColorize}
        disabled={!bundle.hasImage}
        loading={busy}
      >
        <Palette className="w-4 h-4" aria-hidden="true" />
        Colorize photo
      </ActionButton>
      <p className="text-[11px] text-gray-400 mt-2">Free — no credit needed.</p>
    </div>
  )
}

/* ---------------- Restore panel ---------------- */

function RestorePanel({ bundle }: { bundle: PanelBundle }) {
  const busy = bundle.processing !== null
  const [colorize, setColorize] = useState(true)
  return (
    <div>
      <h3 className="font-semibold text-sm mb-3 text-neutral-900">Restore photo</h3>
      <p className="text-xs text-gray-500 mb-4">
        Repair scratches, tears, stains, and fading on old photos — without
        changing the subject's face or identity.
      </p>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-500">Add color after restoring</span>
        <Switch
          checked={colorize}
          onCheckedChange={setColorize}
          aria-label="Colorize after restore"
        />
      </div>
      <ActionButton
        onClick={() => bundle.onRestore(colorize)}
        disabled={!bundle.hasImage}
        loading={busy}
      >
        <History className="w-4 h-4" aria-hidden="true" />
        Restore photo
      </ActionButton>
      <p className="text-[11px] text-gray-400 mt-2">Free — no credit needed.</p>
    </div>
  )
}

/* ---------------- Recolor panel ---------------- */

function RecolorPanel({ bundle }: { bundle: PanelBundle }) {
  const busy = bundle.processing !== null
  const [target, setTarget] = useState("")
  const [color, setColor] = useState(RECOLOR_COLORS[0].hex)
  return (
    <div>
      <h3 className="font-semibold text-sm mb-3 text-neutral-900">Recolor</h3>
      <label htmlFor="recolor-target" className="text-sm text-gray-600 block mb-2">
        Which item should we recolor?
      </label>
      <Input
        id="recolor-target"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="e.g. the shirt"
        disabled={busy}
        className="mb-4"
      />
      <p className="text-sm text-gray-600 block mb-2">Pick a color</p>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {RECOLOR_COLORS.map((swatch) => (
          <button
            key={swatch.hex}
            type="button"
            title={swatch.label}
            aria-label={`Recolor to ${swatch.label}`}
            aria-pressed={color === swatch.hex}
            disabled={busy}
            onClick={() => setColor(swatch.hex)}
            className={cn(
              "w-8 h-8 rounded-full border transition disabled:opacity-40",
              color === swatch.hex
                ? "ring-2 ring-offset-2 ring-neutral-900 border-neutral-400"
                : "border-gray-200 hover:border-gray-400"
            )}
            style={{ backgroundColor: swatch.hex }}
          />
        ))}
      </div>
      <ActionButton
        onClick={() => bundle.onRecolor(target, color)}
        disabled={!bundle.hasImage || !target.trim()}
        loading={busy}
      >
        Recolor item
      </ActionButton>
      <p className="text-[11px] text-gray-400 mt-2">Free — no credit needed.</p>
    </div>
  )
}

/* ---------------- Resize panel ---------------- */

function ResizePanel({ bundle }: { bundle: PanelBundle }) {
  const busy = bundle.processing !== null
  const [preset, setPreset] = useState<string | null>(null)
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [fit, setFit] = useState<"cover" | "contain">("cover")

  const customValid =
    (width.trim().length > 0 || height.trim().length > 0) &&
    (width.trim() === "" || (/^\d+$/.test(width) && Number(width) > 0)) &&
    (height.trim() === "" || (/^\d+$/.test(height) && Number(height) > 0))

  function apply() {
    if (preset) {
      bundle.onResize({ preset })
    } else {
      bundle.onResize({
        width: width.trim() ? Number(width) : undefined,
        height: height.trim() ? Number(height) : undefined,
        fit,
      })
    }
  }

  return (
    <div>
      <h3 className="font-semibold text-sm mb-3 text-neutral-900">Resize image</h3>
      <p className="text-xs text-gray-500 mb-3">
        Ready-made sizes for every platform, or enter exact pixel dimensions.
      </p>
      <div className="space-y-1.5 max-h-64 overflow-y-auto pc-scroll pr-1">
        {RESIZE_PRESETS.map((option) => (
          <button
            key={option.key}
            type="button"
            disabled={busy}
            onClick={() => {
              setPreset(preset === option.key ? null : option.key)
              setWidth("")
              setHeight("")
            }}
            aria-pressed={preset === option.key}
            className={cn(
              "w-full flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition disabled:opacity-50",
              preset === option.key
                ? "border-black bg-black text-white"
                : "border-gray-200 text-gray-700 hover:border-gray-400"
            )}
          >
            <span>{option.label}</span>
            <span
              className={cn(
                "text-xs tabular-nums",
                preset === option.key ? "text-neutral-300" : "text-gray-400"
              )}
            >
              {option.dims}
            </span>
          </button>
        ))}
      </div>

      <div className="border-t border-gray-100 mt-3 pt-3">
        <p className="text-sm text-gray-600 mb-2">Custom size</p>
        <div className="flex items-center gap-2 mb-2">
          <Input
            type="text"
            inputMode="numeric"
            value={width}
            onChange={(e) => {
              setWidth(e.target.value)
              setPreset(null)
            }}
            placeholder="Width"
            aria-label="Target width in pixels"
            disabled={busy}
            className="h-9"
          />
          <span className="text-gray-400" aria-hidden="true">×</span>
          <Input
            type="text"
            inputMode="numeric"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value)
              setPreset(null)
            }}
            placeholder="Height"
            aria-label="Target height in pixels"
            disabled={busy}
            className="h-9"
          />
        </div>
        {width.trim() !== "" && height.trim() !== "" && (
          <div className="flex gap-1.5 mb-2">
            <button
              type="button"
              onClick={() => setFit("cover")}
              aria-pressed={fit === "cover"}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium border transition",
                fit === "cover"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
              )}
            >
              Crop to fill
            </button>
            <button
              type="button"
              onClick={() => setFit("contain")}
              aria-pressed={fit === "contain"}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium border transition",
                fit === "contain"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
              )}
            >
              Fit with padding
            </button>
          </div>
        )}
      </div>

      <ActionButton
        onClick={apply}
        disabled={!bundle.hasImage || (!preset && !customValid)}
        loading={busy}
      >
        Resize image
      </ActionButton>
      <p className="text-[11px] text-gray-400 mt-2">Free — no credit needed.</p>
    </div>
  )
}

/* ---------------- Try-on panel ---------------- */

function TryOnPanel({ bundle }: { bundle: PanelBundle }) {
  const busy = bundle.processing !== null
  const [garment, setGarment] = useState("")
  const [model, setModel] = useState("")
  return (
    <div>
      <h3 className="font-semibold text-sm mb-3 text-neutral-900">Virtual try-on</h3>
      <label htmlFor="tryon-garment" className="text-sm text-gray-600 block mb-2">
        What should they wear?
      </label>
      <textarea
        id="tryon-garment"
        value={garment}
        onChange={(e) => setGarment(e.target.value)}
        rows={2}
        placeholder="e.g. an elegant coral summer dress"
        disabled={busy}
        className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 resize-none mb-2"
      />
      <div className="flex flex-wrap gap-1.5 mb-3">
        {TRYON_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            disabled={busy}
            onClick={() => setGarment(preset)}
            className="rounded-full px-2.5 py-1 text-xs border border-gray-200 text-gray-600 hover:border-gray-400 transition disabled:opacity-50"
          >
            {preset.replace(/^(a|an) /, "").slice(0, 24)}
          </button>
        ))}
      </div>
      <label htmlFor="tryon-model" className="text-sm text-gray-600 block mb-2">
        Model look (optional)
      </label>
      <Input
        id="tryon-model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        placeholder="e.g. a young woman with curly hair"
        disabled={busy}
        className="mb-3"
      />
      <ActionButton
        onClick={() => bundle.onTryOn(garment, model)}
        disabled={!bundle.hasImage || !garment.trim()}
        loading={busy}
      >
        <Shirt className="w-4 h-4" aria-hidden="true" />
        Try it on · 1 credit
      </ActionButton>
      <p className="text-[11px] text-gray-400 mt-2">
        Uses 1 credit. Sign in required.
      </p>
    </div>
  )
}

/* ---------------- Profile picture panel ---------------- */

function ProfilePanel({ bundle }: { bundle: PanelBundle }) {
  const busy = bundle.processing !== null
  const [style, setStyle] = useState(PROFILE_STYLES[0].key)
  return (
    <div>
      <h3 className="font-semibold text-sm mb-3 text-neutral-900">Profile picture</h3>
      <p className="text-xs text-gray-500 mb-3">
        Turn any selfie into a polished headshot. The face stays yours — only
        the framing, light, and background change.
      </p>
      <div className="space-y-1.5 mb-4">
        {PROFILE_STYLES.map((option) => (
          <button
            key={option.key}
            type="button"
            disabled={busy}
            onClick={() => setStyle(option.key)}
            aria-pressed={style === option.key}
            className={cn(
              "w-full text-left rounded-lg border px-3 py-2 transition disabled:opacity-50",
              style === option.key
                ? "border-black bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
            )}
          >
            <span className="text-sm font-medium text-neutral-900 block">
              {option.label}
            </span>
            <span className="text-xs text-gray-500">{option.hint}</span>
          </button>
        ))}
      </div>
      <ActionButton
        onClick={() => bundle.onProfilePicture(style)}
        disabled={!bundle.hasImage}
        loading={busy}
      >
        <ScanFace className="w-4 h-4" aria-hidden="true" />
        Make profile picture
      </ActionButton>
      <p className="text-[11px] text-gray-400 mt-2">Free — no credit needed.</p>
    </div>
  )
}

/* ---------------- Switcher ---------------- */

export function PanelContent({
  panel,
  bundle,
}: {
  panel: PanelId
  bundle: PanelBundle
}) {
  switch (panel) {
    case "background":
      return <BackgroundPanel bundle={bundle} />
    case "retouch":
      return <RetouchPanel bundle={bundle} />
    case "expand":
      return <ExpandPanel bundle={bundle} />
    case "upscale":
      return <UpscalePanel bundle={bundle} />
    case "enhance":
      return <EnhancePanel bundle={bundle} />
    case "blur":
      return <BlurPanel bundle={bundle} />
    case "colorize":
      return <ColorizePanel bundle={bundle} />
    case "restore":
      return <RestorePanel bundle={bundle} />
    case "recolor":
      return <RecolorPanel bundle={bundle} />
    case "resize":
      return <ResizePanel bundle={bundle} />
    case "tryon":
      return <TryOnPanel bundle={bundle} />
    case "profile":
      return <ProfilePanel bundle={bundle} />
  }
}
