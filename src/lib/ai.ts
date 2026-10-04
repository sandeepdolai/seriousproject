import ZAI from "z-ai-web-dev-sdk";
import { promises as fsp } from "fs";
import path from "path";
import sharp from "sharp";
import { db } from "@/lib/db";

/**
 * Shared AI helpers — server-side ONLY.
 * Never import this module (or z-ai-web-dev-sdk) from a client component.
 */

// ---------------------------------------------------------------------------
// ZAI singleton
// ---------------------------------------------------------------------------

const globalForZai = globalThis as unknown as {
  __zaiClient: Awaited<ReturnType<typeof ZAI.create>> | undefined;
};

export async function getZai() {
  if (!globalForZai.__zaiClient) {
    globalForZai.__zaiClient = await ZAI.create();
  }
  return globalForZai.__zaiClient;
}

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------

// 720x1440 / 1440x720 from the documented SDK list are rejected by the
// upstream API (both dimensions must be multiples of 32; 720 is not), so we
// restrict to the five verified working sizes.
export const SUPPORTED_SIZES = [
  "1024x1024",
  "768x1344",
  "864x1152",
  "1344x768",
  "1152x864",
] as const;

export type SupportedSize = (typeof SUPPORTED_SIZES)[number];

const SIZE_DIMS: Array<[number, number, SupportedSize]> = [
  [1024, 1024, "1024x1024"],
  [768, 1344, "768x1344"],
  [864, 1152, "864x1152"],
  [1344, 768, "1344x768"],
  [1152, 864, "1152x864"],
];

/** Pick the supported size whose aspect ratio is closest to w x h. */
export function pickSize(w?: number, h?: number): SupportedSize {
  if (!w || !h || w <= 0 || h <= 0) return "1024x1024";
  const target = w / h;
  let best = SIZE_DIMS[0];
  let bestDiff = Number.POSITIVE_INFINITY;
  for (const entry of SIZE_DIMS) {
    const diff = Math.abs(entry[0] / entry[1] - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = entry;
    }
  }
  return best[2];
}

/** Validate an incoming `size` value: accept a supported size or "a:b" ratio. */
export function resolveRequestedSize(
  size?: unknown
): SupportedSize {
  if (typeof size === "string") {
    const trimmed = size.trim();
    if ((SUPPORTED_SIZES as readonly string[]).includes(trimmed)) {
      return trimmed as SupportedSize;
    }
    const ratio = trimmed.match(/^(\d+(?:\.\d+)?)\s*[:x/]\s*(\d+(?:\.\d+)?)$/);
    if (ratio) {
      return pickSize(parseFloat(ratio[1]), parseFloat(ratio[2]));
    }
    const dims = trimmed.match(/^(\d+)\s*[x×]\s*(\d+)$/);
    if (dims) {
      return pickSize(parseInt(dims[1], 10), parseInt(dims[2], 10));
    }
  }
  return "1024x1024";
}

// ---------------------------------------------------------------------------
// Base64 helpers
// ---------------------------------------------------------------------------

const IMAGE_DATA_URL_RE = /^data:image\/[a-zA-Z0-9.+-]+;base64,/;

/** ~50MB decoded image ≈ 70M base64 characters. */
export const MAX_IMAGE_CHARS = 70_000_000;

/** Accept data-URL images or raw base64 strings. */
export function isValidBase64Image(input: string): boolean {
  if (IMAGE_DATA_URL_RE.test(input)) return true;
  return /^[A-Za-z0-9+/=\r\n]{100,}$/.test(input);
}

/** Strip a data-URL prefix and decode to a Buffer. */
export function decodeBase64Image(input: string): Buffer {
  const pure = IMAGE_DATA_URL_RE.test(input)
    ? input.slice(input.indexOf(",") + 1)
    : input;
  return Buffer.from(pure, "base64");
}

function detectImageExt(buf: Buffer): string {
  if (buf.length >= 8) {
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47)
      return "png";
    if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
    if (
      buf[0] === 0x52 &&
      buf[1] === 0x49 &&
      buf[2] === 0x46 &&
      buf[3] === 0x46 &&
      buf[8] === 0x57 &&
      buf[9] === 0x45
    )
      return "webp";
    if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "gif";
  }
  return "png";
}

