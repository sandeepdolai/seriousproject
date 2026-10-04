import { NextResponse } from "next/server";
import sharp from "sharp";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import {
  decodeBase64Image,
  getBase64ImageSize,
  isValidBase64Image,
  MAX_IMAGE_CHARS,
  saveBase64Image,
} from "@/lib/ai";

/**
 * POST /api/tools/resize
 * Non-AI image resizer backed by sharp.
 *
 * Body:
 *  - image: string (data URL or base64) — required
 *  - preset: string — social preset key (cropped, cover fit)
 *  - width / height: number — custom target size (1–12000)
 *  - fit: "cover" (crop) | "contain" (pad) — used with width+height, default cover
 *
 * Resolution rules:
 *  - preset only → crop to the preset's exact dimensions (cover, centered)
 *  - width + height → cover or contain as requested
 *  - width only / height only → scale preserving aspect ratio
 */

const PRESETS: Record<string, { w: number; h: number; label: string }> = {
  instagramPost: { w: 1080, h: 1080, label: "Instagram post 1:1" },
  instagramPortrait: { w: 1080, h: 1350, label: "Instagram portrait 4:5" },
  instagramStory: { w: 1080, h: 1920, label: "Instagram story 9:16" },
  youtubeThumb: { w: 1280, h: 720, label: "YouTube thumbnail 16:9" },
  xPost: { w: 1600, h: 900, label: "X post 16:9" },
  facebookCover: { w: 1640, h: 924, label: "Facebook cover" },
  linkedinCover: { w: 1584, h: 396, label: "LinkedIn banner" },
  profile: { w: 800, h: 800, label: "Profile picture 1:1" },
  print4x6: { w: 1200, h: 1800, label: "Print 4×6 300dpi" },
  print8x10: { w: 2400, h: 3000, label: "Print 8×10 300dpi" },
};

function err(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

function toFormat(buf: Buffer): "png" | "jpeg" | "webp" {
  if (buf.length >= 12) {
    if (buf[0] === 0x89 && buf[1] === 0x50) return "png";
    if (buf[0] === 0xff && buf[1] === 0xd8) return "jpeg";
    if (buf[0] === 0x52 && buf[1] === 0x49 && buf[8] === 0x57) return "webp";
  }
  return "png";
}

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return err(400, "Invalid request body.");
  }

  const rawImage = typeof body.image === "string" ? body.image : "";
  if (!rawImage) return err(400, "Please upload an image to continue.");
  if (rawImage.length > MAX_IMAGE_CHARS) {
    return err(400, "Image is too large. Please upload an image under 50MB.");
  }
  if (!isValidBase64Image(rawImage)) {
    return err(400, "Invalid image. Please upload a JPG, PNG or WebP image.");
  }

  const buf = decodeBase64Image(rawImage);
  const meta = await getBase64ImageSize(rawImage);
  if (!meta) return err(400, "Invalid image. Please upload a JPG, PNG or WebP image.");

  // ---- resolve target dimensions -------------------------------------------
  const presetKey = typeof body.preset === "string" ? body.preset : "";
  let targetW: number | null = null;
  let targetH: number | null = null;
  let fit: "cover" | "contain" = "cover";
  let label = "Resize";

  if (presetKey && PRESETS[presetKey]) {
    targetW = PRESETS[presetKey].w;
    targetH = PRESETS[presetKey].h;
    label = PRESETS[presetKey].label;
  } else {
    const w = body.width;
    const h = body.height;
    targetW = typeof w === "number" && Number.isFinite(w) ? Math.round(w) : null;
    targetH = typeof h === "number" && Number.isFinite(h) ? Math.round(h) : null;
    if (targetW !== null && (targetW < 1 || targetW > 12000)) {
      return err(400, "Width must be between 1 and 12000 pixels.");
    }
    if (targetH !== null && (targetH < 1 || targetH > 12000)) {
      return err(400, "Height must be between 1 and 12000 pixels.");
    }
    if (targetW === null && targetH === null) {
      return err(400, "Choose a size preset or enter a width or height.");
    }
    if (body.fit === "contain") fit = "contain";
    if (targetW && targetH) label = `Resize ${targetW}×${targetH}`;
    else if (targetW) label = `Resize width ${targetW}`;
    else label = `Resize height ${targetH}`;
  }

  try {
    let pipeline = sharp(buf);
    const format = toFormat(buf);

    if (targetW && targetH) {
      pipeline = pipeline.resize(targetW, targetH, {
        fit,
        position: "centre",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        withoutEnlargement: false,
      });
    } else if (targetW) {
      pipeline = pipeline.resize({ width: targetW });
    } else if (targetH) {
      pipeline = pipeline.resize({ height: targetH });
    }

    if (format === "jpeg") pipeline = pipeline.jpeg({ quality: 92 });
    else if (format === "webp") pipeline = pipeline.webp({ quality: 92 });
    else pipeline = pipeline.png();

    const out = await pipeline.toBuffer({ resolveWithObject: true });

    // public URL writer expects base64
    const b64 = out.data.toString("base64");
    const imageUrl = await saveBase64Image(b64, "results", "resize");

    // ---- project record for logged-in users --------------------------------
    const user = await getSessionUser();
    if (user) {
      try {
        const originalImage = await saveBase64Image(rawImage, "uploads", "orig");
        await db.project.create({
          data: {
            userId: user.id,
            tool: "resize",
            title: label,
            originalImage,
            resultImage: imageUrl,
          },
        });
      } catch (e) {
        console.error("[tools/resize] Failed to save project:", e);
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      width: out.info.width,
      height: out.info.height,
    });
  } catch (e) {
    console.error("[tools/resize] processing failed:", e);
    return err(500, "Resize failed. Please try a different image.");
  }
}
