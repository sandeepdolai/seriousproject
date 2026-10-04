import { createToolRoute } from "@/lib/tools";

const VALID_SCALES = [2, 4, 8, 16];

export const POST = createToolRoute({
  tool: "upscale",
  title: "Image Upscale",
  mode: "edit",
  imageRequired: true,
  requiresAuth: false,
  buildPrompt: (body) => {
    let scale = 2;
    const raw = body.scale;
    const parsed = typeof raw === "number" ? raw : parseInt(String(raw ?? ""), 10);
    if (VALID_SCALES.includes(parsed)) scale = parsed;
    return {
      prompt: `Enhance this image: increase resolution and sharpness (upscale ${scale}x), recover fine details and textures, remove noise and compression artifacts. Keep composition, colors and content identical.`,
    };
  },
});
