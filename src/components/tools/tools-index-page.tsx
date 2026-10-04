"use client"

import { useMemo, useState } from "react"
import { useRouter } from "@/lib/router"
import { Search } from "lucide-react"
import { ToolPageConfig } from "./tool-configs"
import { FadeIn } from "@/components/site/fade-in"

/**
 * /tools — index of every tool page in the app.
 * Flat searchable grid of tool cards (image + name + short description).
 */
export function ToolsIndexPage() {
  const { navigate } = useRouter()
  const [query, setQuery] = useState("")

  const tools = useMemo(() => {
    const list = Object.values(ToolPageConfig).map((config) => ({
      slug: config.slug,
      name: config.name,
      description: config.description,
      image: config.samples[0] ?? "/images/mosaic-1.png",
      isGenerator: config.editorTool === "generate",
    }))
    list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tools
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q)
    )
  }, [tools, query])

  return (
    <div className="pt-24 md:pt-28 max-w-6xl mx-auto px-6 pb-20 w-full">
      <FadeIn>
        <section aria-labelledby="tools-h1" className="text-center max-w-2xl mx-auto">
          <h1 id="tools-h1" className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
            All tools
          </h1>
          <p className="text-lg text-gray-500 mt-4 leading-relaxed">
            Every Pixelcut AI tool in one place — edit, generate, restore, and
            resize images for free.
          </p>
          <div className="mt-8 relative max-w-md mx-auto">
            <Search
              className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools…"
              aria-label="Search tools"
              className="w-full h-11 rounded-full border border-gray-200 bg-white pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
        </section>
      </FadeIn>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-16" role="status">
          No tools match “{query}”. Try a different search.
        </p>
      ) : (
        <FadeIn delay={0.05}>
          <ul
            className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            aria-label="Tool list"
          >
            {filtered.map((tool) => (
              <li key={tool.slug}>
                <button
                  type="button"
                  onClick={() => navigate(tool.slug)}
                  className="group w-full text-left rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-gray-300 hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-neutral-300"
                  aria-label={`Open ${tool.name}`}
                >
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={tool.image}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h2 className="text-sm font-semibold text-neutral-900 group-hover:underline">
                      {tool.name}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {tool.isGenerator ? "AI generator" : "AI image editing"}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </FadeIn>
      )}
    </div>
  )
}
