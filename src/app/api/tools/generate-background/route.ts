import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "generateBackground",
  title: "AI Background",
  mode: "edit",
  imageRequired: true,
  requiresAuth: true, // generation requires login + 1 credit
  buildPrompt: (body) => {
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) {
      return { error: "Please describe the background you want to generate." };
    }
    if (prompt.length > 1000) {
      return { error: "Prompt is too long (max 1000 characters)." };
    }
    return {
      prompt: `Replace the background of this image with: ${prompt}. Keep the main subject unchanged with crisp edges, natural lighting and realistic shadows.`,
    };
  },
});
