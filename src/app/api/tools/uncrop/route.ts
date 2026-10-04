import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "uncrop",
  title: "Uncrop / Expand",
  mode: "edit",
  imageRequired: true,
  requiresAuth: false,
  buildPrompt: () => ({
    prompt:
      "Outpaint and expand this image beyond its current edges, naturally continuing the scene in all directions with consistent lighting and style.",
  }),
});
