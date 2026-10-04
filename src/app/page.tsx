"use client"

import { useEffect } from "react"
import { useRouter, ROUTES } from "@/lib/router"
import { useAuthStore } from "@/stores/auth"
import { AuthModal } from "@/components/auth/auth-modal"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { LandingPage } from "@/components/site/landing-page"
import { PricingPage } from "@/components/site/pricing-page"
import { ToolsIndexPage } from "@/components/tools/tools-index-page"
import { ToolPage } from "@/components/tools/tool-page"
import { ToolPageConfig } from "@/components/tools/tool-configs"
import { EditorPage } from "@/components/editor/editor-page"
import { GeneratePage } from "@/components/editor/generate-page"

const FULLSCREEN_ROUTES = [ROUTES.editor, ROUTES.generate]

export default function Home() {
  const { route } = useRouter()
  const { fetchMe, authModalOpen, setAuthModalOpen, authModalSuccess } =
    useAuthStore()

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  const isFullscreen = FULLSCREEN_ROUTES.includes(route.path as typeof ROUTES.editor)

  let content: React.ReactNode
  switch (route.path) {
    case ROUTES.pricing:
      content = <PricingPage />
      break
    case ROUTES.tools:
      content = <ToolsIndexPage />
      break
    case ROUTES.editor:
      content = <EditorPage query={route.query} />
      break
    case ROUTES.generate:
      content = <GeneratePage />
      break
    default: {
      const config = ToolPageConfig[route.path]
      content = config ? (
        <ToolPage config={config} route={route} />
      ) : (
        <LandingPage />
      )
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      {!isFullscreen && <Header />}
      <main className="flex-1 flex flex-col">{content}</main>
      {!isFullscreen && <Footer />}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          if (authModalSuccess) authModalSuccess()
          setAuthModalOpen(false)
        }}
      />
    </div>
  )
}
