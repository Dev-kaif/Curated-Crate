"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { useParams } from "next/navigation"
import { Heart, Minus, Plus, Star, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageLayout } from "@/components/Layout/page-layout"
import { useStore, type Product } from "@/contexts/store-context"
import Link from "next/link"

// Mock product data (in a real app, this would come from an API)
const mockProduct: Product = {
  id: "1",
  name: "Lavender Candle",
  price: 24,
  image: "/placeholder.svg?height=500&width=500",
  category: "Wellness",
  description:
    "Hand-poured soy candle with natural lavender essential oil. Perfect for creating a relaxing atmosphere in any room.",
  specifications: {
    "Burn Time": "45-50 hours",
    Dimensions: '3.5" x 4"',
    Weight: "8 oz",
    Materials: "100% Soy Wax, Cotton Wick",
    "Scent Notes": "Lavender, Vanilla, Cedar",
  },
}

const mockReviews = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    comment: "Absolutely love this candle! The scent is perfect and it burns evenly.",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Michael R.",
    rating: 5,
    comment: "Great quality and the packaging was beautiful. Perfect for gifts!",
    date: "2024-01-10",
  },
  {
    id: 3,
    name: "Emma L.",
    rating: 4,
    comment: "Beautiful candle with a lovely scent. Burns for a long time too.",
    date: "2024-01-05",
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const { dispatch, state } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  // In a real app, you'd fetch the product based on params.id
  const product = mockProduct

  const images = [
    product.image,
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
  ]

  const isInWishlist = state.wishlist.some((item) => item.id === product.id)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: "ADD_TO_CART", product })
    }
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", productId: product.id })
    } else {
      dispatch({ type: "ADD_TO_WISHLIST", product })
    }
  }

  return (
    <PageLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/shop" className="flex items-center text-foreground/60 hover:text-primary transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Shop
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl overflow-hidden">
                <img
                  src={images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-primary" : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div>
                <p className="text-primary font-medium mb-2">{product.category}</p>
                <h1 className="text-4xl font-serif font-bold text-foreground mb-4">{product.name}</h1>
                <p className="text-foreground/70 text-lg leading-relaxed">{product.description}</p>
              </div>

              <div className="text-3xl font-bold text-primary">${product.price}</div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="font-medium text-foreground">Quantity:</span>
                <div className="flex items-center border border-foreground/20 rounded-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-full"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-medium rounded-full"
                >
                  Add to Box - ${(product.price * quantity).toFixed(2)}
                </Button>

                <Button
                  onClick={handleWishlistToggle}
                  variant="outline"
                  size="lg"
                  className="w-full py-4 text-lg font-medium rounded-full bg-transparent"
                >
                  <Heart className={`w-5 h-5 mr-2 ${isInWishlist ? "fill-primary text-primary" : ""}`} />
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Product Details Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="description" className="rounded-full">
                  Full Description
                </TabsTrigger>
                <TabsTrigger value="specifications" className="rounded-full">
                  Specifications
                </TabsTrigger>
                <TabsTrigger value="shipping" className="rounded-full">
                  Shipping Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <Card className="p-8 bg-background border-0 shadow-lg">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-foreground/80 leading-relaxed mb-4">
                      Our {product.name} is carefully crafted by skilled artisans who take pride in every detail. Each
                      candle is hand-poured using premium soy wax and natural essential oils, ensuring a clean burn and
                      authentic fragrance experience.
                    </p>
                    <p className="text-foreground/80 leading-relaxed mb-4">
                      The lavender used in this candle is sourced from sustainable farms, and the cotton wick provides
                      an even burn that will fill your space with a calming, therapeutic aroma. Perfect for meditation,
                      relaxation, or creating a cozy atmosphere for any occasion.
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                      This candle makes an excellent addition to any gift box, especially for those who appreciate
                      natural, handcrafted products that promote wellness and tranquility.
                    </p>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="specifications">
                <Card className="p-8 bg-background border-0 shadow-lg">
                  <div className="grid md:grid-cols-2 gap-6">
                    {product.specifications &&
                      Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-foreground/10">
                          <span className="font-medium text-foreground">{key}:</span>
                          <span className="text-foreground/70">{value}</span>
                        </div>
                      ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="shipping">
                <Card className="p-8 bg-background border-0 shadow-lg">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-foreground mb-2">Shipping Options</h3>
                      <ul className="space-y-2 text-foreground/70">
                        <li>• Standard Shipping (5-7 business days): Free on orders over $50</li>
                        <li>• Express Shipping (2-3 business days): $9.99</li>
                        <li>• Overnight Shipping (1 business day): $19.99</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-foreground mb-2">Packaging</h3>
                      <p className="text-foreground/70">
                        All items are carefully packaged in eco-friendly materials to ensure they arrive in perfect
                        condition. Fragile items like candles receive extra protection during shipping.
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif font-bold text-foreground">Customer Reviews</h2>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
                Write a Review
              </Button>
            </div>

            <div className="grid gap-6">
              {mockReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-background border-0 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <p className="font-medium text-foreground">{review.name}</p>
                        <p className="text-sm text-foreground/60">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-foreground/80 leading-relaxed">{review.comment}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}
