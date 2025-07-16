"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export const FeaturedItemsSection = () => {
  const products = [
    { name: "Lavender Candle", price: "$24", image: "/placeholder.svg?height=200&width=200" },
    { name: "Artisan Chocolate", price: "$18", image: "/placeholder.svg?height=200&width=200" },
    { name: "Herbal Tea Set", price: "$32", image: "/placeholder.svg?height=200&width=200" },
    { name: "Hand Cream", price: "$16", image: "/placeholder.svg?height=200&width=200" },
    { name: "Notebook", price: "$22", image: "/placeholder.svg?height=200&width=200" },
    { name: "Bath Salts", price: "$20", image: "/placeholder.svg?height=200&width=200" },
    { name: "Coffee Beans", price: "$28", image: "/placeholder.svg?height=200&width=200" },
    { name: "Soap Bar", price: "$14", image: "/placeholder.svg?height=200&width=200" },
  ]

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">Explore Our Collection</h2>
          <Link href="/shop">
            <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full">
              View All Products
            </Button>
          </Link>
        </motion.div>

        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-64"
              >
                <Card className="overflow-hidden bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-serif font-bold text-lg text-foreground mb-2">{product.name}</h3>
                    <p className="text-primary font-bold text-xl">{product.price}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}