"use client"

import { useState } from "react"
import {
  Check,
  ChevronDown,
  Headphones,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Testimonials } from "@/components/site/testimonials"
import { FadeIn } from "@/components/site/fade-in"
import { useAuthStore } from "@/stores/auth"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type Period = "monthly" | "yearly"

const FREE_FEATURES = [
  "Limited Background Removal",
  "Limited Upscale",
  "Free export without watermark",
]

const PRO_FEATURES = [
  "600 AI Credits Monthly",
  "Access all AI models",
  "Unlimited Background Removal",
  "Unlimited Upscale",
  "3 Person Team",
  "1,000 Batch Exports Monthly",
  "Commercial license",
]

const BUSINESS_FEATURES = [
  "3,600 AI Credits Monthly",
  "Access all AI models",
  "Unlimited Background Removal",
  "Unlimited Upscale",
  "10 Person Team",
  "2,000 Batch Exports Monthly",
  "Commercial license",
]

const CREDIT_PACKS = [
  { value: "3600", label: "3,600 credits / month" },
  { value: "7200", label: "7,200 credits / month" },
  { value: "14400", label: "14,400 credits / month" },
]

/* Comparison table — value is either a string, "check" or "x" */
const COMPARISON: { feature: string; free: string; pro: string; business: string }[] = [
  { feature: "Background Removal", free: "Limited", pro: "check", business: "check" },
  { feature: "Magic Eraser", free: "Limited", pro: "check", business: "check" },
  { feature: "Fast Upscaler", free: "Limited", pro: "check", business: "check" },
  { feature: "Generative Fill", free: "Limited", pro: "300/day", business: "Up to 1200/day" },
  { feature: "Expand Image", free: "Limited", pro: "300/day", business: "Up to 1200/day" },
  { feature: "AI Backgrounds", free: "x", pro: "300/day", business: "Up to 1200/day" },
  { feature: "Pro Eraser", free: "x", pro: "300/day", business: "Up to 1200/day" },
  { feature: "Credits", free: "x", pro: "600/mo", business: "Up to 180000/mo" },
]

/* AI model allowance table (Pro baseline; Business = x6 capped at 180k; Free = none) */
const MODELS: { name: string; pro: number }[] = [
  { name: "Nano Banana 2", pro: 6000 },
  { name: "Nano Banana Pro", pro: 6000 },
  { name: "Nano Banana Lite", pro: 18000 },
  { name: "Flux 2 Pro", pro: 15000 },
  { name: "Flux 2 Flex", pro: 18000 },
  { name: "Flux 2 Klein 4B", pro: 180000 },
  { name: "ChatGPT Image 2", pro: 2068 },
  { name: "ChatGPT Image 2.5", pro: 2068 },
  { name: "Seedream v5 Pro", pro: 5142 },
  { name: "Recraft v4 Pro Vector", pro: 2769 },
  { name: "Luma Photon Flash", pro: 180000 },
  { name: "Qwen Image", pro: 45000 },
  { name: "Z Image Turbo", pro: 90000 },
  { name: "Grok Imagine Image 2.0", pro: 12857 },
  { name: "Muse Image", pro: 60000 },
]

const fmt = (n: number) => n.toLocaleString("en-US")

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex-1 space-y-3">
      {items.map((f) => (
        <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
          <Check
            className="mt-0.5 h-4 w-4 shrink-0 text-gray-900"
            aria-hidden="true"
          />
          {f}
        </li>
      ))}
    </ul>
  )
}

function CheckMark() {
  return (
    <span className="inline-flex items-center justify-center" aria-label="Included">
      <Check className="h-4 w-4 text-gray-900" aria-hidden="true" />
      <span className="sr-only">Included</span>
    </span>
  )
}

function CrossMark() {
  return (
    <span className="inline-flex items-center justify-center" aria-label="Not included">
      <X className="h-4 w-4 text-gray-300" aria-hidden="true" />
      <span className="sr-only">Not included</span>
    </span>
  )
}

