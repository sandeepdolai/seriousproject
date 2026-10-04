import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "magicEraser",
  title: "Magic Eraser",
  mode: "edit",
  imageRequired: true,
  requiresAuth: false,
  buildPrompt: (body) => {
    const target = typeof body.target === "string" ? body.target.trim() : "";
    if (!target) {
      return { error: "Please describe the object you want to remove." };
    }
    if (target.length > 500) {
      return { error: "Description is too long (max 500 characters)." };
    }
    return {
      prompt: `Remove ${target} from the image completely and naturally fill the area with matching surroundings. Keep everything else identical.`,
    };
  },
});
