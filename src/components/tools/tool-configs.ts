/**
 * Tool landing page configuration for all Pixelcut tools.
 * Keys are hash routes (e.g. "/background-remover").
 */

export interface UseCaseTab {
  label: string
  image: string
  text: string
}

export interface Faq {
  q: string
  a: string
}

export interface SeoSection {
  h2: string
  paragraphs: string[]
  image?: string
}

export interface Feature {
  title: string
  text: string
}

export interface HowToStep {
  title: string
  text: string
}

export interface ScenePreset {
  label: string
  image: string
  prompt: string
}

export type EditorTool =
  | "removeBackground"
  | "upscale"
  | "magicEraser"
  | "uncrop"
  | "generativeFill"
  | "generate"
  | "generateBackground"
  | "productPhotography"
  | "video"
  | "aiAds"
  | "enhance"
  | "blur"
  | "colorize"
  | "restore"
  | "recolor"
  | "resize"
  | "virtualTryOn"
  | "profilePicture"

export interface ToolConfig {
  /** Hash route of the tool landing page, e.g. "/background-remover" */
  slug: string
  name: string
  h1: string
  description: string
  badges: string[]
  /** Tool applied when an upload lands in the editor */
  editorTool: EditorTool
  accepts: "image" | "video"
  /** Sample image paths shown as "try one of these" + hero visual */
  samples: string[]
  useCaseTabs?: UseCaseTab[]
  faqs: Faq[]
  seoSections?: SeoSection[]
  features: Feature[]
  howTo: HowToStep[]
  /** AI Image Generator: model chips under "Powered by leading AI models" */
  models?: string[]
  /** AI Product Photography: scene preset chips */
  scenePresets?: ScenePreset[]
  /** Image Upscaler: show 2x/4x/8x/16x scale chips before upload */
  scaleOptions?: boolean
  /** Custom label for the upload button (defaults to "Upload image") */
  ctaLabel?: string
  /** Generator pages: style chips that append to the prompt */
  styleChips?: string[]
  /** Generator pages: embed a compact pricing block */
  showPricing?: boolean
}

const img = (name: string) => `/images/${name}.png`

