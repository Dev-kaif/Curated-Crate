"use client"

import type React from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { User, Package, MapPin, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageLayout } from "@/components/Layout/page-layout"

interface AccountLayoutProps {
  children: React.ReactNode
}

export function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/account/dashboard", icon: LayoutDashboard },
    { name: "Order History", href: "/account/orders", icon: Package },
    { name: "My Profile", href: "/account/profile", icon: User },
    { name: "Saved Addresses", href: "/account/addresses", icon: MapPin },
  ]

  return (
    <PageLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1"
            >
              <Card className="p-6 bg-background border-0 shadow-lg sticky top-24">
                <h2 className="font-serif font-bold text-xl text-foreground mb-6">My Account</h2>
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-full transition-colors ${
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-3 text-foreground/70 hover:text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </Button>
                </nav>
              </Card>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {children}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
