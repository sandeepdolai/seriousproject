import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  editImage,
  generateImage,
  saveBase64Image,
  getBase64ImageSize,
  pickSize,
  resolveRequestedSize,
  decrementCredits,
  InsufficientCreditsError,
  isValidBase64Image,
  MAX_IMAGE_CHARS,
} from "@/lib/ai";

/**
 * Shared POST handler factory for all /api/tools/* endpoints.
 * Server-side only (imports z-ai-web-dev-sdk indirectly via lib/ai).
 */

export interface ToolSpec {
  /** Project.tool value, e.g. "removeBackground" */
  tool: string;
  /** Default Project title when the user supplied no prompt */
  title: string;
  /** edit = always edit uploaded image; generate = text-to-image; auto = edit when an image is provided, else generate */
  mode: "edit" | "generate" | "auto";
  /** true → login + 1 credit required (generation tools) */
  requiresAuth: boolean;
  /** true → an uploaded image is mandatory */
  imageRequired: boolean;
  /** Build the AI prompt from the request body, or return an error string. */
  buildPrompt: (
    body: Record<string, unknown>
  ) => { prompt: string } | { error: string };
}

const ERR_INVALID_BODY = "Invalid request body.";
const ERR_IMAGE_REQUIRED = "Please upload an image to continue.";
const ERR_IMAGE_INVALID =
  "Invalid image. Please upload a JPG, PNG or WebP image.";
const ERR_IMAGE_TOO_LARGE =
  "Image is too large. Please upload an image under 50MB.";
const ERR_AUTH_REQUIRED = "Please sign in to use this feature";
const ERR_OUT_OF_CREDITS = "You're out of credits. Upgrade to continue.";
const ERR_AI_FAILED = "AI processing failed. Please try again.";

function jsonError(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

function userPromptOf(body: Record<string, unknown>): string | null {
  for (const key of ["prompt", "target"]) {
    const v = body[key];
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return null;
}

function deriveTitle(spec: ToolSpec, userPrompt: string | null): string {
  if (userPrompt) {
    const t = userPrompt.slice(0, 80);
    return t.length < userPrompt.length ? `${t}…` : t;
  }
  return spec.title;
}

export function createToolRoute(spec: ToolSpec) {
  return async function POST(req: Request): Promise<Response> {
    // ---- parse body -------------------------------------------------------
    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return jsonError(400, ERR_INVALID_BODY);
    }

    // ---- build prompt -----------------------------------------------------
    const built = spec.buildPrompt(body);
    if ("error" in built) return jsonError(400, built.error);
    const prompt = built.prompt;
    const userPrompt = userPromptOf(body);

    // ---- image validation --------------------------------------------------
    const rawImage = typeof body.image === "string" ? body.image : undefined;
    const useEdit =
      spec.mode === "generate" ? false : spec.mode === "edit" ? true : Boolean(rawImage);
    if (spec.imageRequired && !rawImage) {
      return jsonError(400, ERR_IMAGE_REQUIRED);
    }
    if (rawImage) {
      if (rawImage.length > MAX_IMAGE_CHARS) {
        return jsonError(400, ERR_IMAGE_TOO_LARGE);
      }
      if (!isValidBase64Image(rawImage)) {
        return jsonError(400, ERR_IMAGE_INVALID);
      }
    }

    // ---- auth & credits ----------------------------------------------------
    const user = await getSessionUser();
    if (spec.requiresAuth) {
      if (!user) return jsonError(401, ERR_AUTH_REQUIRED);
      if (user.credits <= 0) return jsonError(402, ERR_OUT_OF_CREDITS);
    }

    // ---- run AI ------------------------------------------------------------
    try {
      let size: string;
      if (useEdit && rawImage) {
        const dims = await getBase64ImageSize(rawImage);
        if (!dims) return jsonError(400, ERR_IMAGE_INVALID);
        size =
          typeof body.size === "string" && body.size.trim().length > 0
            ? resolveRequestedSize(body.size)
            : pickSize(dims.width, dims.height);
      } else {
        size = resolveRequestedSize(body.size);
      }

      const result = useEdit
        ? await editImage({ prompt, image: rawImage as string, size })
        : await generateImage({ prompt, size });

      const imageUrl = await saveBase64Image(result.base64, "results", spec.tool);

      // ---- charge credit (after success so failures never cost a credit) ----
      let credits: number | undefined;
      if (spec.requiresAuth && user) {
        try {
          credits = await decrementCredits(user.id);
        } catch (err) {
          if (err instanceof InsufficientCreditsError) {
            return jsonError(402, ERR_OUT_OF_CREDITS);
          }
          throw err;
        }
      } else if (user) {
        credits = user.credits;
      }

      // ---- project record for logged-in users -------------------------------
      if (user) {
        try {
          let originalImage: string | null = null;
          if (rawImage) {
            originalImage = await saveBase64Image(rawImage, "uploads", "orig");
          }
          await db.project.create({
            data: {
              userId: user.id,
              tool: spec.tool,
              title: deriveTitle(spec, userPrompt),
              prompt: userPrompt,
              originalImage,
              resultImage: imageUrl,
            },
          });
        } catch (err) {
          console.error(`[tools/${spec.tool}] Failed to save project:`, err);
        }
      }

      return NextResponse.json({
        success: true,
        imageUrl,
        width: result.width,
        height: result.height,
        ...(credits !== undefined ? { credits } : {}),
      });
    } catch (err) {
      console.error(`[tools/${spec.tool}] AI processing failed:`, err);
      return jsonError(500, ERR_AI_FAILED);
    }
  };
}