export const ToolPageConfig: Record<string, ToolConfig> = {
  "/background-remover": {
    slug: "/background-remover",
    name: "Background Remover",
    h1: "Free Image Background Remover",
    description:
      "Remove background from image online with Pixelcut's free AI background remover. Get a clean HD cutout in seconds, no sign-up required!",
    badges: ["Free HD Download", "No watermark"],
    editorTool: "removeBackground",
    accepts: "image",
    samples: [img("sample-portrait"), img("sample-product"), img("sample-perfume")],
    useCaseTabs: [
      {
        label: "Hair & Fine Edges",
        image: img("usecase-hair"),
        text: "Get clean cutouts on the hardest edges, such as flyaway hair, jewelry filigree, thin glasses frames, and fur.",
      },
      {
        label: "Products",
        image: img("usecase-products"),
        text: "Clean edges on product detail for marketplace-ready shots.",
      },
      {
        label: "People & Portraits",
        image: img("usecase-people"),
        text: "Studio-grade portrait cutouts in seconds.",
      },
      {
        label: "Animals",
        image: img("usecase-animals"),
        text: "Fur and whiskers handled with care.",
      },
      {
        label: "Cars",
        image: img("usecase-cars"),
        text: "Vehicles cut out with precise reflections.",
      },
      {
        label: "Graphics",
        image: img("usecase-graphics"),
        text: "Logos and illustrations with clean edges.",
      },
    ],
    howTo: [
      {
        title: "Upload your image",
        text: "Click Upload image and select a JPG (JPEG), PNG, or HEIC file to begin editing. For best results, use a high-quality image where the subject has clear, defined edges.",
      },
      {
        title: "Remove background automatically",
        text: "Pixelcut's AI detects your subject, maps the edges, and removes the background in seconds. Use Refine to brush any edge by hand.",
      },
      {
        title: "Download image",
        text: "Download your image as a PNG with no background or keep editing with Pixelcut until your image is ready to be shared or used on your next project.",
      },
    ],
    features: [
      {
        title: "Accurate AI cutout",
        text: "Clean edges on hair, fur, and fine product detail.",
      },
      {
        title: "One-click background removal",
        text: "The AI detects your subject and cuts it out, no manual selecting.",
      },
      {
        title: "Transparent or white background",
        text: "Export a transparent PNG or swap to a white background.",
      },
      {
        title: "Free, no sign-up",
        text: "Remove background from photo online without signing up.",
      },
    ],
    faqs: [
      {
        q: "What is the best background remover?",
        a: "Pixelcut's AI background remover is fully automatic, works in seconds, and produces clean HD cutouts on hair, fur, and product detail — free and without sign-up.",
      },
      {
        q: "How do I get a transparent background on my image?",
        a: "Upload your image and the AI removes the background automatically. Download the result as a transparent PNG.",
      },
      {
        q: "How do I remove background from a picture on my phone?",
        a: "Open Pixelcut in your mobile browser or download the iOS or Android app — the workflow is identical.",
      },
      {
        q: "How do I change the background of an image?",
        a: "After removing the background, use the Background tool in the editor to add a solid color, an image, or generate an AI background.",
      },
      {
        q: "Can I remove a background from a photo for free?",
        a: "Yes! Preview-resolution downloads are free without an account; full resolution is free with sign-in.",
      },
    ],
    seoSections: [
      {
        h2: "Instant and automatic HD background remover",
        paragraphs: [
          "Removing a background used to mean carefully tracing edges with a selection tool — a slow, fiddly process that could take hours. Pixelcut's AI background remover does the work automatically: the moment you upload a photo, our model detects the subject, maps every edge, and deletes the background in seconds. No brushes, no lassos, no layers.",
          "Every cutout comes back in high definition, so your subject keeps the crisp edges and fine detail of the original photo. Flyaway hair, fur, glass, and jewelry are handled cleanly, and the result is ready to download as a transparent PNG the moment processing finishes.",
        ],
        image: img("ba-bg-after"),
      },
      {
        h2: "Easily remove background from product images",
        paragraphs: [
          "Marketplaces like Amazon, Etsy, eBay, and Shopify expect clean product photos — usually on a pure white background. With Pixelcut you can shoot your products anywhere and get marketplace-ready images in seconds, without a studio or a lightbox.",
          "After removing the background, drop your product onto a white background, a studio backdrop, or a fully generated AI scene. Consistent, professional product photos across your whole catalog help listings convert and make your shop look established from the very first photo.",
        ],
        image: img("usecase-products"),
      },
      {
        h2: "Remove BG in seconds and add background color",
        paragraphs: [
          "Speed matters when you're processing photos all day. Background removal takes just a few seconds per image, and the result lands straight in Pixelcut's editor where you can keep working without missing a beat.",
          "With the background gone, adding a new one is a single click: pick a solid color from the swatch panel, drop your subject onto one of our preset backdrops, or type a prompt and let the AI generate a completely new scene behind your subject.",
        ],
      },
      {
        h2: "Streamline your editing process with batch background removal",
        paragraphs: [
          "Editing photos one at a time doesn't scale. Sellers and marketers use Pixelcut's batch editing to apply background removal across an entire folder of images at once, so a whole product line gets consistent cutouts in the time it used to take to finish a single file.",
          "Batch background removal keeps sizes, alignment, and export settings identical across every image — perfect for catalogs, carousels, and ad sets where every frame needs to look like it came from the same studio.",
        ],
        image: img("ba-batch-after"),
      },
      {
        h2: "Generate a new background with our AI Background Generator",
        paragraphs: [
          "Sometimes a transparent cutout is only step one. Pixelcut's AI Background Generator can create an entirely new environment around your subject: describe the scene you imagine — a sunlit marble table with soft shadows, or a pastel studio gradient — and the AI paints it in while keeping your subject untouched.",
          "Because the subject and the background are treated separately, you can iterate on scenes as many times as you like without re-shooting a single photo. It's the fastest way to turn one product photo into an entire campaign's worth of creative.",
        ],
        image: img("bg-marble"),
      },
      {
        h2: "Integrate your app with our background remover API",
        paragraphs: [
          "Pixelcut's background remover is also available as a developer API. Send an image to the REST endpoint and receive a clean cutout back — the same AI model that powers the editor, at the same speed, ready to embed in your own product.",
          "The API fits naturally into e-commerce pipelines, print workflows, and design tools: upload an image, get a transparent PNG, and move on. Automatic background removal in a few lines of code, with no model training or GPU infrastructure to maintain.",
        ],
      },
    ],
  },

  "/image-upscaler": {
    slug: "/image-upscaler",
    name: "Image Upscaler",
    h1: "Free AI Image Upscaler Online",
    description:
      "Instantly improve image quality and increase resolution to 4K, 8K, or even 16K with Pixelcut's AI image upscaler. It's fast and free. Upload your image to enhance automatically!",
    badges: ["Up to 16K", "AI enhanced"],
    editorTool: "upscale",
    accepts: "image",
    samples: [img("ba-upscale-before"), img("sample-watch"), img("mosaic-3")],
    scaleOptions: true,
    howTo: [
      {
        title: "Upload a low-resolution image",
        text: "Click Upload image and select the photo you want to enhance. JPG (JPEG), PNG, and HEIC files up to 50MB are supported — screenshots, old photos, and compressed product shots all work.",
      },
      {
        title: "Choose your upscale factor",
        text: "Pick 2x, 4x, 8x, or 16x. Pixelcut's AI increases the resolution while recovering fine detail and cleaning up noise and compression artifacts.",
      },
      {
        title: "Download your HD image",
        text: "When processing finishes, download the result — preview resolution is free, and full resolution is free with sign-in — or keep editing with the other Pixelcut tools.",
      },
    ],
    features: [
      {
        title: "Up to 16K resolution",
        text: "Scale images up to 16x — enough to turn a 1000px photo into a wall-worthy print.",
      },
      {
        title: "AI detail recovery",
        text: "Real detail is reconstructed — skin, fabric, and text sharpen instead of smudging.",
      },
      {
        title: "Fast processing",
        text: "Most images finish in under a minute, right in your browser. No GPU or software install needed.",
      },
      {
        title: "Free to use",
        text: "Preview-resolution results are free without an account; full resolution is free with sign-in.",
      },
    ],
    faqs: [
      {
        q: "How much can I upscale?",
        a: "Choose 2x, 4x, 8x, or 16x — a 1000 × 1000 image becomes up to 16000 × 16000. The AI keeps edges and textures sharp instead of just stretching pixels.",
      },
      {
        q: "What images work best with the upscaler?",
        a: "Any JPG, PNG, or HEIC up to 50MB benefits, but the biggest gains come from old photos, screenshots, and compressed product shots where detail was lost.",
      },
      {
        q: "Is upscaling free?",
        a: "Yes. Preview-resolution downloads are free without an account, and full-resolution downloads are free with sign-in.",
      },
      {
        q: "Does it work on photos and graphics?",
        a: "Both. The AI recovers photographic detail like skin and fabric as well as crisp edges in logos, text, and illustrations.",
      },
      {
        q: "Will my image composition change?",
        a: "No. Upscaling increases resolution and sharpness only — the composition, colors, and content stay identical to the original.",
      },
    ],
    seoSections: [
      {
        h2: "Increase image resolution without losing quality",
        paragraphs: [
          "Traditional upscaling stretches existing pixels, which is why enlarged photos look soft, blocky, or blurry. Pixelcut's AI upscaler works differently: it studies the image and reconstructs the detail that belongs in each new pixel, so a 2x, 4x, 8x, or even 16x enlargement keeps the sharpness of the original.",
          "That means you can take a small image pulled from the web, an old family scan, or a thumbnail exported by mistake and turn it into a high-resolution file suitable for print, packaging, and full-screen displays.",
        ],
        image: img("ba-upscale-after"),
      },
      {
        h2: "Fix pixelated, blurry, and compressed images",
        paragraphs: [
          "Photos that have been shared through messaging apps, saved as low-quality JPGs, or captured on old cameras pick up compression artifacts and noise. The upscaler removes that damage as it enlarges, restoring clean gradients and crisp edges.",
          "Screenshot text becomes readable again, product photos regain fabric and material texture, and faces recover natural skin detail — all automatically, with no sliders to tune.",
        ],
      },
    ],
  },

  "/cleanup-pictures": {
    slug: "/cleanup-pictures",
    name: "Magic Eraser",
    h1: "Cleanup pictures for free",
    description:
      "Remove objects, text or people from your images to get clean photos!",
    badges: ["Free to use", "No sign-up"],
    editorTool: "magicEraser",
    accepts: "image",
    samples: [img("ba-retouch-before"), img("sample-man"), img("mosaic-5")],
    howTo: [
      {
        title: "Upload your photo",
        text: "Click Upload image and select the picture you want to clean up. JPG (JPEG), PNG, and HEIC files up to 50MB are supported.",
      },
      {
        title: "Tell the AI what to remove",
        text: "Describe the object, person, or text you want gone — for example, the person in the background, the power line, or the watermark. The AI erases it and fills the space naturally.",
      },
      {
        title: "Download your clean photo",
        text: "Download the cleaned-up image for free, or keep editing — remove something else, retouch, or add a new background.",
      },
    ],
    features: [
      {
        title: "Remove objects, text & people",
        text: "Anything you can describe can be erased — photobombers, logos, signs, and blemishes.",
      },
      {
        title: "Natural AI fill",
        text: "The erased area is reconstructed from the surrounding scene, not smeared or blurred.",
      },
      {
        title: "No manual brushing",
        text: "Describe the target in plain words instead of painting masks by hand.",
      },
      {
        title: "Free & unlimited",
        text: "Magic Eraser is free, anonymous, and unlimited — no sign-up required.",
      },
    ],
    faqs: [
      {
        q: "How does the Magic Eraser work?",
        a: "Upload a photo and type what you want removed. The AI finds the object, erases it, and fills the gap with pixels that match the surrounding scene — no brushing or masking required.",
      },
      {
        q: "Can I remove people from photos?",
        a: "Yes. Describe the person you want gone, such as the person in the background or the man on the left, and the AI removes them cleanly.",
      },
      {
        q: "Can it remove watermarks and text?",
        a: "It works well on watermarks, captions, signs, and timestamps. The AI fills the area with matching background so the removal blends in.",
      },
      {
        q: "Is the Magic Eraser really free?",
        a: "Yes — cleanup is free and unlimited, with no sign-up and no watermark on results.",
      },
    ],
    seoSections: [
      {
        h2: "Clean up photos in seconds, no editing skills required",
        paragraphs: [
          "A photobomber, a stray power line, or a badly-placed sign can ruin an otherwise perfect shot. Pixelcut's Magic Eraser removes unwanted objects from photos in seconds: upload the image, describe what should go, and the AI rebuilds the scene without it.",
          "There are no masks to paint and no layers to manage. The AI understands the scene around the erased object and fills the gap so naturally that the edit is invisible.",
        ],
        image: img("ba-retouch-after"),
      },
      {
        h2: "The fastest way to remove objects, text, and people",
        paragraphs: [
          "Content teams use the Magic Eraser to strip watermarks from stock-style shots, remove mannequins and props from product photos, and clean up backgrounds before publishing. Each cleanup takes seconds and keeps every other pixel untouched.",
          "Because cleanup is free and unlimited, you can erase as many distractions as a photo has — one at a time or across a whole set — before exporting the final result.",
        ],
      },
    ],
  },

  "/uncrop": {
    slug: "/uncrop",
    name: "Uncrop",
    h1: "Uncrop & AI Expand Image",
    description:
      "Uncrop and expand images online using AI. Simply upload your image, extend the size of the canvas, and click generate. Try it free here!",
    badges: ["AI outpainting", "Free to try"],
    editorTool: "uncrop",
    accepts: "image",
    samples: [img("ba-expand-before"), img("mosaic-2"), img("hero-grid-4")],
    howTo: [
      {
        title: "Upload your image",
        text: "Click Upload image and select the picture you want to expand. JPG (JPEG), PNG, and HEIC files up to 50MB are supported.",
      },
      {
        title: "Choose a new aspect ratio",
        text: "Pick 1:1, 4:3, or 16:9 — the canvas extends beyond your original frame and the AI paints what was outside it.",
      },
      {
        title: "Download your expanded image",
        text: "The AI continues your scene naturally beyond the edges. Download the result free, or keep editing with other Pixelcut tools.",
      },
    ],
    features: [
      {
        title: "Expand beyond the frame",
        text: "Reveal more of the scene than your camera captured.",
      },
      {
        title: "Context-aware fill",
        text: "New pixels match the lighting, perspective, and style of the original.",
      },
      {
        title: "Reframe for any platform",
        text: "Turn portraits into landscapes and photos into banners.",
      },
      {
        title: "Free to try",
        text: "Preview-resolution expansions are free without an account.",
      },
    ],
    faqs: [
      {
        q: "What is uncropping?",
        a: "Uncropping (also called outpainting) uses AI to extend an image beyond its original borders. You describe or choose a bigger canvas, and the AI generates matching scenery that continues your photo.",
      },
      {
        q: "What aspect ratios can I expand to?",
        a: "Choose 1:1 square, 4:3 classic, or 16:9 widescreen. The original image stays centered and the AI fills the new space around it.",
      },
      {
        q: "Will the original pixels change?",
        a: "The center of the canvas — your original photo — is preserved. The AI only generates the new areas around it, matching lighting and style.",
      },
      {
        q: "Is uncropping free?",
        a: "Preview-resolution downloads are free without an account, and full-resolution downloads are free with sign-in.",
      },
    ],
    seoSections: [
      {
        h2: "Outpaint images beyond their original borders",
        paragraphs: [
          "Every photo is a crop — a decision about what to leave out. Uncrop reverses that decision: extend the canvas in any direction and let AI imagine the scenery that continues beyond the frame, matched to your photo's lighting, colors, and perspective.",
          "It's the fix for photos shot too tight, product images that need more breathing room, and social formats that demand a different aspect ratio than your camera shoots.",
        ],
        image: img("ba-expand-after"),
      },
    ],
  },

  "/generative-fill": {
    slug: "/generative-fill",
    name: "Generative Fill",
    h1: "AI Generative Fill",
    description:
      "Generative Fill makes it easy to fill in images or replace elements online using AI. Upload your image, provide a text prompt, and watch the magic happen! Try it free.",
    badges: ["Text to edit", "AI powered"],
    editorTool: "generativeFill",
    accepts: "image",
    samples: [img("ba-batch-before"), img("mosaic-6"), img("hero-grid-5")],
    howTo: [
      {
        title: "Upload your image",
        text: "Click Upload image and select the picture you want to edit. JPG (JPEG), PNG, and HEIC files up to 50MB are supported.",
      },
      {
        title: "Describe your edit",
        text: "Type what you want to add, replace, or change — add a pair of sunglasses, make it golden hour, or replace the sky with clouds.",
      },
      {
        title: "Download your edited image",
        text: "The AI blends your edit into the scene with matching light and perspective. Download the result free or keep iterating.",
      },
    ],
    features: [
      {
        title: "Prompt-based editing",
        text: "Describe the change you want in plain language — no selections, no masks.",
      },
      {
        title: "Add or replace anything",
        text: "New objects, different skies, changed outfits, added props.",
      },
      {
        title: "Blends with the scene",
        text: "Edits match the original lighting, perspective, and style automatically.",
      },
      {
        title: "Free to try",
        text: "Preview-resolution results are free without an account.",
      },
    ],
    faqs: [
      {
        q: "What is generative fill?",
        a: "Generative fill is an AI editing technique where you describe a change in words and the model makes it in the image — adding objects, replacing elements, or extending scenes while keeping everything else identical.",
      },
      {
        q: "How do I edit an image with text?",
        a: "Upload your photo, then type a prompt describing the edit, such as add a vase of tulips on the table. The AI applies the edit and blends it into the scene.",
      },
      {
        q: "Can I add multiple edits?",
        a: "Yes. Apply one edit at a time and stack them — each result becomes the input for the next, so you can build up complex changes step by step.",
      },
      {
        q: "Is generative fill free?",
        a: "Preview-resolution downloads are free without an account; full resolution is free with sign-in.",
      },
    ],
    seoSections: [
      {
        h2: "Edit images by describing the change",
        paragraphs: [
          "Generative fill turns photo editing into a conversation. Instead of selecting regions, masking edges, and blending layers, you type what you want — a new sky, an extra chair, a warmer light — and the AI makes the change while preserving everything else in the photo.",
          "The model understands perspective and lighting, so added objects cast plausible shadows and pick up the scene's color temperature. The result reads as a photograph, not a collage.",
        ],
      },
    ],
  },

  "/ai-image-generator": {
    slug: "/ai-image-generator",
    name: "AI Image Generator",
    h1: "Free AI Image Generator",
    description: "Create images from text with the best AI models — free to try.",
    badges: ["Free to try", "Leading AI models"],
    editorTool: "generate",
    accepts: "image",
    samples: [
      img("mosaic-1"),
      img("mosaic-2"),
      img("mosaic-3"),
      img("mosaic-4"),
      img("hero-grid-1"),
      img("hero-grid-2"),
      img("mosaic-5"),
      img("mosaic-6"),
    ],
    models: ["Nano Banana", "Flux 2 Pro", "Ideogram 3", "Seedream 4"],
    howTo: [
      {
        title: "Describe your image",
        text: "Type a detailed prompt — subject, style, lighting, and mood. The more specific you are, the closer the result matches what you imagined.",
      },
      {
        title: "Pick a model and size",
        text: "Choose from leading AI models like Nano Banana, Flux 2 Pro, Ideogram, and Seedream, and a 1:1, 9:16, or 16:9 canvas.",
      },
      {
        title: "Generate and download",
        text: "Each image costs one credit — new accounts include free credits. Download favorites at full resolution or keep iterating on the prompt.",
      },
    ],
    features: [
      {
        title: "Leading AI models",
        text: "Nano Banana, Flux, Ideogram, and Seedream in one place.",
      },
      {
        title: "Any aspect ratio",
        text: "Square, portrait, and landscape canvases for every platform.",
      },
      {
        title: "Prompt to image in seconds",
        text: "Describe it, generate it, download it — the whole loop takes under a minute.",
      },
      {
        title: "Built for creators",
        text: "Every generation is saved to your projects so you can revisit and reuse prompts.",
      },
    ],
    faqs: [
      {
        q: "Is the AI image generator free?",
        a: "Creating an account is free and includes starter credits. Each image costs one credit; previewing prompts and browsing your history is always free.",
      },
      {
        q: "Which AI models can I use?",
        a: "Pixelcut routes your prompt to leading models including Nano Banana, Flux 2 Pro, Ideogram 3, and Seedream 4, so you can compare styles side by side.",
      },
      {
        q: "What sizes can I generate?",
        a: "Choose 1:1 square (1024×1024), 9:16 portrait (768×1344), or 16:9 landscape (1344×768) — perfect for posts, stories, and thumbnails.",
      },
      {
        q: "Who owns the images I generate?",
        a: "You do. Images you create with your account can be used in your projects — see the Terms for details on commercial use.",
      },
    ],
    seoSections: [
      {
        h2: "Turn any prompt into a finished image",
        paragraphs: [
          "The AI Image Generator converts plain-language descriptions into finished images in seconds. Describe a product on marble, a cozy living room, or a gold ring on a model's hand — the model handles composition, lighting, and style so you skip the photoshoot entirely.",
          "Iterate as fast as you can type: tweak a word, regenerate, and compare. Prompts and results are saved to your history, so winning looks are always one click away.",
        ],
      },
    ],
  },

  "/ai-product-photography": {
    slug: "/ai-product-photography",
    name: "AI Product Photography",
    h1: "AI Product Photography From a Single Product Photo",
    description:
      "Turn one product photo into studio-grade scenes. No studio, no photographer, no reshoots — just upload and generate.",
    badges: ["Studio-grade scenes", "1 credit per photo"],
    editorTool: "productPhotography",
    accepts: "image",
    samples: [img("sample-perfume"), img("sample-candle"), img("sample-product")],
    scenePresets: [
      {
        label: "Marble table",
        image: img("bg-marble"),
        prompt:
          "an elegant white marble table with soft natural window light and a minimal luxury aesthetic",
      },
      {
        label: "Beach scene",
        image: img("bg-beach"),
        prompt:
          "a sunlit sandy beach with ocean waves in the background and warm golden light",
      },
      {
        label: "Studio gradient",
        image: img("bg-studio-gray"),
        prompt:
          "a professional photo studio with a seamless gray gradient background and soft even lighting",
      },
      {
        label: "Wood table",
        image: img("bg-wood"),
        prompt:
          "a rustic warm wooden table with cozy ambient light and shallow depth of field",
      },
      {
        label: "City bokeh",
        image: img("bg-city"),
        prompt:
          "a blurred city skyline at night with warm bokeh lights and a premium feel",
      },
    ],
    howTo: [
      {
        title: "Upload one product photo",
        text: "A single shot of your product on any background is all you need — a phone photo works fine.",
      },
      {
        title: "Pick or describe a scene",
        text: "Choose a preset like marble table, beach, or studio gradient — or type your own scene description.",
      },
      {
        title: "Generate studio-grade photos",
        text: "The AI rebuilds the whole scene around your product. Each photo costs one credit; new accounts start with free credits.",
      },
    ],
    features: [
      {
        title: "One photo, any scene",
        text: "Generate marble, beach, studio, wood, and city scenes from a single upload.",
      },
      {
        title: "Your product stays exact",
        text: "The AI keeps the product untouched and rebuilds everything around it.",
      },
      {
        title: "No studio required",
        text: "Skip the photographer, the props, and the reshoots.",
      },
      {
        title: "Marketplace-ready output",
        text: "High-resolution results ready for listings, ads, and shops.",
      },
    ],
    faqs: [
      {
        q: "What do I need to get started?",
        a: "One photo of your product. Any background works — a phone shot on your desk is enough for the AI to work with.",
      },
      {
        q: "Which scenes can I create?",
        a: "Use the presets — marble table, beach scene, studio gradient, wood table, city bokeh — or describe any scene you can imagine.",
      },
      {
        q: "Will my product look the same?",
        a: "Yes. The AI keeps your product exactly as photographed and generates the scene, lighting, and shadows around it.",
      },
      {
        q: "How much does it cost?",
        a: "Each generated photo costs one credit. Creating an account is free and includes starter credits to try it out.",
      },
    ],
    seoSections: [
      {
        h2: "Studio-quality product photos without the studio",
        paragraphs: [
          "Professional product photography means studios, props, lighting, and reshoots every time the catalog changes. AI Product Photography compresses that workflow into one upload: the AI takes your product photo and places it in a studio-grade scene — marble, beach, gradient, wood, or city — with matching light and shadow.",
          "Because the scene is generated, changing your mind costs a credit, not a reshoot. Test ten backgrounds for one SKU before you commit to the one that converts.",
        ],
        image: img("workflow-product"),
      },
    ],
  },

  "/video-background-remover": {
    slug: "/video-background-remover",
    name: "Video Background Remover",
    h1: "Video Background Remover",
    description:
      "Remove the background from your videos and GIFs in one click. Get a clean cutout frame-to-frame, no green screen needed. Free to try, no watermark, and results in under a minute!",
    badges: ["No green screen", "Frame-to-frame AI"],
    editorTool: "video",
    accepts: "video",
    samples: [img("video-ugc-ads"), img("video-agent"), img("video-personas")],
    howTo: [
      {
        title: "Upload a video",
        text: "Select an MP4, MOV, WebM, or MKV file up to 50MB and 60 seconds. GIFs work too.",
      },
      {
        title: "AI removes the background",
        text: "Every frame is processed automatically — no green screen, no manual masking, no keyframing.",
      },
      {
        title: "Download your video",
        text: "Export your video with a transparent or replaced background, watermark-free.",
      },
    ],
    features: [
      {
        title: "No green screen needed",
        text: "The AI tracks your subject in any environment.",
      },
      {
        title: "Frame-to-frame tracking",
        text: "Clean cutouts across motion, hair, and fine detail.",
      },
      {
        title: "Works with GIFs",
        text: "Animated GIFs are supported alongside video formats.",
      },
      {
        title: "Results in under a minute",
        text: "Most clips finish processing in seconds, not hours.",
      },
    ],
    faqs: [
      {
        q: "What video formats are supported?",
        a: "MP4, MOV, WebM, and MKV files up to 50MB and 60 seconds, plus animated GIFs.",
      },
      {
        q: "Do I need a green screen?",
        a: "No. The AI segments the subject in every frame, so you can shoot anywhere — indoors, outdoors, or in front of a busy background.",
      },
      {
        q: "Can I replace the video background with an image?",
        a: "Yes. After removing the background, place your subject over any image or generated scene to create UGC-style ads and product videos.",
      },
      {
        q: "Is there a watermark on the result?",
        a: "No — results are watermark-free, and trying it costs nothing.",
      },
    ],
    seoSections: [
      {
        h2: "One-click background removal for video",
        paragraphs: [
          "Removing a background from video used to require a green screen, manual rotoscoping, or expensive software. Pixelcut's Video Background Remover automates the whole process: upload a clip and the AI produces a clean cutout on every frame, tracking your subject through motion.",
          "It's the fastest way to make UGC-style ads, product videos, and talking-head content that sits cleanly on any background you choose.",
        ],
      },
    ],
  },

  "/ai-ads": {
    slug: "/ai-ads",
    name: "AI Ads",
    h1: "Create influencer & UGC style AI ads",
    description:
      "Create talking videos to promote your brand in seconds. No talent, no shoot, no editing software.",
    badges: ["UGC style", "From a single photo"],
    editorTool: "aiAds",
    accepts: "image",
    samples: [img("workflow-ugc"), img("video-ugc-ads"), img("brand-video")],
    howTo: [
      {
        title: "Upload a product photo",
        text: "Add one shot of your product, or skip the upload and describe your ad idea instead.",
      },
      {
        title: "Describe the creator and the pitch",
        text: "Tell the AI who should present your product and what they should say — style, tone, and the key selling points.",
      },
      {
        title: "Generate your AI ad",
        text: "Each ad costs one credit; new accounts include free credits. Download when it's ready and run it anywhere.",
      },
    ],
    features: [
      {
        title: "UGC-style ads",
        text: "Authentic, creator-looking content that performs on social.",
      },
      {
        title: "AI creators",
        text: "No talent, no shoot, no editing software required.",
      },
      {
        title: "From a single photo",
        text: "One product shot becomes a full ad concept.",
      },
      {
        title: "Made for social",
        text: "Formats and framing that fit feeds, stories, and reels.",
      },
    ],
    faqs: [
      {
        q: "What are AI UGC ads?",
        a: "User-generated-content style ads that look like a real creator filmed them. Pixelcut's AI generates the creator, the setting, and the pitch around your product from a single photo and a description.",
      },
      {
        q: "What do I need to create an ad?",
        a: "One product photo and a short description of the creator and message. The AI handles the rest — scene, lighting, and composition.",
      },
      {
        q: "How much does an AI ad cost?",
        a: "Each generated ad costs one credit. Accounts are free and include starter credits to try it.",
      },
      {
        q: "Can I run these ads on social platforms?",
        a: "Yes — the output is designed for paid and organic social placements, in the aspect ratios feeds expect.",
      },
    ],
    seoSections: [
      {
        h2: "Ads that look like content, not commercials",
        paragraphs: [
          "The best-performing social ads don't look like ads — they look like content. Pixelcut's AI Ads generates influencer-style, UGC-looking creative around your product: authentic settings, natural light, and a creator presenting your pitch.",
          "Instead of booking talent, renting a location, and scheduling a shoot, describe the ad once and let the AI produce it. Iterate on the pitch and the look until the creative converts.",
        ],
        image: img("workflow-ugc"),
      },
    ],
  },

  "/blur-background": {
    slug: "/blur-background",
    name: "Blur Background",
    h1: "Free blur background tool",
    description:
      "Blur the background of any photo online with AI. Keep your subject perfectly sharp while the background melts into smooth, creamy bokeh — free and no sign-up required.",
    badges: ["Free HD Download", "No watermark"],
    editorTool: "blur",
    accepts: "image",
    samples: [img("ba-blur-after"), img("sample-portrait"), img("sample-product")],
    howTo: [
      {
        title: "Upload your image",
        text: "Click Upload image and pick the photo you want to edit. JPG, PNG, and HEIC files up to 50MB are supported — portraits, product shots, and group photos all work.",
      },
      {
        title: "Let the AI work",
        text: "The AI finds your subject and separates it from the background automatically, so the blur lands only where it should — never on faces or products.",
      },
      {
        title: "Adjust the blur amount",
        text: "Want a stronger or softer effect? Move the intensity slider from a gentle 1 to a dreamy 10 and re-apply until the look is right.",
      },
      {
        title: "Download your image",
        text: "Save the finished photo in HD — free, with no watermark — or keep editing with the other tools in the editor.",
      },
    ],
    features: [
      {
        title: "Portrait-mode results",
        text: "Get the shallow depth-of-field look of a pro lens on any photo, even one shot on a phone.",
      },
      {
        title: "Subject stays sharp",
        text: "AI separation means hair, edges, and product detail keep their crispness while the background softens.",
      },
      {
        title: "Adjustable intensity",
        text: "Dial the bokeh from subtle to dramatic with a simple slider — no layers or masks.",
      },
      {
        title: "Free, no sign-up",
        text: "Blur as many photos as you like, anonymously, and download in HD without a watermark.",
      },
    ],
    faqs: [
      {
        q: "How do I blur the background of a photo?",
        a: "Upload your photo and the AI detects the subject automatically. Choose a blur strength and apply — the background softens while your subject stays in focus.",
      },
      {
        q: "Can I control how strong the blur is?",
        a: "Yes. An intensity slider runs from 1 (barely there) to 10 (creamy bokeh). Re-apply with a new value as many times as you like.",
      },
      {
        q: "What kinds of photos work best?",
        a: "Any photo with a clear subject — portraits, pets, products, food. If a human eye can tell what the subject is, the AI can too.",
      },
      {
        q: "Does the blur affect my subject?",
        a: "No. The AI separates subject from background first, so the blur is applied only to the background layer.",
      },
      {
        q: "Is the blur tool free?",
        a: "Yes — background blur is completely free, works without an account, and results download in HD with no watermark.",
      },
    ],
    seoSections: [
      {
        h2: "Blur image backgrounds online, automatically",
        paragraphs: [
          "Photographers spend thousands on fast lenses to get that buttery background separation. Our AI gives any photo the same treatment in seconds: the subject is detected, separated, and kept razor sharp while the background dissolves into smooth bokeh.",
          "Because the separation happens automatically, there are no masks to paint and no depth maps to tune. Upload, choose an intensity, and download — the whole workflow takes under a minute.",
        ],
        image: img("ba-blur-after"),
      },
      {
        h2: "Professional portraits and product shots",
        paragraphs: [
          "A blurred background puts attention exactly where it belongs. Portraits gain a polished, studio feel; product photos pop against a softly defocused scene instead of a cluttered one.",
          "Shops use background blur to make smartphone product shots look intentional and premium — a quick win for listings and ad creative without re-shooting anything.",
        ],
        image: img("ba-blur-before"),
      },
    ],
  },

  "/photo-enhancer": {
    slug: "/photo-enhancer",
    name: "Photo Enhancer",
    h1: "Online AI Photo Enhancer",
    description:
      "Fix blurry, dark, or low-quality photos in one click. Pixelcut's AI photo enhancer improves clarity, color, and lighting automatically — try it free online.",
    badges: ["AI enhanced", "1-click fix"],
    editorTool: "enhance",
    accepts: "image",
    ctaLabel: "Enhance photo",
    samples: [img("ba-upscale-after"), img("sample-watch"), img("sample-man")],
    howTo: [
      {
        title: "Upload your image",
        text: "Click Enhance photo and select the picture you want to improve. JPG, PNG, and HEIC files up to 50MB are supported.",
      },
      {
        title: "Enhance automatically",
        text: "The AI analyzes your photo and corrects exposure, color balance, contrast, and sharpness in one pass — no sliders, no settings.",
      },
      {
        title: "Download your improved photo",
        text: "Save the enhanced result or continue editing — upscale it, remove the background, or add a new one, all in the same editor.",
      },
    ],
    features: [
      {
        title: "Fix blurry photos",
        text: "Recover crisp edges and fine detail that soft focus or motion blur took away.",
      },
      {
        title: "Correct color and lighting",
        text: "Dark, washed-out, or oddly tinted photos get balanced exposure and natural color.",
      },
      {
        title: "One click, zero settings",
        text: "No sliders or menus — the AI decides the right correction for each photo individually.",
      },
      {
        title: "Works on any photo",
        text: "Selfies, landscapes, product shots, and old scans — every photo gets its own tailored enhancement.",
      },
    ],
    faqs: [
      {
        q: "What does the photo enhancer do?",
        a: "It analyzes your photo and automatically improves clarity, sharpness, exposure, contrast, and color balance in a single pass — like a professional retoucher doing a quick pass on your image.",
      },
      {
        q: "Can it fix a blurry photo?",
        a: "Yes. Soft-focus and mild motion blur are the most common fixes — the AI reconstructs edges and detail while keeping the photo natural.",
      },
      {
        q: "Does enhancing increase resolution?",
        a: "Enhancing improves quality — detail, color, and lighting. If you also need more pixels, follow up with the Image Upscaler in the same editor.",
      },
      {
        q: "What's the difference between enhance and upscale?",
        a: "Enhance makes a photo look better at its current size. Upscale makes a photo bigger. The two work great together: enhance first, then upscale.",
      },
      {
        q: "Is the photo enhancer free?",
        a: "Enhance is included with a free account and uses one credit per photo — new accounts come with starter credits to try it.",
      },
      {
        q: "Does it work on old photos?",
        a: "Yes. Faded color, low contrast, and softness from old scans and prints are exactly what the enhancer corrects. For scratched or damaged photos, try Photo Restoration.",
      },
    ],
    seoSections: [
      {
        h2: "Enhance photo quality in one click",
        paragraphs: [
          "Most photos are one small correction away from looking great: a touch of exposure, a bit of sharpening, slightly richer color. The enhancer applies all of those corrections at once, tuned to each individual photo rather than a fixed preset.",
          "Because the AI evaluates every image separately, a snowy landscape and an indoor selfie get completely different treatments — no washed-out winters, no orange skin tones.",
        ],
        image: img("ba-upscale-after"),
      },
      {
        h2: "Rescue low-quality and compressed photos",
        paragraphs: [
          "Photos that traveled through messaging apps, old cameras, or heavy JPG compression lose detail and pick up artifacts. The enhancer cleans up compression damage, restores gradients, and brings back the snap that the file lost along the way.",
          "It's the fastest first step in any edit: enhance, review, then decide whether the photo needs more — a background swap, an upscale, or a crop.",
        ],
      },
    ],
  },

  "/ai-background-generator": {
    slug: "/ai-background-generator",
    name: "AI Background Generator",
    h1: "Free AI Background Generator",
    description:
      "Generate a brand-new background for your photo with AI. Describe any scene and the AI paints it around your subject — studio, marble, beach, or anything you imagine.",
    badges: ["Free with sign-in", "No watermark"],
    editorTool: "generateBackground",
    accepts: "image",
    samples: [img("bg-marble"), img("bg-beach"), img("bg-studio-gray")],
    howTo: [
      {
        title: "Upload your image",
        text: "Start with any photo — the AI removes the existing background automatically as the first step, so no clean cutout is required.",
      },
      {
        title: "Enter a prompt or choose a style",
        text: "Describe the background you want (\"sunlit marble table with soft shadows\") or pick a ready-made preset like Studio, Beach, or Wood.",
      },
      {
        title: "Generate the background",
        text: "The AI paints your described scene behind your subject, matching perspective and lighting so the composite looks real.",
      },
      {
        title: "Download your image",
        text: "Save the finished photo or keep iterating — generate as many variations of the background as you like.",
      },
    ],
    features: [
      {
        title: "Any scene you can describe",
        text: "From clean studio backdrops to exotic locations — if you can write it, the AI can paint it.",
      },
      {
        title: "Subject stays untouched",
        text: "Your product or portrait is preserved exactly; only the environment around it changes.",
      },
      {
        title: "Instant presets",
        text: "Not feeling inspired? One click applies proven backdrops like marble, beach, or gradient.",
      },
      {
        title: "Unlimited variations",
        text: "Generate as many different backgrounds as you want — every try is a new take.",
      },
    ],
    faqs: [
      {
        q: "What is an AI background generator?",
        a: "It's a tool that creates a completely new background for your photo from a text description. Your subject is kept as-is, and the AI paints the scene you describe around it.",
      },
      {
        q: "Do I need a photo with the background already removed?",
        a: "No. Upload any photo and the AI handles background removal as part of the process — you don't need a pre-made cutout.",
      },
      {
        q: "How do I get a realistic result?",
        a: "Describe the scene like a photographer would: the surface, the light, and the mood. \"A white marble table by a window with soft morning light\" beats \"marble background\".",
      },
      {
        q: "Can I use my own background image instead?",
        a: "Yes — the editor's Background panel also lets you place your subject over a preset backdrop image or any solid color.",
      },
      {
        q: "Is it free?",
        a: "Background generation is included with a free account and uses one credit per image. New accounts start with free credits to try it.",
      },
    ],
    seoSections: [
      {
        h2: "Turn one photo into an entire set",
        paragraphs: [
          "Every product shot can live in dozens of scenes: the marble studio version, the beach lifestyle version, the moody city-bokeh version. Generating a new background costs nothing but a sentence — no studio, no props, no reshoots.",
          "Because your subject never changes between takes, the whole set stays perfectly consistent — same product, same angle, same lighting on the subject, different world around it.",
        ],
        image: img("bg-marble"),
      },
      {
        h2: "Backgrounds that match your subject's light",
        paragraphs: [
          "A convincing composite is all about light. The AI matches the direction and warmth of your described scene to the subject, so shadows and highlights fall the way they naturally would.",
          "That's the difference between a background that looks pasted on and one that looks photographed — and it's the reason generated scenes hold up on marketplaces and in ad creative.",
        ],
        image: img("bg-beach"),
      },
    ],
  },

  "/colorize-photo": {
    slug: "/colorize-photo",
    name: "Colorize Photo",
    h1: "Colorize black and white photos with AI",
    description:
      "Add natural, realistic color to old black and white photos with AI. Bring family history back to life in seconds — free and no sign-up required.",
    badges: ["Free to use", "No sign-up"],
    editorTool: "colorize",
    accepts: "image",
    ctaLabel: "Upload photo",
    samples: [img("ba-colorize-after"), img("sample-colorize"), img("ba-colorize-before")],
    howTo: [
      {
        title: "Upload your black and white photo",
        text: "Click Upload photo and select a scan or photo of a monochrome picture. JPG, PNG, and HEIC up to 50MB are supported.",
      },
      {
        title: "Colorize automatically",
        text: "The AI studies the scene and adds plausible color — natural skin tones, era-appropriate clothing, believable environments — without changing the composition.",
      },
      {
        title: "Download your colorized photo",
        text: "Save the colorized version, or keep editing — restore damage, upscale resolution, or enhance detail in the same editor.",
      },
    ],
    features: [
      {
        title: "One-click colorization",
        text: "No color-wheels or layer masks — the AI picks every color for you, sensibly.",
      },
      {
        title: "Natural, realistic tones",
        text: "Skin, fabric, and foliage get colors that fit the scene and the era, not flat tints.",
      },
      {
        title: "Faces stay untouched",
        text: "Identity and expression are preserved exactly — only color is added.",
      },
      {
        title: "Great for family history",
        text: "Scan an old album print and see grandparents' world in color for the first time.",
      },
    ],
    faqs: [
      {
        q: "How does AI photo colorization work?",
        a: "The model has learned what millions of real scenes look like in color. It recognizes the content of your photo — faces, clothing, sky, pavement — and applies colors that are statistically plausible for each element.",
      },
      {
        q: "Are the colors historically accurate?",
        a: "The colors are realistic and era-appropriate, but they're the AI's best guess — no algorithm can recover the true original colors from grayscale alone. Expect beautiful, believable results rather than a historical record.",
      },
      {
        q: "Can it colorize a damaged photo?",
        a: "Yes, and it usually improves it along the way. For heavily scratched or torn photos, Photo Restoration in the same editor does the repair work first.",
      },
      {
        q: "Does colorizing improve quality too?",
        a: "The colorize pass also gently lifts contrast and clarity. For a bigger quality jump, follow up with Enhance or the Image Upscaler.",
      },
      {
        q: "Can I print the colorized photo?",
        a: "Absolutely — download the result and print it like any photo. A follow-up upscale makes large prints crisper.",
      },
      {
        q: "Is colorizing free?",
        a: "Yes. Colorize is free, anonymous, and unlimited — no account and no watermark.",
      },
    ],
    seoSections: [
      {
        h2: "Bring family history back to life",
        paragraphs: [
          "Most family albums start in black and white. Colorizing those photos changes how they feel — grandparents stop being historical figures and become people you might have met, in clothes you could have borrowed.",
          "The whole process takes seconds: scan or photograph the old print, upload it, and let the AI add natural color while keeping every face exactly as it was.",
        ],
        image: img("ba-colorize-after"),
      },
      {
        h2: "Realistic color from grayscale",
        paragraphs: [
          "Old-school colorization meant a retoucher hand-tinting print after print. The AI does something smarter: it understands the content of the photo and chooses colors that make sense — sky gets sky colors, wool gets wool colors, and the result looks photographed rather than painted.",
          "Along with color, the pass gently improves contrast and clarity, so faded monochrome scans come back looking fresh without losing their character.",
        ],
      },
    ],
  },

  "/photo-restoration": {
    slug: "/photo-restoration",
    name: "Photo Restoration",
    h1: "AI photo restoration for old and damaged photos",
    description:
      "Repair scratches, tears, stains, and fading on old photos automatically with AI. Restore family pictures to their former glory — free, online, no sign-up.",
    badges: ["Free to use", "No sign-up"],
    editorTool: "restore",
    accepts: "image",
    ctaLabel: "Upload photo",
    samples: [img("ba-restore-after"), img("sample-restore"), img("ba-restore-before")],
    howTo: [
      {
        title: "Upload your old photo",
        text: "Scan or photograph the damaged picture and upload it. Creases, scratches, stains, fading, and dust are all fair game.",
      },
      {
        title: "Restore automatically",
        text: "The AI repairs the damage, evens out fading, and recovers lost detail — while keeping the subject's face and identity completely unchanged.",
      },
      {
        title: "Download your restored photo",
        text: "Save the restored version in high resolution, or continue with colorization, enhancement, or upscaling in the same editor.",
      },
    ],
    features: [
      {
        title: "Repairs real damage",
        text: "Scratches, tears, stains, creases, dust, and water marks — the AI heals them all.",
      },
      {
        title: "Faces stay the same",
        text: "Restoration reconstructs, never re-imagines — the person in the result is the person in the original.",
      },
      {
        title: "Fading reversed",
        text: "Lost contrast and washed-out color come back, along with the sharpness age took away.",
      },
      {
        title: "Optional colorization",
        text: "Restore and colorize in one pass — or keep the classic black and white look.",
      },
    ],
    faqs: [
      {
        q: "What kinds of damage can be restored?",
        a: "Scratches, creases, folded corners, stains, water damage, dust, mold spots, and heavy fading. Severely torn photos with missing pieces are reconstructed plausibly, though large missing areas are the hardest case.",
      },
      {
        q: "Will the face change?",
        a: "No. The restoration explicitly preserves the subject's identity — the AI repairs the damage around the face and recovers detail without re-drawing the person.",
      },
      {
        q: "Can it restore color photos too?",
        a: "Yes — faded, yellowed, or orange-shifted color prints are a common case. The AI rebalances color while repairing physical damage.",
      },
      {
        q: "Does restoration also enlarge the photo?",
        a: "The restore pass fixes damage and detail at the original size. For bigger prints, follow up with the Image Upscaler, which works beautifully on restored photos.",
      },
      {
        q: "Can it add color to a restored photo?",
        a: "Yes — colorization is built in. It runs by default; switch it off if you prefer an authentic black and white result.",
      },
      {
        q: "Is photo restoration free?",
        a: "Yes — restoration is free, anonymous, and unlimited. No account, no watermark.",
      },
    ],
    seoSections: [
      {
        h2: "The album rescue kit",
        paragraphs: [
          "Every family has a shoebox of photos that age is slowly winning against — creased corners, water stains, colors drifting toward orange. Restoration gives those photos back: damage healed, fading reversed, detail recovered, faces untouched.",
          "Photograph the print with your phone or scan it, upload, and the AI does in seconds what a professional restorer would charge by the hour to do.",
        ],
        image: img("ba-restore-after"),
      },
      {
        h2: "Restored, not re-imagined",
        paragraphs: [
          "The difference between restoration and fabrication is fidelity. This tool is tuned to preserve — the person in the restored photo is recognizably the same person, in the same pose, wearing the same expression. Only the damage disappears.",
          "That's what makes it safe for the photos that matter most: the ones of people you remember, not just images you like.",
        ],
        image: img("ba-restore-before"),
      },
    ],
  },

  "/recolor": {
    slug: "/recolor",
    name: "Recolor",
    h1: "Recolor clothes instantly",
    description:
      "Change the color of any clothing item or object in your photo with AI. Perfect for fashion, e-commerce, and product variations — free online.",
    badges: ["Free to use", "No sign-up"],
    editorTool: "recolor",
    accepts: "image",
    samples: [img("ba-recolor-after"), img("ba-recolor-before"), img("sample-man")],
    howTo: [
      {
        title: "Upload your image",
        text: "Click Upload image and select a photo featuring the item you want to recolor. People, products, and flat-lays all work.",
      },
      {
        title: "Select the item",
        text: "Tell the AI which item to change — \"the shirt\", \"the sneakers\", \"the handbag\". Plain words, no brushing.",
      },
      {
        title: "Change the color",
        text: "Pick any color from the palette or a custom hex. The AI repaints the item with realistic folds, texture, and shading.",
      },
      {
        title: "Download your image",
        text: "Save the recolored photo — or generate a whole color range of the same shot for your store.",
      },
    ],
    features: [
      {
        title: "Any item, any color",
        text: "Clothes, accessories, furniture, walls — if you can name it, you can recolor it.",
      },
      {
        title: "Texture-aware recoloring",
        text: "Folds, fabric weave, and highlights follow the original — the item looks dyed, not painted.",
      },
      {
        title: "Everything else untouched",
        text: "Only the named item changes. The face, pose, background, and other objects stay identical.",
      },
    ],
    faqs: [
      {
        q: "How do I change the color of a shirt in a photo?",
        a: "Upload the photo, type which item to recolor (e.g. \"the shirt\"), pick a color, and apply. The AI repaints just that item with realistic texture.",
      },
      {
        q: "Can I recolor objects other than clothes?",
        a: "Yes — the tool works on any identifiable item: shoes, bags, furniture, product packaging, walls, and more.",
      },
      {
        q: "Can I recolor multiple items at once?",
        a: "Run the tool once per item for the cleanest result — each pass names one target and keeps everything else fixed.",
      },
      {
        q: "Is recoloring free?",
        a: "Yes. Recolor is free, anonymous, and unlimited — no sign-up, no watermark.",
      },
    ],
  },

  "/resize-image": {
    slug: "/resize-image",
    name: "Image Resizer",
    h1: "Free online image resizer",
    description:
      "Resize and crop images to any dimension or ready-made social media preset — Instagram, YouTube, X and more. Fast, free, and no quality loss.",
    badges: ["Free HD Download", "No watermark"],
    editorTool: "resize",
    accepts: "image",
    samples: [img("mosaic-2"), img("mosaic-4"), img("mosaic-6")],
    howTo: [
      {
        title: "Upload your image",
        text: "Click Upload image and select any JPG, PNG, or WebP up to 50MB.",
      },
      {
        title: "Resize your image",
        text: "Pick a social preset (Instagram post, story, YouTube thumbnail…) or enter exact width and height in pixels. Choose crop-to-fill or fit-with-padding.",
      },
      {
        title: "Download your resized image",
        text: "Save the result — resolution is preserved or improved, never upscaled beyond what the source allows. Free, no watermark.",
      },
    ],
    features: [
      {
        title: "Exact pixel control",
        text: "Enter any width and height, or scale by a single dimension while keeping the aspect ratio.",
      },
      {
        title: "Social media presets",
        text: "One tap for Instagram posts and stories, YouTube thumbnails, X posts, LinkedIn banners, and profile pictures.",
      },
      {
        title: "Crop or pad",
        text: "Fill the frame with a centered crop, or fit the whole image with clean padding — your choice.",
      },
    ],
    faqs: [
      {
        q: "How do I resize an image online for free?",
        a: "Upload your image, choose a preset or enter the exact dimensions you need, and download. The whole process is free and requires no sign-up.",
      },
      {
        q: "Will resizing reduce quality?",
        a: "No — resizing uses high-quality resampling. Results are saved at up to 92 quality, and since images are only ever scaled down (or kept), no detail is invented or lost to upscaling artifacts.",
      },
      {
        q: "What's the maximum size?",
        a: "You can set any target dimension up to 12,000 pixels per side, and upload source images up to 50MB.",
      },
      {
        q: "Does it work for social media sizes?",
        a: "Yes — common presets are built in: Instagram post (1080×1080), portrait (1080×1350), story (1080×1920), YouTube thumbnail (1280×720), X post (1600×900), LinkedIn banner (1584×396), and profile pictures (800×800).",
      },
    ],
  },

  "/ai-art-generator": {
    slug: "/ai-art-generator",
    name: "AI Art Generator",
    h1: "AI Art Generator",
    description:
      "Create stunning AI art from a text description. Pick a style, describe your idea, and generate high-resolution artwork in seconds — free to try.",
    badges: ["Free to try", "No watermarks"],
    editorTool: "generate",
    accepts: "image",
    samples: [img("art-1"), img("art-2"), img("art-3"), img("mosaic-1")],
    styleChips: ["Digital painting", "Oil painting", "Anime", "Watercolor", "3D render", "Pixel art", "Cyberpunk", "Minimalist"],
    showPricing: true,
    howTo: [
      {
        title: "Enter your text prompt",
        text: "Describe the artwork you imagine — subject, style, mood, colors. The more specific the description, the closer the result.",
      },
      {
        title: "Pick a style",
        text: "Optional style chips like \"Digital painting\" or \"Anime\" steer the model toward a look — or write the style directly in your prompt.",
      },
      {
        title: "Generate art",
        text: "Hit Generate and watch the model paint your idea in high resolution. Not quite right? Tweak the prompt and go again.",
      },
      {
        title: "Download your artwork",
        text: "Save the image you love, or keep iterating — every generation is a new interpretation of your idea.",
      },
    ],
    features: [
      {
        title: "Lightning fast",
        text: "Full-resolution art in seconds — no brushes, no layers, no waiting.",
      },
      {
        title: "Any style",
        text: "Painterly, photographic, anime, 3D, abstract — the model follows the style you describe.",
      },
      {
        title: "High resolution",
        text: "Generate in print-ready resolutions up to 1024px per side and upscale beyond.",
      },
      {
        title: "Free to try",
        text: "New accounts include starter credits — your first artworks are on us.",
      },
    ],
    faqs: [
      {
        q: "What is an AI art generator?",
        a: "It's a tool that turns a text description into an original image. You write what you want to see — style, subject, mood — and the AI model paints it from scratch.",
      },
      {
        q: "How do I write a good prompt?",
        a: "Name the subject, the style, and the mood. \"A lighthouse in a storm, oil painting style, dramatic lighting\" gives the model everything it needs; \"lighthouse\" doesn't.",
      },
      {
        q: "Can I use AI art commercially?",
        a: "Yes — images you generate are yours to use, including for commercial projects like covers, ads, and merch.",
      },
      {
        q: "Is the AI art generator free?",
        a: "It's free to try — every account starts with credits. Each generation uses one credit; monthly credits refresh on paid plans.",
      },
      {
        q: "Who owns the art I generate?",
        a: "You do. Generate it, download it, use it — the artwork comes with no watermark and no licensing complications.",
      },
    ],
    seoSections: [
      {
        h2: "From words to masterpieces",
        paragraphs: [
          "Every piece of art starts the same way: an idea. The gap between the idea and the canvas is where most people stop. An AI art generator closes that gap — you describe the picture in your head, and the model renders it in high resolution while the idea is still fresh.",
          "Iterate at the speed of thought: keep the parts that work, adjust the parts that don't, and regenerate in seconds. A hundred variations of a concept cost an evening, not a month.",
        ],
        image: img("art-1"),
      },
      {
        h2: "Styles as easy as words",
        paragraphs: [
          "Digital painting, oil on canvas, anime, watercolor, 3D render, pixel art — each style is just a phrase away. Combining them is where it gets fun: \"a watercolor city with neon cyberpunk lighting\" is a perfectly valid prompt.",
          "The same idea rendered in five styles gives you five directions for a project — mood boards, concept art, book covers, or album art, explored in minutes.",
        ],
        image: img("art-3"),
      },
    ],
  },

  "/ai-logos": {
    slug: "/ai-logos",
    name: "AI Logo Generator",
    h1: "AI Logo Generator",
    description:
      "Design a professional logo with AI in seconds. Describe your business, pick a style, and generate polished logo concepts — free to try online.",
    badges: ["Free HD Download", "No watermark"],
    editorTool: "generate",
    accepts: "image",
    samples: [img("logos-1"), img("mosaic-5"), img("mosaic-3")],
    styleChips: ["Modern", "Cartoon", "Futuristic", "Monogram", "Vintage", "Mascot"],
    howTo: [
      {
        title: "Describe your business",
        text: "Tell the AI what your brand does and what it stands for — \"a cozy neighborhood coffee roastery\" beats \"coffee shop\".",
      },
      {
        title: "Choose a style",
        text: "Modern, cartoon, futuristic, monogram, vintage, or mascot — pick the personality that fits your brand.",
      },
      {
        title: "Generate and download",
        text: "Get polished logo concepts in seconds. Download the one you love, or regenerate with a tweaked description.",
      },
    ],
    features: [
      {
        title: "From brief to logo in seconds",
        text: "No design experience, no vector software — just describe your business.",
      },
      {
        title: "Six design directions",
        text: "Explore clean modern marks, playful cartoons, futuristic geometry, classic monograms, and more.",
      },
      {
        title: "Polished, usable results",
        text: "Concepts come back clean and centered — ready for a profile picture, a business card, or a website header.",
      },
    ],
    faqs: [
      {
        q: "How do I create a logo with AI?",
        a: "Describe your business and pick a style. The AI generates logo concepts instantly — download your favorite and use it anywhere.",
      },
      {
        q: "Can I create a logo without design skills?",
        a: "Yes — that's the point. Your job is describing your business; the model handles composition, balance, and typography.",
      },
      {
        q: "What logo styles can I generate?",
        a: "Modern, cartoon, futuristic, monogram, vintage, and mascot styles are one click away — or describe any other style in your own words.",
      },
      {
        q: "Is the logo mine to use?",
        a: "Yes. Logos you generate are yours — download them in high definition with no watermark.",
      },
    ],
  },

  "/profile-picture-maker": {
    slug: "/profile-picture-maker",
    name: "Profile Picture Maker",
    h1: "Make a profile picture for free",
    description:
      "Turn any selfie into a polished profile picture with AI. Professional studio, gradient, and outdoor styles — free online, no sign-up required.",
    badges: ["Free to use", "No sign-up"],
    editorTool: "profilePicture",
    accepts: "image",
    ctaLabel: "Upload picture",
    samples: [img("profilepic-1"), img("profilepic-2"), img("profilepic-3")],
    howTo: [
      {
        title: "Upload your picture",
        text: "Click Upload picture and select a selfie or portrait. Good lighting in the original gives the best result, but the AI works with what it gets.",
      },
      {
        title: "Choose a style",
        text: "Pick the vibe — professional studio, vibrant gradient, warm outdoor, or classic black and white.",
      },
      {
        title: "Edit your picture",
        text: "The AI centers the shot, refines skin and lighting, and replaces the background — while keeping you looking like you.",
      },
      {
        title: "Download your profile picture",
        text: "Save it in square format, ready for LinkedIn, Instagram, X, and every other profile that needs a face.",
      },
      {
        title: "Share it everywhere",
        text: "One great profile picture works everywhere — use the same polished shot across all your accounts for a consistent presence.",
      },
    ],
    features: [
      {
        title: "Looks like you",
        text: "The refinement is subtle — identity, expression, and character are preserved.",
      },
      {
        title: "Five polished styles",
        text: "Studio, gradient, outdoor, black and white, or LinkedIn-ready — one click each.",
      },
      {
        title: "Square and social-ready",
        text: "The output framing works as a profile picture everywhere, from professional networks to social apps.",
      },
    ],
    faqs: [
      {
        q: "How do I make a good profile picture?",
        a: "Start with a photo where your face is clearly visible and well-lit. Upload it, pick a style, and the AI handles centering, background, and polish.",
      },
      {
        q: "Will it still look like me?",
        a: "Yes — the enhancement is deliberately conservative. Lighting and background change; your face and expression don't.",
      },
      {
        q: "Why is my profile picture blurry on some platforms?",
        a: "Some platforms compress aggressively. Generate at high resolution, download the full-quality file, and upload the largest version the platform accepts.",
      },
      {
        q: "What resolution do profile pictures need?",
        a: "800×800 covers every major platform, including ones that display at 400×400 or smaller — sharper source, sharper display.",
      },
      {
        q: "Is the profile picture maker free?",
        a: "Yes — free, anonymous, and unlimited. No account required and no watermark on downloads.",
      },
    ],
  },

  "/virtual-try-on": {
    slug: "/virtual-try-on",
    name: "Virtual Try-On",
    h1: "Try clothes on virtual models",
    description:
      "Show your clothes on AI-generated fashion models. Upload a garment photo and dress diverse virtual models — no photoshoot, no studio, no retouching.",
    badges: ["AI models", "Diverse looks"],
    editorTool: "virtualTryOn",
    accepts: "image",
    ctaLabel: "Upload photo",
    samples: [img("tryon-1"), img("tryon-2"), img("tryon-3")],
    howTo: [
      {
        title: "Upload your photo",
        text: "Upload a photo of a person (a model, a mannequin, or yourself) that you want to dress, or start from a product shot on a plain background.",
      },
      {
        title: "Describe the outfit",
        text: "Tell the AI what they should wear — \"an elegant coral summer dress\" — and, optionally, the model's look: age range, hair, style.",
      },
      {
        title: "Generate and download",
        text: "The AI renders the garment on the person with realistic draping, lighting, and shadows. Download the images that sell.",
      },
    ],
    features: [
      {
        title: "No photoshoot needed",
        text: "Skip the booking, the studio, and the retouching — describe the shot instead.",
      },
      {
        title: "Realistic garment rendering",
        text: "Fabric drapes, folds, and catches light like fabric, not a sticker.",
      },
      {
        title: "Diverse model looks",
        text: "Describe the model you want — different ages, hair, and styles on demand.",
      },
      {
        title: "Made for fashion e-commerce",
        text: "Consistent on-model imagery across a whole catalog, at a fraction of photoshoot cost.",
      },
    ],
    faqs: [
      {
        q: "How does virtual try-on work?",
        a: "Upload a photo of a person and describe the clothing. The AI renders the garment onto the person — matching pose, lighting, and body — while keeping their face and identity intact.",
      },
      {
        q: "What clothing does it work with?",
        a: "Tops, dresses, jackets, and full outfits all render well. The clearer the garment description, the better the result.",
      },
      {
        q: "Can I use my own model photos?",
        a: "Yes — any photo with a clearly visible person works: a model, a mannequin dressed in your garment, or yourself.",
      },
      {
        q: "Does it work for men's and women's fashion?",
        a: "Yes. Describe the garment and the model look you want, for any line.",
      },
      {
        q: "How much does it cost?",
        a: "Each try-on generation uses one credit. Free accounts include starter credits, and paid plans refresh monthly.",
      },
    ],
  },
}
