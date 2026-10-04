"use client"

import { useCallback, useEffect, useState } from "react"

export interface RouteState {
  path: string
  query: URLSearchParams
}

function parseHash(): RouteState {
  const raw = window.location.hash.replace(/^#/, "") || "/"
  const [pathRaw, queryRaw] = raw.split("?")
  const path = pathRaw.startsWith("/") ? pathRaw : `/${pathRaw}`
  return { path, query: new URLSearchParams(queryRaw || "") }
}

export function useRouter() {
  const [route, setRoute] = useState<RouteState>({
    path: "/",
    query: new URLSearchParams(),
  })

  useEffect(() => {
    const update = () => setRoute(parseHash())
    update()
    window.addEventListener("hashchange", update)
    return () => window.removeEventListener("hashchange", update)
  }, [])

  const navigate = useCallback((path: string, query?: Record<string, string>) => {
    const qs = query
      ? `?${new URLSearchParams(query).toString()}`
      : ""
    const target = `#${path}${qs}`
    if (window.location.hash === target) {
      setRoute(parseHash())
    } else {
      window.location.hash = target
    }
  }, [])

  return { route, navigate }
}

export const ROUTES = {
  home: "/",
  pricing: "/pricing",
  backgroundRemover: "/background-remover",
  imageUpscaler: "/image-upscaler",
  magicEraser: "/cleanup-pictures",
  uncrop: "/uncrop",
  generativeFill: "/generative-fill",
  aiImageGenerator: "/ai-image-generator",
  aiProductPhotography: "/ai-product-photography",
  videoBackgroundRemover: "/video-background-remover",
  aiAds: "/ai-ads",
  editor: "/editor",
  generate: "/generate",
} as const
