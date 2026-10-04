import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "retouch",
  title: "Retouch",
  mode: "edit",
  imageRequired: true,
  requiresAuth: false,
  buildPrompt: (body) => {
    const userPrompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (userPrompt.length > 1000) {
      return { error: "Prompt is too long (max 1000 characters)." };
    }
    return {
      prompt: userPrompt
        ? `Retouch this image: ${userPrompt}. Keep a natural look and keep everything else identical.`
        : "Retouch this image subtly: remove blemishes and distractions, clean up the composition, keep natural look.",
    };
  },
});
