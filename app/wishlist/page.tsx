"use client"

import { motion } from "framer-motion"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageLayout } from "@/components/Layout/page-layout"
import { useStore } from "@/contexts/store-context"
import Link from "next/link"

export default function WishlistPage() {
  const { state, dispatch } = useStore()

  const moveToCart = (product: any) => {
    dispatch({ type: "ADD_TO_CART", product })
    dispatch({ type: "REMOVE_FROM_WISHLIST", productId: product.id })
  }

  const removeFromWishlist = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", productId })
  }

  if (state.wishlist.length === 0) {
    return (
      <PageLayout>
        <div className="py-20 px-6">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-md mx-auto space-y-6"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-foreground">Your Wishlist is Empty</h1>
              <p className="text-foreground/70 text-lg">
                Explore our collection to find something you love and save it for later.
              </p>
              <Link href="/shop">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full">
                  Explore Collection
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">My Wishlist</h1>
            <p className="text-xl text-foreground/70">Items you've saved for later</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {state.wishlist.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Link href={`/shop/details/${product.id}`}>
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-6">
                    <Link href={`/shop/details/${product.id}`}>
                      <h3 className="font-serif font-bold text-lg text-foreground mb-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-foreground/60 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <p className="text-primary font-bold text-xl mb-4">${product.price}</p>

                    <div className="space-y-2">
                      <Button
                        onClick={() => moveToCart(product)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Move to Box
                      </Button>
                      <Button
                        onClick={() => removeFromWishlist(product.id)}
                        variant="outline"
                        className="w-full rounded-full bg-transparent"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
