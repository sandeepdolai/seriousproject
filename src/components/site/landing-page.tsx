"use client"

import { useState } from "react"
import {
  ArrowUp,
  Calendar,
  Folder,
  House,
  Layers,
  PenTool,
  Play,
  Plus,
  Search,
  Sparkles,
  Upload,
  Users,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BeforeAfterSlider } from "@/components/site/before-after-slider"
import { FadeIn } from "@/components/site/fade-in"
import { LogoRow } from "@/components/site/logo-row"
import { Testimonials } from "@/components/site/testimonials"
import { VideoCard } from "@/components/site/video-card"
import { useToast } from "@/hooks/use-toast"
import { useRouter, ROUTES } from "@/lib/router"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* App demo mockup data                                                */
/* ------------------------------------------------------------------ */

const DEMO_ITEMS = [
  { img: 1, prompt: "Create lifestyle shots for fall collection", time: "2h ago" },
  { img: 2, prompt: "Create lifestyle shots for fall collection", time: "2h ago" },
  { img: 3, prompt: "Design a cozy living space", time: "1h ago" },
  { img: 4, prompt: "Design a cozy living space", time: "1h ago" },
  { img: 5, prompt: "Put these gold rings on a model", time: "30m ago" },
  { img: 6, prompt: "Put these gold rings on a model", time: "30m ago" },
  { img: 7, prompt: "Put these gold rings on a model", time: "Just now" },
  { img: 8, prompt: "Put these gold rings on a model", time: "Just now" },
]

function DemoGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "grid gap-5",
        compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"
      )}
    >
      {(compact ? DEMO_ITEMS.slice(0, 4) : DEMO_ITEMS).map((item) => (
        <div key={item.img} className="group text-left">
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <img
              src={`/images/hero-grid-${item.img}.png`}
              alt={item.prompt}
              loading="lazy"
              draggable={false}
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <p className="mt-2.5 line-clamp-2 text-sm font-medium text-gray-900">
            {item.prompt}
          </p>
          <p className="text-xs text-gray-400">{item.time}</p>
        </div>
      ))}
    </div>
  )
}

function PromptBar({
  value,
  onChange,
  onSubmit,
  compact = false,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  compact?: boolean
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className={cn(
        "flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 shadow-sm sm:gap-3 sm:px-4 sm:py-2.5",
        compact && "px-3 py-2"
      )}
    >
      <button
        type="button"
        aria-label="Add files"
        onClick={onSubmit}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
      >
        <Plus className="h-4 w-4" />
      </button>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Create or edit..."
        aria-label="Create or edit prompt"
        className="h-7 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
      <span className="hidden shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 sm:inline">
        9:16
      </span>
      <span className="hidden shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 sm:inline">
        4
      </span>
      <button
        type="submit"
        aria-label="Generate"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </form>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: typeof House
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-gray-100 font-medium text-gray-900"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </button>
  )
}

