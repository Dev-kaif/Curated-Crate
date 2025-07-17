"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Package, Heart, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccountLayout } from "@/components/account-layout";
import { useStore } from "@/contexts/store-context";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
import { IOrder } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountDashboard() {
  const { state } = useStore();
  const { data: session } = useSession();

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get<IOrder[]>("/api/orders");
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session]);

  const userName = session?.user?.name || "User";
  const recentOrders = orders.slice(0, 3);

  const stats = [
    { name: "Total Orders", value: orders.length, icon: Package, href: "/account/orders" },
    { name: "Wishlist Items", value: state.wishlist.length, icon: Heart, href: "/wishlist" },
    { name: "Cart Items", value: state.cart.items.length, icon: ShoppingBag, href: "/cart" },
  ];

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
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <Card className="bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground/60 text-sm font-medium">{stat.name}</p>
                      <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {isLoading ? <Skeleton className="h-8 w-10 mt-1" /> : stat.value}
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
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-foreground/5 rounded-lg">
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-24"/>
                           <Skeleton className="h-3 w-20"/>
                        </div>
                         <div className="text-right space-y-2">
                           <Skeleton className="h-4 w-16"/>
                           <Skeleton className="h-5 w-20 rounded-full"/>
                        </div>
                     </div>
                  ))
                ) : recentOrders.length > 0 ? (
                  recentOrders.map((order, index) => (
                    <motion.div
                      key={order._id as string}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-foreground/5 rounded-lg hover:bg-foreground/10 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-foreground">#{(order._id as string).slice(-6).toUpperCase()}</p>
                        <p className="text-sm text-foreground/60">{new Date(order.createdAt!).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">${order.totalPrice.toFixed(2)}</p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full capitalize ${
                            order.orderStatus === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.orderStatus === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-foreground/70 py-8">You haven't placed any orders yet.</p>
                )}
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