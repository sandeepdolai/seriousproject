import { createToolRoute } from "@/lib/tools";

export const POST = createToolRoute({
  tool: "aiAds",
  title: "AI Ads",
  // auto: edit when a product image is uploaded, otherwise text-to-image.
  mode: "auto",
  imageRequired: false,
  requiresAuth: true, // generation requires login + 1 credit
  buildPrompt: (body) => {
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const hasImage = typeof body.image === "string" && body.image.length > 0;
    if (!prompt && !hasImage) {
      return { error: "Please upload a product image or describe your ad." };
    }
    if (prompt.length > 1000) {
      return { error: "Prompt is too long (max 1000 characters)." };
    }
    if (hasImage) {
      return {
        prompt:
          "Create an authentic influencer-style UGC social media advertisement photo featuring this product" +
          (prompt ? `: ${prompt}` : "") +
          ". Use lifestyle context, natural lighting, realistic shadows and a candid composition while keeping the product exactly as it is.",
      };
    }
    return {
      prompt:
        "Create an authentic influencer-style UGC social media advertisement photo" +
        (prompt ? `: ${prompt}` : "") +
        ". Candid composition, natural lighting, realistic and relatable.",
    };
  },
});