function AppDemoMockup() {
  const { navigate } = useRouter()
  const { toast } = useToast()
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop")
  const [prompt, setPrompt] = useState("")

  const goGenerate = () => navigate(ROUTES.generate)

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-20">
      <FadeIn>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_70px_-20px_rgba(17,24,39,0.18)]">
          {device === "desktop" ? (
            <div className="flex min-h-[600px]">
              {/* Sidebar */}
              <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-100 md:flex">
                <div className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.home)}
                    className="text-base font-semibold text-gray-900"
                  >
                    Pixelcut
                  </button>
                </div>
                <nav className="space-y-1 px-3" aria-label="Demo app">
                  <SidebarItem
                    icon={House}
                    label="Home"
                    onClick={() => navigate(ROUTES.home)}
                  />
                  <SidebarItem
                    icon={Sparkles}
                    label="Generate"
                    active
                    onClick={goGenerate}
                  />
                  <SidebarItem
                    icon={Upload}
                    label="Upload"
                    onClick={() => navigate(ROUTES.editor)}
                  />
                  <SidebarItem
                    icon={Layers}
                    label="Batch"
                    onClick={() => navigate(ROUTES.magicEraser)}
                  />
                </nav>
                <div className="mt-6 px-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Folders
                  </p>
                  <div className="mt-2 space-y-1">
                    <SidebarItem
                      icon={Folder}
                      label="Brand Assets"
                      onClick={goGenerate}
                    />
                    <SidebarItem
                      icon={Search}
                      label="Explorations"
                      onClick={goGenerate}
                    />
                    <SidebarItem
                      icon={Calendar}
                      label="Fall 2026"
                      onClick={goGenerate}
                    />
                  </div>
                </div>
                <div className="mt-6 px-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Brand
                  </p>
                  <div className="mt-2 space-y-1">
                    <SidebarItem
                      icon={PenTool}
                      label="Brand Identity"
                      onClick={goGenerate}
                    />
                    <SidebarItem
                      icon={Users}
                      label="Personas"
                      onClick={goGenerate}
                    />
                  </div>
                </div>
                <div className="mt-auto space-y-2 p-4">
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.pricing)}
                    className="w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    Get more credits
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      toast({
                        title: "Team invites coming soon",
                        description:
                          "Invite Team is a stub in this recreation.",
                      })
                    }
                    className="w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    Invite Team
                  </button>
                </div>
              </aside>

              {/* Main area */}
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="p-6 pb-4 md:p-8 md:pb-4">
                  <h2 className="mb-6 text-xl font-semibold text-gray-900">
                    Generate
                  </h2>
                  <DemoGrid />
                </div>
                <div className="mt-auto border-t border-gray-100 p-4">
                  <PromptBar
                    value={prompt}
                    onChange={setPrompt}
                    onSubmit={goGenerate}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Mobile device preview */
            <div className="flex min-h-[600px] items-center justify-center bg-gray-50 p-6 md:p-10">
              <div className="w-full max-w-[320px] overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.home)}
                    className="text-sm font-semibold text-gray-900"
                  >
                    Pixelcut
                  </button>
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs font-bold text-white"
                    aria-hidden="true"
                  >
                    P
                  </span>
                </div>
                <div className="p-4">
                  <h2 className="mb-4 text-base font-semibold text-gray-900">
                    Generate
                  </h2>
                  <DemoGrid compact />
                </div>
                <div className="border-t border-gray-100 p-3">
                  <PromptBar
                    value={prompt}
                    onChange={setPrompt}
                    onSubmit={goGenerate}
                    compact
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </FadeIn>

      {/* Desktop / Mobile toggle */}
      <div className="mt-6 flex justify-center">
        <Tabs
          value={device}
          onValueChange={(v) => setDevice(v as "desktop" | "mobile")}
        >
          <TabsList className="h-auto gap-1 rounded-full bg-transparent p-1">
            <TabsTrigger
              value="desktop"
              className="rounded-full px-4 py-1.5 text-sm data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-none"
            >
              Desktop
            </TabsTrigger>
            <TabsTrigger
              value="mobile"
              className="rounded-full px-4 py-1.5 text-sm data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-none"
            >
              Mobile
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section data                                                        */
/* ------------------------------------------------------------------ */

const WORKFLOWS = [
  {
    image: "/images/workflow-product.png",
    title: "Product Showcase",
    description:
      "Bring your products to life with studio-grade imagery, generated with just a prompt",
    href: ROUTES.aiProductPhotography,
  },
  {
    image: "/images/workflow-ugc.png",
    title: "AI UGC Ads",
    description: "Create talking videos to promote your brand in seconds",
    href: ROUTES.aiAds,
  },
  {
    image: "/images/workflow-personas.png",
    title: "Personas",
    description:
      "Create custom personas that can be consistent across your content",
    href: ROUTES.aiImageGenerator,
  },
]

const EDITS: {
  title: string
  href?: string
  desc: string
  before: string
  after: string
}[] = [
  {
    title: "Background Removal",
    href: ROUTES.backgroundRemover,
    desc: "Remove backgrounds instantly with pixel-perfect cutouts, ready for your store, ads, and marketplaces.",
    before: "/images/ba-bg-before.png",
    after: "/images/ba-bg-after.png",
  },
  {
    title: "Upscale",
    href: ROUTES.imageUpscaler,
    desc: "High quality upscaling up to 16x resolution, choose from a range of models including Topaz.",
    before: "/images/ba-upscale-before.png",
    after: "/images/ba-upscale-after.png",
  },
  {
    title: "Expand",
    href: ROUTES.uncrop,
    desc: "Reframe your images using our proprietary expand tool to extend beyond the edges of your frame.",
    before: "/images/ba-expand-before.png",
    after: "/images/ba-expand-after.png",
  },
  {
    title: "Retouching",
    href: ROUTES.magicEraser,
    desc: "Precise AI retouch, can easily erase or edit using generative fill.",
    before: "/images/ba-retouch-before.png",
    after: "/images/ba-retouch-after.png",
  },
  {
    title: "Shadows",
    desc: "Precise shadow generation.",
    before: "/images/ba-shadow-before.png",
    after: "/images/ba-shadow-after.png",
  },
  {
    title: "Batch Editing",
    desc: "Perform edits across hundreds of files at once.",
    before: "/images/ba-batch-before.png",
    after: "/images/ba-batch-after.png",
  },
]

