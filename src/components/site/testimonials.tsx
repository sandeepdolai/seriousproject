"use client"

import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

const TESTIMONIALS = [
  {
    title: "My favorite app",
    body: "I use Pixelcut almost every day for my shop listings. The background remover is scary accurate — it even handles flyaway hair on the first try. My product photos finally look like they came from a real studio.",
    name: "Sarah K.",
    source: "App Store review",
  },
  {
    title: "Best background remover",
    body: "I have tried a bunch of background removers and this one is by far the best. It perfectly cut out my product and the upscaler made the image crisp enough for print. Free exports with no watermark are a huge plus.",
    name: "Marcus T.",
    source: "App Store review",
  },
  {
    title: "Love it",
    body: "Super easy to use and the results are amazing. I upscaled old blurry photos to 4K and honestly could not believe the quality. The magic eraser alone saved me hours of retouching work.",
    name: "Priya R.",
    source: "Google Play review",
  },
]

/**
 * Testimonials section — 3 app-store style review cards with amber stars.
 * Shared between the landing page and the pricing page.
 */
export function Testimonials({
  title = "Join 70M+ creators, brands, and businesses",
  className,
}: {
  title?: string
  className?: string
}) {
  return (
    <section aria-label="Testimonials" className={cn("py-16 md:py-20", className)}>
      <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.title}
            className="flex flex-col rounded-2xl bg-gray-50 p-6"
          >
            <div
              className="flex gap-0.5"
              aria-label="Rated 5 out of 5 stars"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]"
                  aria-hidden="true"
                />
              ))}
            </div>
            <blockquote className="mt-4 flex-1">
              <p className="font-semibold text-gray-900">{t.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                &ldquo;{t.body}&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600"
                aria-hidden="true"
              >
                {t.name.charAt(0)}
              </span>
              <span>
                <span className="block text-sm font-medium text-gray-900">
                  {t.name}
                </span>
                <span className="block text-xs text-gray-400">{t.source}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
