import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Pixelcut | Free AI Photo Editor",
  description:
    "Create studio-quality visuals with AI. Join 70 million sellers making images and videos with AI. Remove backgrounds, upscale images, erase objects and more — free.",
  keywords: [
    "Pixelcut",
    "AI photo editor",
    "background remover",
    "image upscaler",
    "magic eraser",
    "AI image generator",
  ],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Pixelcut | Free AI Photo Editor",
    description: "Create studio-quality visuals with AI.",
    siteName: "Pixelcut",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
