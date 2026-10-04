import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "productPhotography",
  title: "AI Product Photography",
  mode: "edit",
  imageRequired: true,
  requiresAuth: true, // generation requires login + 1 credit
  buildPrompt: (body) => {
    const scene = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (scene.length > 1000) {
      return { error: "Prompt is too long (max 1000 characters)." };
    }
    return {
      prompt:
        "Professional e-commerce product photography of this item on an aesthetic studio scene with soft shadows and premium lighting, keep the product exactly as it is." +
        (scene ? ` Scene: ${scene}.` : ""),
    };
  },
});
