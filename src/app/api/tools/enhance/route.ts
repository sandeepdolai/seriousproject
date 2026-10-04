import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "enhance",
  title: "Auto Enhance",
  mode: "edit",
  imageRequired: true,
  requiresAuth: true, // enhance requires login + 1 credit
  buildPrompt: () => ({
    prompt:
      "Enhance this image automatically: optimize colors, contrast, exposure and white balance, bring out fine details and clarity, keep the composition and content identical.",
  }),
});
