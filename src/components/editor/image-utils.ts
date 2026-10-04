"use client"

/**
 * Client-side canvas image utilities for the editor app.
 * All operations return data URLs (PNG) unless noted.
 */

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    image.crossOrigin = "anonymous"
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Could not load image"))
    image.src = src
  })
}

export function measureImage(src: string): Promise<{ w: number; h: number } | null> {
  return new Promise((resolve) => {
    const image = new window.Image()
    image.onload = () =>
      resolve({ w: image.naturalWidth, h: image.naturalHeight })
    image.onerror = () => resolve(null)
    image.src = src
  })
}

function canvasToDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/png")
}

/**
 * Remove (near) pure white pixels — the remove-background API returns the
 * subject on a flat white backdrop, so keying it out client-side yields a
 * genuine transparent cutout for the checkerboard, swatches and PNG export.
 */
export function makeWhiteTransparent(
  image: HTMLImageElement,
  threshold = 235
): string {
  const canvas = document.createElement("canvas")
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const ctx = canvas.getContext("2d")
  if (!ctx) return image.src
  ctx.drawImage(image, 0, 0)
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = data.data
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]
    const lightest = Math.min(r, g, b)
    if (lightest >= threshold) {
      pixels[i + 3] = 0
    } else if (lightest >= threshold - 18) {
      // Feather the edge for smoother cutout borders.
      const t = (lightest - (threshold - 18)) / 18
      pixels[i + 3] = Math.round(pixels[i + 3] * (1 - t))
    }
  }
  ctx.putImageData(data, 0, 0)
  return canvasToDataUrl(canvas)
}

/** Composite a transparent cutout over a solid color (null = transparent). */
export async function compositeOverColor(
  base: string,
  color: string | null
): Promise<{ url: string; w: number; h: number }> {
  const image = await loadImage(base)
  const canvas = document.createElement("canvas")
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas unavailable")
  if (color) {
    if (color === "rainbow") {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#f87171")
      gradient.addColorStop(0.2, "#fbbf24")
      gradient.addColorStop(0.4, "#34d399")
      gradient.addColorStop(0.6, "#60a5fa")
      gradient.addColorStop(0.8, "#a78bfa")
      gradient.addColorStop(1, "#f472b6")
      ctx.fillStyle = gradient
    } else {
      ctx.fillStyle = color
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(image, 0, 0)
  return {
    url: canvasToDataUrl(canvas),
    w: canvas.width,
    h: canvas.height,
  }
}

/** Composite a transparent cutout over a preset background image (cover fit). */
export async function compositeOverImage(
  base: string,
  backgroundUrl: string
): Promise<{ url: string; w: number; h: number }> {
  const [subject, background] = await Promise.all([
    loadImage(base),
    loadImage(backgroundUrl),
  ])
  const canvas = document.createElement("canvas")
  canvas.width = subject.naturalWidth
  canvas.height = subject.naturalHeight
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas unavailable")
  // Draw background with "cover" semantics over the subject canvas.
  const bgRatio = background.naturalWidth / background.naturalHeight
  const canvasRatio = canvas.width / canvas.height
  let dw = canvas.width
  let dh = canvas.height
  if (bgRatio > canvasRatio) {
    dw = canvas.height * bgRatio
  } else {
    dh = canvas.width / bgRatio
  }
  ctx.drawImage(
    background,
    (canvas.width - dw) / 2,
    (canvas.height - dh) / 2,
    dw,
    dh
  )
  ctx.drawImage(subject, 0, 0)
  return {
    url: canvasToDataUrl(canvas),
    w: canvas.width,
    h: canvas.height,
  }
}

/** Download an image URL (data URL or server path) at an optional scale. */
export async function downloadImage(
  url: string,
  filename: string,
  scaleFactor = 1
): Promise<void> {
  const image = await loadImage(url)
  const w = Math.max(1, Math.round(image.naturalWidth * scaleFactor))
  const h = Math.max(1, Math.round(image.naturalHeight * scaleFactor))
  let output = url
  if (scaleFactor !== 1) {
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      ctx.drawImage(image, 0, 0, w, h)
      output = canvas.toDataURL("image/png")
    }
  }
  const link = document.createElement("a")
  link.href = output
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function isDataUrl(url: string): boolean {
  return url.startsWith("data:")
}

/**
 * Convert a server image path ("/results/x.jpg") to a data URL so it can be
 * sent back to the tool APIs (they only accept base64/data-URL images).
 * Data URLs pass through unchanged.
 */
export async function ensureDataUrl(url: string): Promise<string> {
  if (url.startsWith("data:")) return url
  const res = await fetch(url)
  if (!res.ok) throw new Error("Could not read image")
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Could not read image"))
    reader.readAsDataURL(blob)
  })
}