const BRAND_CARDS = [
  {
    image: "/images/brand-ai-actor.png",
    title: "AI Actors",
    description:
      "Every image and video infused with deep understanding of your character and brand.",
  },
  {
    image: "/images/brand-product-photos.png",
    title: "AI Product Photos",
    description:
      "Generate unlimited product images with perfect character consistency across every shot.",
  },
  {
    image: "/images/brand-video.png",
    title: "On-Brand Videos",
    description:
      "Create engaging video content where your character stays consistent from frame to frame.",
  },
]

const MOSAIC: { src: string; tall?: boolean }[] = [
  { src: "/images/mosaic-1.png", tall: true },
  { src: "/images/hero-grid-1.png" },
  { src: "/images/usecase-hair.png" },
  { src: "/images/mosaic-2.png" },
  { src: "/images/usecase-products.png" },
  { src: "/images/hero-grid-3.png" },
  { src: "/images/mosaic-3.png" },
  { src: "/images/usecase-animals.png" },
  { src: "/images/hero-grid-5.png" },
  { src: "/images/mosaic-4.png", tall: true },
  { src: "/images/usecase-people.png" },
  { src: "/images/hero-grid-7.png" },
  { src: "/images/mosaic-5.png" },
  { src: "/images/usecase-cars.png" },
  { src: "/images/hero-grid-2.png" },
  { src: "/images/mosaic-6.png" },
  { src: "/images/usecase-graphics.png" },
  { src: "/images/hero-grid-4.png" },
  { src: "/images/hero-grid-6.png" },
  { src: "/images/hero-grid-8.png", tall: true },
]

/* ------------------------------------------------------------------ */
/* Landing page                                                        */
/* ------------------------------------------------------------------ */