/**
 * Save a base64 image (raw or data-URL) to public/<dir>/ and return the
 * public URL ("/<dir>/<file>"). Extension is detected from magic bytes.
 */
export async function saveBase64Image(
  base64: string,
  dir: "results" | "uploads" = "results",
  prefix = "img"
): Promise<string> {
  const buf = decodeBase64Image(base64);
  if (buf.length === 0) throw new Error("Empty image payload");
  const ext = detectImageExt(buf);
  const outDir = path.join(process.cwd(), "public", dir);
  await fsp.mkdir(outDir, { recursive: true });
  const filename = `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;
  await fsp.writeFile(path.join(outDir, filename), buf);
  return `/${dir}/${filename}`;
}

/** Read pixel dimensions of a base64 image (best effort). */
export async function getBase64ImageSize(
  base64: string
): Promise<{ width: number; height: number } | null> {
  try {
    const meta = await sharp(decodeBase64Image(base64)).metadata();
    if (meta.width && meta.height) {
      return { width: meta.width, height: meta.height };
    }
  } catch {
    // ignore — caller falls back to defaults
  }
  return null;
}

// ---------------------------------------------------------------------------
// Timeout wrapper
// ---------------------------------------------------------------------------

export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`Operation timed out after ${ms}ms`);
  }
}

export function withTimeout<T>(promise: Promise<T>, ms = 90_000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new TimeoutError(ms)), ms);
    }),
  ]);
}

// ---------------------------------------------------------------------------
// Credits
// ---------------------------------------------------------------------------

export class InsufficientCreditsError extends Error {
  constructor() {
    super("Insufficient credits");
  }
}

/**
 * Decrement one credit. Throws InsufficientCreditsError when the user is out.
 * Returns the remaining credit balance.
 */
export async function decrementCredits(userId: string): Promise<number> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
  if (!user || user.credits <= 0) throw new InsufficientCreditsError();
  const updated = await db.user.update({
    where: { id: userId },
    data: { credits: { decrement: 1 } },
    select: { credits: true },
  });
  return updated.credits;
}

// ---------------------------------------------------------------------------
// AI operations
// ---------------------------------------------------------------------------

export interface AiImageResult {
  base64: string;
  width: number;
  height: number;
}

function extractBase64(
  res: { data?: Array<{ base64?: string }> } | undefined | null
): string {
  const b64 = res?.data?.[0]?.base64;
  if (!b64) throw new Error("AI returned no image data");
  return b64;
}

/** Edit an existing image with a prompt (uses images.generations.edit). */
export async function editImage(opts: {
  prompt: string;
  image: string;
  size?: string;
}): Promise<AiImageResult> {
  const zai = await getZai();
  const res = await withTimeout(
    zai.images.generations.edit({
      prompt: opts.prompt,
      images: [{ url: opts.image }],
      size: (opts.size ?? "1024x1024") as SupportedSize,
      // SDK typings only declare `image`, but the upstream API accepts
      // `images: [{ url }]` (verified) — cast for type safety of the rest.
    } as Parameters<typeof zai.images.generations.edit>[0] & {
      images: Array<{ url: string }>;
    }),
    90_000
  );
  const base64 = extractBase64(res);
  const dims = (await getBase64ImageSize(base64)) ?? {
    width: 1024,
    height: 1024,
  };
  return { base64, ...dims };
}

/** Generate an image from a text prompt (uses images.generations.create). */
export async function generateImage(opts: {
  prompt: string;
  size?: string;
}): Promise<AiImageResult> {
  const zai = await getZai();
  const res = await withTimeout(
    zai.images.generations.create({
      prompt: opts.prompt,
      size: (opts.size ?? "1024x1024") as SupportedSize,
    }),
    90_000
  );
  const base64 = extractBase64(res);
  const dims = (await getBase64ImageSize(base64)) ?? {
    width: 1024,
    height: 1024,
  };
  return { base64, ...dims };
}
