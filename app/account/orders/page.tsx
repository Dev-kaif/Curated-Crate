"use client"

import { motion } from "framer-motion"
import { Package, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AccountLayout } from "@/components/account-layout"

export default function OrderHistoryPage() {
  const orders = [
    { id: "CC-ABC123", date: "2024-01-15", total: 89.99, status: "Delivered", items: 3 },
    { id: "CC-DEF456", date: "2024-01-10", total: 124.5, status: "Shipped", items: 5 },
    { id: "CC-GHI789", date: "2024-01-05", total: 67.25, status: "Processing", items: 2 },
    { id: "CC-JKL012", date: "2023-12-28", total: 156.75, status: "Delivered", items: 4 },
    { id: "CC-MNO345", date: "2023-12-20", total: 92.3, status: "Delivered", items: 3 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AccountLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Order History</h1>
          <p className="text-foreground/70">Track and manage your past orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-background border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-foreground/5">
                    <tr>
                      <th className="text-left p-4 font-medium text-foreground">Order ID</th>
                      <th className="text-left p-4 font-medium text-foreground">Date</th>
                      <th className="text-left p-4 font-medium text-foreground">Items</th>
                      <th className="text-left p-4 font-medium text-foreground">Total</th>
                      <th className="text-left p-4 font-medium text-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="border-b border-foreground/10 hover:bg-foreground/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium text-foreground">{order.id}</span>
                          </div>
                        </td>
                        <td className="p-4 text-foreground/70">{order.date}</td>
                        <td className="p-4 text-foreground/70">{order.items} items</td>
                        <td className="p-4 font-medium text-foreground">${order.total}</td>
                        <td className="p-4">
                          <Badge className={`${getStatusColor(order.status)} border-0`}>{order.status}</Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AccountLayout>
  )
}
