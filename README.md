# Pixelcut — Full-Stack Recreation

A pixel-precision, full-stack recreation of [pixelcut.ai](https://www.pixelcut.ai) built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui, Prisma + SQLite, and the z-ai-web-dev-sdk for real AI image processing.

## What's included

### Marketing site (hash-routed SPA under `/`)
- **Landing page** — hero, interactive app demo mockup (sidebar + generate grid + prompt bar + Desktop/Mobile toggle), logo row, Creative Agent gradient section, workflow video cards, 6 draggable before/after sliders, on-brand cards, image mosaic, testimonials, final CTA
- **Pricing** — Monthly/Yearly toggle, Free/Pro/Business cards, comparison table, "How do credits work?" model table
- **9 tool landing pages** — background remover, image upscaler, magic eraser, uncrop, generative fill, AI image generator, AI product photography, video background remover, AI ads — each with upload dropzone, samples, how-to steps, use cases, features, SEO copy, FAQ accordions

### The app
- **Auth** — "Sign Up or Log In" modal → Continue with Google/Apple (documented external deps) / email → 6-digit verification code → session cookie (30d). New users get 10 free credits.
- **AI Image Editor** (`#/editor`) — top toolbar (Back, Get Pro, rate, undo/redo, Compare, Download with preview/full-resolution gating, Designer), left tool rail (Background/Retouch/Expand/Upscale/Enhance), checkerboard canvas with zoom, right panel (color swatches with live canvas compositing, custom color, Generate Background, preset Image Backgrounds, Shadow/Blur), bottom AI prompt bar
- **Generate** (`#/generate`) — prompt composer with model/size/count chips, AI text-to-image (credits-gated), results grid with download/lightbox/delete, recent projects history
- **Credits system** — generation tools require sign-in + 1 credit per operation; free tools (background removal, upscale, etc.) work anonymously; 402 handling with upgrade CTA

### Backend (API routes)
- `POST /api/auth/email/request|verify`, `GET /api/auth/me`, `POST /api/auth/logout`, `POST /api/auth/google|apple` (501 documented)
- `POST /api/tools/*` — remove-background, upscale, magic-eraser, generative-fill, uncrop, generate, generate-background, enhance, retouch, shadow, blur, product-photography, ai-ads — all backed by real AI calls (`zai.images.generations.create/edit`), with 90s timeouts, credit checks, and project persistence
- `GET /api/projects`, `DELETE /api/projects/[id]`, `GET /api/health`

### Database (Prisma + SQLite)
`User` (email, credits, plan) · `Session` (token) · `LoginCode` (6-digit email codes) · `Project` (tool, prompt, original/result images)

## Getting started

```bash
bun install
bun run db:push          # apply Prisma schema to SQLite
bun run dev              # start on http://localhost:3000
```

Uploads/results are written to `public/uploads/` and `public/results/`. Static sample assets live in `public/images/`.

## Environment variables

| Variable | Purpose | Required |
|---|---|---|
| `DATABASE_URL` | SQLite file path | yes (already set) |
| `RESEND_API_KEY` | Sending login codes by email (falls back to showing the code in the UI when absent) | no |
| `GOOGLE_CLIENT_ID` / `APPLE_CLIENT_ID` | OAuth social sign-in buttons | no |
| `STRIPE_SECRET_KEY` | Pro/Business checkout | no |

No secrets are hardcoded; all AI processing runs server-side through `z-ai-web-dev-sdk`.

## Project structure

```
src/
  app/                  # Next.js app router (single / route + /api/* routes)
  components/
    site/               # header, footer, landing, pricing, shared marketing components
    auth/               # sign-up/login modal (email + code flow)
    tools/              # tool landing pages + upload zone + configs
    editor/             # AI image editor + generate workspace
  lib/                  # router, db, ai helpers
  stores/               # zustand auth store
prisma/                 # schema
public/images/          # generated sample assets
```
