import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "restore",
  title: "Photo Restoration",
  mode: "edit",
  imageRequired: true,
  requiresAuth: false,
  buildPrompt: (body) => {
    const colorize =
      typeof body.colorize === "boolean" ? body.colorize : true;
    return {
      prompt: `Restore this old, damaged photograph: repair scratches, tears, stains, dust, and creases; reduce noise and grain; recover faded contrast and sharp detail; reconstruct damaged areas plausibly without changing the subject's face, identity, or expression. ${
        colorize
          ? "Add natural, realistic color to the restored photo."
          : "Keep the result in natural black and white."
      }`,
    };
  },
});
