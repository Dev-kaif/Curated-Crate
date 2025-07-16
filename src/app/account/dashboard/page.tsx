"use client"

import { motion } from "framer-motion"
import { Package, Heart, ShoppingBag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AccountLayout } from "@/components/account-layout"
import { useStore } from "@/contexts/store-context"
import Link from "next/link"

export default function AccountDashboard() {
  const { state } = useStore()
  const userName = "Sarah Johnson" // In a real app, this would come from user context

  const stats = [
    { name: "Total Orders", value: "12", icon: Package, href: "/account/orders" },
    { name: "Wishlist Items", value: state.wishlist.length.toString(), icon: Heart, href: "/wishlist" },
    { name: "Cart Items", value: state.cart.length.toString(), icon: ShoppingBag, href: "/cart" },
  ]

  const recentOrders = [
    { id: "CC-ABC123", date: "2024-01-15", total: 89.99, status: "Delivered" },
    { id: "CC-DEF456", date: "2024-01-10", total: 124.5, status: "Shipped" },
    { id: "CC-GHI789", date: "2024-01-05", total: 67.25, status: "Processing" },
  ]

  return (
    <AccountLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Welcome back, {userName}!</h1>
          <p className="text-foreground/70">Here's what's happening with your account</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => (
            <Link key={stat.name} href={stat.href}>
              <Card className="bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground/60 text-sm font-medium">{stat.name}</p>
                      <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {stat.value}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-background border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-bold text-foreground">Recent Orders</h2>
                <Link href="/account/orders">
                  <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-foreground/5 rounded-lg hover:bg-foreground/10 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{order.id}</p>
                      <p className="text-sm text-foreground/60">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">${order.total}</p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-background border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-serif font-bold text-foreground mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/shop">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-full">
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/account/profile">
                  <Button variant="outline" className="w-full py-3 rounded-full bg-transparent">
                    Update Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AccountLayout>
  )
}
