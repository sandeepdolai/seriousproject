import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "colorize",
  title: "Colorize Photo",
  mode: "edit",
  imageRequired: true,
  requiresAuth: false,
  buildPrompt: () => ({
    prompt:
      "Colorize this black and white photograph with natural, realistic colors. Choose plausible skin tones, clothing colors, and environment colors that fit the era and scene. Keep the composition, faces, and details identical — only add color. Also gently improve contrast and clarity while preserving the character of the original photo.",
  }),
});
