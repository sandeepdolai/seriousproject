import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "generativeFill",
  title: "Generative Fill",
  mode: "edit",
  imageRequired: true,
  requiresAuth: false,
  buildPrompt: (body) => {
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) {
      return { error: "Please describe what you want to fill or change." };
    }
    if (prompt.length > 1000) {
      return { error: "Prompt is too long (max 1000 characters)." };
    }
    return {
      prompt: `${prompt}, blend naturally with the original image, keep unedited areas identical`,
    };
  },
});
