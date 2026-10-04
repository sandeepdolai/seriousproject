import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "shadow",
  title: "Add Shadow",
  mode: "edit",
  imageRequired: true,
  requiresAuth: false,
  buildPrompt: () => ({
    prompt:
      "Add a realistic soft drop shadow under the main subject on the white background, natural studio lighting look.",
  }),
});