export function LandingPage() {
  const { navigate } = useRouter()
  const { toast } = useToast()
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <div className="bg-white">
      {/* 1. Hero */}
      <section className="px-6 pt-32 pb-20 text-center md:pt-36">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-gray-900 md:text-6xl">
              Create Studio-Quality Visuals with AI
            </h1>
            <p className="mt-6 text-lg text-gray-500 md:text-xl">
              Join 70 million sellers making images and videos with AI.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(ROUTES.generate)}
                className="w-full rounded-full bg-black px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg sm:w-auto"
              >
                Start creating
              </button>
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50 sm:w-auto"
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100"
                  aria-hidden="true"
                >
                  <Play className="h-3 w-3 fill-gray-700 text-gray-700" />
                </span>
                Watch video
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. App demo mockup + Desktop/Mobile toggle */}
      <AppDemoMockup />

      {/* 3. Logo row */}
      <LogoRow />

      {/* 4. Creative Agent */}
      <section className="px-4 py-10 md:px-6" aria-labelledby="creative-agent-heading">
        <div className="mx-auto max-w-[1400px]">
          <FadeIn>
            <div className="pc-gradient-agent rounded-3xl px-6 py-16 text-center md:py-24">
              <span className="inline-flex items-center rounded-full bg-white/60 px-3 py-1 text-sm font-medium text-gray-800 backdrop-blur-sm">
                Creative Agent
              </span>
              <h2
                id="creative-agent-heading"
                className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl"
              >
                Smarter than your average tool
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">
                Pixelcut understands your prompts, plans and executes tasks on
                your behalf using the best creative tools available like Nano
                Banana Pro and Sora 2. No special prompting required.
              </p>
              <div className="relative mx-auto mt-10 max-w-4xl">
                <div className="overflow-hidden rounded-2xl border border-white/60 shadow-2xl">
                  <img
                    src="/images/video-agent.png"
                    alt="Creative Agent planning and executing visual tasks"
                    loading="lazy"
                    className="aspect-video w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Play the Creative Agent video"
                  onClick={() =>
                    toast({
                      title: "Video coming soon",
                      description:
                        "The Creative Agent video is a stub in this recreation.",
                    })
                  }
                  className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/80 text-white transition-transform duration-300 hover:scale-110"
                >
                  <Play className="h-6 w-6 fill-white" aria-hidden="true" />
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5. Workflows */}
      <section
        className="mx-auto max-w-[1400px] px-6 py-16 md:py-20"
        aria-labelledby="workflows-heading"
      >
        <FadeIn>
          <h2
            id="workflows-heading"
            className="text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
          >
            Image &amp; Video Workflows That Deliver
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6">
            {WORKFLOWS.map((w) => (
              <VideoCard
                key={w.title}
                image={w.image}
                title={w.title}
                description={w.description}
                href={w.href}
              />
            ))}
          </div>
        </FadeIn>
      </section>

      {/* 6. Everyday edits — before/after sliders */}
      <section
        className="mx-auto max-w-[1200px] px-6 py-16 md:py-20"
        aria-labelledby="edits-heading"
      >
        <FadeIn>
          <h2
            id="edits-heading"
            className="text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
          >
            Everyday Edits,
            <br />
            World-Class Models
          </h2>
        </FadeIn>
        <div className="mt-12 space-y-14 md:mt-16 md:space-y-20">
          {EDITS.map((edit, i) => (
            <FadeIn key={edit.title}>
              <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                <div className={cn(i % 2 === 1 && "md:order-2")}>
                  {edit.href ? (
                    <button
                      type="button"
                      onClick={() => navigate(edit.href as string)}
                      className="text-left text-xl font-semibold text-gray-900 transition-colors hover:text-gray-700 hover:underline md:text-2xl"
                    >
                      {edit.title}
                    </button>
                  ) : (
                    <h3 className="text-xl font-semibold text-gray-900 md:text-2xl">
                      {edit.title}
                    </h3>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
                    {edit.desc}
                  </p>
                </div>
                <div className={cn(i % 2 === 1 && "md:order-1")}>
                  <BeforeAfterSlider
                    before={edit.before}
                    after={edit.after}
                    alt={edit.title}
                  />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 7. Keep Products On-Brand */}
      <section
        className="mx-auto max-w-[1400px] px-6 py-16 md:py-20"
        aria-labelledby="onbrand-heading"
      >
        <FadeIn>
          <h2
            id="onbrand-heading"
            className="text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
          >
            Keep Products On-Brand
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-6">
            {BRAND_CARDS.map((card) => (
              <div key={card.title} className="group">
                <div className="overflow-hidden rounded-2xl border border-gray-100">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    draggable={false}
                    className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* 8. Mosaic */}
      <section
        className="mx-auto max-w-[1400px] px-6 py-16 md:py-20"
        aria-labelledby="mosaic-heading"
      >
        <FadeIn>
          <h2
            id="mosaic-heading"
            className="text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
          >
            Millions of images created every day
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-10 grid auto-rows-[110px] grid-cols-3 gap-2 [grid-auto-flow:dense] sm:auto-rows-[130px] md:auto-rows-[150px] md:grid-cols-6">
            {MOSAIC.map((m) => (
              <div
                key={m.src}
                className={cn(
                  "group relative overflow-hidden rounded-xl",
                  m.tall && "row-span-2"
                )}
              >
                <img
                  src={m.src}
                  alt="Example image created with Pixelcut"
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* 9. Testimonials */}
      <Testimonials />

      {/* 10. Final CTA */}
      <section
        className="px-6 py-20 text-center md:py-24"
        aria-labelledby="final-cta-heading"
      >
        <FadeIn>
          <h2
            id="final-cta-heading"
            className="text-4xl font-bold tracking-tight text-gray-900"
          >
            Start creating for free
          </h2>
          <button
            type="button"
            onClick={() => navigate(ROUTES.generate)}
            className="mt-6 rounded-full bg-black px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg"
          >
            Start creating
          </button>
        </FadeIn>
      </section>

      {/* Watch video dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-3xl gap-0 rounded-2xl p-4">
          <DialogTitle className="sr-only">
            Pixelcut product video
          </DialogTitle>
          <DialogDescription className="sr-only">
            A short overview of what you can create with Pixelcut.
          </DialogDescription>
          <div className="relative overflow-hidden rounded-xl bg-gray-900">
            <img
              src="/images/video-agent.png"
              alt="Pixelcut product video poster"
              className="aspect-video w-full object-cover opacity-90"
            />
            <button
              type="button"
              aria-label="Play video"
              onClick={() =>
                toast({
                  title: "Video coming soon",
                  description:
                    "The product tour video is a stub in this recreation.",
                })
              }
              className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/80 text-white transition-transform duration-300 hover:scale-110"
            >
              <Play className="h-6 w-6 fill-white" aria-hidden="true" />
            </button>
            <p className="absolute bottom-4 left-4 text-sm font-medium text-white">
              See what you can create with Pixelcut
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
