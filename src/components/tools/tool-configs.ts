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
}
