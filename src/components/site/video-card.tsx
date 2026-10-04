"use client"

import { Play } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "@/lib/router"
import { cn } from "@/lib/utils"

/**
 * Video preview card: poster image + circular play overlay, link-styled
 * title that navigates to a tool route.
 */
export function VideoCard({
  image,
  title,
  description,
  href,
  className,
}: {
  image: string
  title: string
  description: string
  href?: string
  className?: string
}) {
  const { toast } = useToast()
  const { navigate } = useRouter()

  return (
    <div className={cn("group", className)}>
      <div className="relative overflow-hidden rounded-2xl border border-gray-100">
        <img
          src={image}
          alt={`${title} preview`}
          loading="lazy"
          draggable={false}
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          aria-label={`Play ${title} video`}
          onClick={() =>
            toast({
              title: "Video coming soon",
              description: `The ${title} video preview is not available yet.`,
            })
          }
          className="absolute inset-0 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-black/80">
            <Play className="h-6 w-6 fill-white" aria-hidden="true" />
          </span>
        </button>
      </div>
      <div className="mt-4">
        {href ? (
          <button
            type="button"
            onClick={() => navigate(href)}
            className="text-left text-lg font-semibold text-gray-900 transition-colors hover:text-gray-700 hover:underline"
          >
            {title}
          </button>
        ) : (
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        )}
        <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      </div>
    </div>
  )
}
