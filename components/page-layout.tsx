"use client"

import type React from "react"

import { Navigation } from "@/components/Navbar"
import { Footer } from "@/components/footer"
import { SearchOverlay } from "@/components/search-overlay"

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navigation />
      <SearchOverlay />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  )
}
