"use client"

import type React from "react"

import { Navigation } from "@/components/Layout/Navbar"
import { Footer } from "@/components/Layout/footer"
import { SearchOverlay } from "@/components/Layout/search-overlay"

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navigation />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  )
}
