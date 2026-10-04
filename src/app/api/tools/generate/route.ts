import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "generate",
  title: "AI Image",
  mode: "generate",
  imageRequired: false,
  requiresAuth: true, // generation requires login + 1 credit
  buildPrompt: (body) => {
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) {
      return { error: "Please describe what you want to create." };
    }
    if (prompt.length > 1000) {
      return { error: "Prompt is too long (max 1000 characters)." };
    }
    return { prompt };
  },
});
