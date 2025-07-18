"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckoutLayout } from "@/components/checkout-layout"
import Link from "next/link"

export default function OrderSuccessPage() {
  const orderId = "CC-" + Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <CheckoutLayout>
      <div className="py-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
                Thank You For Your Order!
              </h1>
              <p className="text-xl text-foreground/70 mb-8">
                Your order has been placed successfully. An email receipt is on its way.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-8 bg-background border-0 shadow-lg mb-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">Order ID:</span>
                    <span className="font-bold text-primary text-lg">{orderId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">Estimated Delivery:</span>
                    <span className="text-foreground/70">5-7 business days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">Tracking Info:</span>
                    <span className="text-foreground/70">Will be sent via email</span>
                  </div>
                </div>
              </Card>

              <div className="flex flex-col gap-5">
                <Link href="/shop">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg rounded-full">
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/account/orders">
                  <Button variant="outline" className="w-full py-3 rounded-full bg-transparent">
                    View Order History
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  )
}
