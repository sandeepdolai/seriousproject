import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "recolor",
  title: "Recolor",
  mode: "edit",
  imageRequired: true,
  requiresAuth: false,
  buildPrompt: (body) => {
    const target =
      typeof body.target === "string" ? body.target.trim() : "";
    const color =
      typeof body.color === "string" ? body.color.trim() : "";
    if (!target) {
      return { error: "Tell us which item to recolor (e.g. the shirt)." };
    }
    if (!color) {
      return { error: "Pick a color to apply to the item." };
    }
    return {
      prompt: `Change the color of the ${target} in this photo to ${color}. Keep the fabric texture, folds, lighting, and shading realistic. Do not change anything else in the image — the subject, pose, background, and all other items must stay identical.`,
    };
  },
});
