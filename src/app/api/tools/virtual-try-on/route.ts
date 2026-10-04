import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "virtualTryOn",
  title: "Virtual Try-On",
  mode: "edit",
  imageRequired: true,
  requiresAuth: true, // generation-heavy tool: login + 1 credit
  buildPrompt: (body) => {
    const garment =
      typeof body.garment === "string" ? body.garment.trim() : "";
    const model =
      typeof body.model === "string" ? body.model.trim() : "";
    if (!garment) {
      return { error: "Describe the clothing item to try on." };
    }
    const modelPart = model ? ` Show it worn by ${model}.` : "";
    return {
      prompt: `Virtual try-on: dress the person in this photo wearing ${garment}.${modelPart} Keep the person's face, hair, body pose, and skin tone identical. Render the garment with realistic fabric draping, natural lighting, and soft shadows that match the scene.`,
    };
  },
});
