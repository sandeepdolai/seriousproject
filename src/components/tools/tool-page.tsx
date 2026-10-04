"use client"

import { useRef, useState } from "react"
import type { RouteState } from "@/lib/router"
import { useRouter } from "@/lib/router"
import { useToast } from "@/hooks/use-toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Check,
  ChevronRight,
  Download,
  Smartphone,
  Sparkles,
  Star,
  Zap,
  Code2,
  ArrowUp,
} from "lucide-react"
import type { ToolConfig } from "./tool-configs"
import { UploadZone } from "./upload-zone"
import { cn } from "@/lib/utils"

const STAR_ICONS = [0, 1, 2, 3, 4]

export function ToolPage({
  config,
  route,
}: {
  config: ToolConfig
  route: RouteState
}) {
  const { navigate } = useRouter()
  const { toast } = useToast()
  const uploadRef = useRef<HTMLDivElement>(null)
  const [prompt, setPrompt] = useState("")
  const isGenerator = config.editorTool === "generate"
  const isVideoTool = config.accepts === "video"

  function scrollTop() {
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  function badgeIcon(badge: string) {
    const lower = badge.toLowerCase()
    if (lower.includes("download") || lower.includes("free")) return <Download className="w-3.5 h-3.5" aria-hidden="true" />
    if (lower.includes("ai") || lower.includes("model")) return <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
    return <Check className="w-3.5 h-3.5" aria-hidden="true" />
  }

  return (
    <div className="pt-24 md:pt-28 max-w-6xl mx-auto px-6 pb-20 w-full">
      {/* ---------- Hero ---------- */}
      <section aria-labelledby="tool-h1" className="w-full">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400 mb-4">
          <button
            type="button"
            onClick={() => navigate("/background-remover")}
            className="hover:text-gray-600 transition"
          >
            Tools
          </button>
          <ChevronRight className="inline w-3.5 h-3.5 mx-0.5 -mt-0.5" aria-hidden="true" />
          <span className="text-gray-500">{config.name}</span>
        </nav>

        <div className={cn("grid gap-8 md:gap-12 items-center", config.samples.length > 0 && "lg:grid-cols-2")}>
          <div>
            <h1
              id="tool-h1"
              className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900"
            >
              {config.h1}
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mt-4 leading-relaxed">
              {config.description}
            </p>
            {config.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {config.badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700"
                  >
                    {badgeIcon(badge)}
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
          {config.samples.length > 0 && (
            <div className="hidden md:block">
              <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm max-w-md mx-auto lg:ml-auto lg:mr-0">
                { }
                <img
                  src={config.samples[0]}
                  alt={`${config.name} example`}
                  className="w-full aspect-square object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* ---------- Upload zone ---------- */}
        <div ref={uploadRef} className="mt-10 md:mt-14">
          {isGenerator ? (
            <GeneratorPrompt
              value={prompt}
              onChange={setPrompt}
              onGenerate={() => navigate("/generate", prompt ? { prompt } : undefined)}
            />
          ) : (
            <UploadZone config={config} />
          )}
        </div>

        {/* ---------- Social proof row ---------- */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500">
          <span>Trusted by 70 million people</span>
          <span className="flex items-center gap-0.5" aria-label="4.8 out of 5 stars">
            {STAR_ICONS.map((i) => (
              <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" aria-hidden="true" />
            ))}
          </span>
          <span>918,707 Reviews</span>
          <button
            type="button"
            onClick={() =>
              toast({
                title: "Developer API",
                description:
                  "Pixelcut's background remover API is a documented external dependency in this build.",
              })
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:border-gray-400 transition"
          >
            <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
            Developer API
          </button>
          <button
            type="button"
            onClick={() =>
              toast({
                title: "Pixelcut mobile apps",
                description:
                  "Available on the App Store and Google Play — external links are stubbed in this build.",
              })
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:border-gray-400 transition"
          >
            <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
            Available on iPhone & Android
          </button>
        </div>
      </section>

      {/* ---------- Generator gallery + models ---------- */}
      {isGenerator && (
        <section className="mt-16" aria-label="Example generations">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center">
            Made with Pixelcut
          </h2>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {config.samples.map((path) => (
              <div
                key={path}
                className="rounded-2xl overflow-hidden border border-gray-200 group"
              >
                { }
                <img
                  src={path}
                  alt="AI generated example"
                  className="w-full aspect-square object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
          {config.models && (
            <div className="mt-10 text-center">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Powered by leading AI models
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {config.models.map((model) => (
                  <span
                    key={model}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-700"
                  >
                    <Zap className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
                    {model}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="mt-10">
            <UploadZone config={config} />
          </div>
        </section>
      )}

      {/* ---------- How to ---------- */}
      <section className="mt-16 md:mt-24" aria-labelledby="howto-h2">
        <h2 id="howto-h2" className="text-2xl md:text-3xl font-bold tracking-tight text-center">
          How to {isVideoTool ? "remove a video background" : `use the ${config.name}`}
        </h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {config.howTo.map((step, index) => (
            <div key={step.title} className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full bg-black text-white text-sm font-semibold flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <h3 className="font-semibold text-neutral-900">{step.title}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-3">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Use case tabs ---------- */}
      {config.useCaseTabs && config.useCaseTabs.length > 0 && (
        <section className="mt-16 md:mt-24" aria-labelledby="usecases-h2">
          <h2 id="usecases-h2" className="text-2xl md:text-3xl font-bold tracking-tight text-center">
            Perfect cutouts for every image
          </h2>
          <Tabs defaultValue={config.useCaseTabs[0].label} className="mt-8 w-full">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0 justify-center">
              {config.useCaseTabs.map((tab) => (
                <TabsTrigger
                  key={tab.label}
                  value={tab.label}
                  className="rounded-full px-4 py-1.5 border border-gray-200 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:border-black text-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {config.useCaseTabs.map((tab) => (
              <TabsContent key={tab.label} value={tab.label} className="mt-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  { }
                  <img
                    src={tab.image}
                    alt={tab.label}
                    className="w-full rounded-2xl border border-gray-200 object-cover max-h-96"
                  />
                  <div className="md:pl-2">
                    <h3 className="text-xl font-semibold text-neutral-900">{tab.label}</h3>
                    <p className="text-gray-600 leading-relaxed mt-3">{tab.text}</p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      )}

      {/* ---------- Features ---------- */}
      <section className="mt-16 md:mt-24" aria-labelledby="features-h2">
        <h2 id="features-h2" className="text-2xl md:text-3xl font-bold tracking-tight text-center">
          Why choose {config.name}
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {config.features.map((feature) => (
            <div key={feature.title} className="bg-gray-50 rounded-2xl p-6">
              <Sparkles className="w-5 h-5 text-gray-400 mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-neutral-900">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- SEO sections ---------- */}
      {config.seoSections && config.seoSections.length > 0 && (
        <div className="mt-16 md:mt-24 max-w-3xl mx-auto space-y-14">
          {config.seoSections.map((section, index) => (
            <section key={section.h2} aria-labelledby={`seo-${index}`}>
              <h2 id={`seo-${index}`} className="text-2xl md:text-3xl font-bold tracking-tight">
                {section.h2}
              </h2>
              {section.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-gray-600 leading-relaxed mt-4">
                  {paragraph}
                </p>
              ))}
              {section.image && (
                <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200">
                  { }
                  <img src={section.image} alt="" className="w-full object-cover max-h-80" />
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {/* ---------- FAQ ---------- */}
      <section className="mt-16 md:mt-24" aria-labelledby="faq-h2">
        <h2 id="faq-h2" className="text-2xl md:text-3xl font-bold tracking-tight text-center">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="mt-8 max-w-3xl mx-auto">
          {config.faqs.map((faq, index) => (
            <AccordionItem
              key={faq.q}
              value={`faq-${index}`}
              className="border border-gray-200 rounded-xl px-5 mb-3 last:mb-0 bg-white"
            >
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ---------- Bottom CTA ---------- */}
      <section className="mt-16 md:mt-24 text-center" aria-label="Call to action">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Try the {config.name} free
        </h2>
        <p className="text-gray-500 mt-3">
          No sign-up required. Upload an image and see the results in seconds.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={scrollTop}
            className="h-11 px-8 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
          >
            {isGenerator ? "Start generating" : `Try ${config.name} free`}
          </button>
          {isVideoTool && (
            <button
              type="button"
              onClick={() => navigate("/background-remover")}
              className="h-11 px-8 rounded-full border border-gray-200 bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 transition"
            >
              Use images instead
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

function GeneratorPrompt({
  value,
  onChange,
  onGenerate,
}: {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
}) {
  return (
    <div className="max-w-2xl mx-auto rounded-2xl bg-neutral-900 p-4 shadow-xl">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder="Describe the image you want to create… be detailed for best results"
        className="w-full bg-transparent text-white placeholder:text-neutral-500 text-sm resize-none outline-none"
        aria-label="Image prompt"
      />
      <div className="flex items-center justify-between mt-2 gap-2">
        <span className="text-xs text-neutral-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          Nano Banana, Flux 2 Pro, Ideogram & more
        </span>
        <button
          type="button"
          onClick={onGenerate}
          className="h-9 px-5 rounded-full bg-white text-black text-sm font-medium hover:bg-neutral-200 transition inline-flex items-center gap-2"
        >
          <ArrowUp className="w-4 h-4" aria-hidden="true" />
          Generate
        </button>
      </div>
    </div>
  )
}
