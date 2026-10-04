import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "blur",
  title: "Background Blur",
  mode: "edit",
  imageRequired: true,
  requiresAuth: false,
  buildPrompt: (body) => {
    let intensity = 5;
    const raw = body.intensity;
    const parsed = typeof raw === "number" ? raw : parseFloat(String(raw ?? ""));
    if (Number.isFinite(parsed)) {
      intensity = Math.min(10, Math.max(1, Math.round(parsed)));
    }
    return {
      prompt: `Apply a smooth background blur (bokeh) effect keeping the main subject in sharp focus. The blur strength should be ${intensity} out of 10.`,
    };
  },
});
