import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "profilePicture",
  title: "Profile Picture",
  mode: "edit",
  imageRequired: true,
  requiresAuth: false,
  buildPrompt: (body) => {
    const style =
      typeof body.style === "string" ? body.style.trim() : "";
    const styleMap: Record<string, string> = {
      studio:
        "a clean professional studio portrait with a soft neutral gray background and flattering soft light",
      gradient:
        "a vibrant modern portrait with a smooth colorful gradient background",
      outdoor:
        "a warm natural outdoor portrait with soft daylight and a gently blurred green background",
      bw: "a timeless black and white portrait with rich contrast",
      linkedin:
        "a polished headshot with a simple light background suitable for a professional network profile",
    };
    const styleDesc =
      (style && styleMap[style]) || styleMap.studio;
    return {
      prompt: `Turn this photo into a polished profile picture: ${styleDesc}. Center the subject, refine the face naturally without altering identity, gently enhance skin, eyes, and hair, and keep the framing as a head-and-shoulders composition.`,
    };
  },
});
