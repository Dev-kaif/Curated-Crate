"use client"

import type React from "react"
import Link from "next/link"
import { SearchOverlay } from "@/components/Layout/search-overlay"

interface CheckoutLayoutProps {
  children: React.ReactNode
}

export function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="py-6 px-6 border-b border-foreground/10">
        <div className="container mx-auto">
          <Link href="/" className="text-2xl font-serif font-bold text-foreground hover:text-primary transition-colors">
            Curated Crate
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