export function PricingPage() {
  const { toast } = useToast()
  const user = useAuthStore((s) => s.user)
  const setAuthModalOpen = useAuthStore((s) => s.setAuthModalOpen)
  const [period, setPeriod] = useState<Period>("yearly")
  const [creditPack, setCreditPack] = useState("3600")
  const [modelPlan, setModelPlan] = useState("business")

  const handleCheckout = (plan: string) => {
    if (!user) {
      setAuthModalOpen(true, () => {
        toast({
          title: "Checkout requires Stripe configuration",
          description: `The ${plan} plan checkout is a documented stub in this recreation.`,
        })
      })
    } else {
      toast({
        title: "Stripe checkout requires STRIPE_SECRET_KEY configuration",
        description: `The ${plan} plan checkout is a documented stub in this recreation.`,
      })
    }
  }

  const yearly = period === "yearly"

  return (
    <div className="bg-white pb-20">
      <div className="mx-auto max-w-6xl px-6 pt-28">
        {/* Heading */}
        <FadeIn>
          <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Make Pro Visuals
          </h1>
          <h2 className="mt-3 text-center text-xl font-normal text-gray-500">
            Choose the right plan for you
          </h2>
        </FadeIn>

        {/* Monthly / Yearly toggle */}
        <FadeIn delay={0.1}>
          <div className="mt-8 flex justify-center">
            <div
              className="inline-flex rounded-full bg-gray-100 p-1"
              role="tablist"
              aria-label="Billing period"
            >
              <button
                type="button"
                role="tab"
                aria-selected={period === "monthly"}
                onClick={() => setPeriod("monthly")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  period === "monthly"
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={period === "yearly"}
                onClick={() => setPeriod("yearly")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  period === "yearly"
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                Yearly
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-sm font-medium text-blue-600">
            Save 20% with a yearly plan
          </p>
        </FadeIn>

        {/* Plan cards */}
        <FadeIn delay={0.15}>
          <div className="mt-10 grid items-stretch gap-6 md:grid-cols-3">
            {/* Free */}
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8">
              <h3 className="text-lg font-semibold text-gray-900">Free</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">$0</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                per month, billed yearly
              </p>
              <button
                type="button"
                onClick={() => handleCheckout("Free")}
                className="mt-6 w-full rounded-full border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                Continue
              </button>
              <FeatureList items={FREE_FEATURES} />
            </div>

            {/* Pro */}
            <div className="relative flex flex-col rounded-2xl border-2 border-blue-500 bg-white p-8 shadow-[0_20px_50px_-20px_rgba(37,99,235,0.25)]">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </span>
              <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
              <div className="mt-4 flex items-baseline gap-2">
                {yearly && (
                  <span className="text-xl text-gray-400 line-through">
                    $10
                  </span>
                )}
                <span className="text-4xl font-bold text-gray-900">
                  ${yearly ? "8" : "10"}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                per month, billed {yearly ? "yearly" : "monthly"}
              </p>
              <button
                type="button"
                onClick={() => handleCheckout("Pro")}
                className="mt-6 w-full rounded-full bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Upgrade
              </button>
              <FeatureList items={PRO_FEATURES} />
            </div>

            {/* Business */}
            <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8">
              <h3 className="text-lg font-semibold text-gray-900">Business</h3>
              <div className="mt-4 flex items-baseline gap-2">
                {yearly && (
                  <span className="text-xl text-gray-400 line-through">
                    $30
                  </span>
                )}
                <span className="text-4xl font-bold text-gray-900">
                  ${yearly ? "24" : "30"}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                per month, billed {yearly ? "yearly" : "monthly"}
              </p>
              <button
                type="button"
                onClick={() => handleCheckout("Business")}
                className="mt-6 w-full rounded-full bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Upgrade
              </button>
              <div className="mt-4">
                <Select value={creditPack} onValueChange={setCreditPack}>
                  <SelectTrigger
                    className="h-9 w-full rounded-lg text-sm"
                    aria-label="Choose credit pack"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CREDIT_PACKS.map((pack) => (
                      <SelectItem key={pack.value} value={pack.value}>
                        {pack.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FeatureList items={BUSINESS_FEATURES} />
            </div>
          </div>
        </FadeIn>

        {/* Trust row */}
        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-center text-sm text-gray-500">
              Trusted by over 200,000 creators, brands and small businesses
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-1.5 text-sm text-gray-600">
                <ShieldCheck
                  className="h-4 w-4 text-gray-500"
                  aria-hidden="true"
                />
                Stripe checkout
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-600">
                <Headphones
                  className="h-4 w-4 text-gray-500"
                  aria-hidden="true"
                />
                Priority support
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-600">
                <XCircle className="h-4 w-4 text-gray-500" aria-hidden="true" />
                Cancel anytime
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Comparison table */}
        <section aria-labelledby="comparison-heading" className="mt-16">
          <FadeIn>
            <h2
              id="comparison-heading"
              className="text-center text-2xl font-bold tracking-tight text-gray-900 md:text-3xl"
            >
              What&apos;s included in your plan
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="px-4 py-3 text-sm font-semibold text-gray-900">
                      Feature
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                      Free
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                      Pro
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                      Business
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COMPARISON.map((row) => (
                    <TableRow key={row.feature}>
                      <TableCell className="px-4 py-3 text-gray-700">
                        {row.feature}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        {row.free === "check" ? (
                          <CheckMark />
                        ) : row.free === "x" ? (
                          <CrossMark />
                        ) : (
                          <span className="text-gray-600">{row.free}</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        {row.pro === "check" ? (
                          <CheckMark />
                        ) : (
                          <span className="text-gray-600">{row.pro}</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        {row.business === "check" ? (
                          <CheckMark />
                        ) : (
                          <span className="text-gray-600">{row.business}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </FadeIn>
        </section>

        {/* Testimonials */}
        <Testimonials title="Pixelcut is loved by over 2 million people" />

        {/* Credits explainer */}
        <section aria-labelledby="credits-heading" className="mt-4">
          <FadeIn>
            <h2
              id="credits-heading"
              className="text-center text-2xl font-bold tracking-tight text-gray-900 md:text-3xl"
            >
              How do credits work?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-gray-600">
              Credits are a special resource used whenever you create or edit
              images with certain advanced AI models—particularly those
              provided by third-party partners.
            </p>
            <div className="mt-6 flex justify-center">
              <Select value={modelPlan} onValueChange={setModelPlan}>
                <SelectTrigger
                  className="h-10 w-[190px] rounded-full text-sm"
                  aria-label="Choose plan to preview model limits"
                >
                  <SelectValue />
                  <ChevronDown
                    className="size-4 opacity-50"
                    aria-hidden="true"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="px-4 py-3 text-sm font-semibold text-gray-900">
                      Model
                    </TableHead>
                    <TableHead className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Images per month
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MODELS.map((m, i) => (
                    <TableRow
                      key={m.name}
                      className={cn(i % 2 === 1 && "bg-gray-50/60")}
                    >
                      <TableCell className="px-4 py-2.5 text-gray-700">
                        {m.name}
                      </TableCell>
                      <TableCell className="px-4 py-2.5 text-right">
                        {modelPlan === "free" ? (
                          <span className="inline-flex items-center justify-end text-gray-300">
                            <X
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                            <span className="sr-only">Not included</span>
                          </span>
                        ) : (
                          <span className="text-gray-600">
                            Up to{" "}
                            {modelPlan === "business"
                              ? fmt(Math.min(m.pro * 6, 180000))
                              : fmt(m.pro)}{" "}
                            images
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </FadeIn>
        </section>
      </div>
    </div>
  )
}
