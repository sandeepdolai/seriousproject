import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "removeBackground",
  title: "Background Removal",
  mode: "edit",
  imageRequired: true,
  requiresAuth: false,
  buildPrompt: () => ({
    prompt:
      "Isolate the main subject of this photo and replace the background with a pure flat white (#FFFFFF) background. Keep the subject's edges crisp and preserve all details exactly. Do not alter the subject itself.",
  }),
});
