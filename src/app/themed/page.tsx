"use client"

import { motion } from "framer-motion"
import { Gift, Heart, Coffee, Baby, Sparkles, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageLayout } from "@/components/Layout/page-layout"
import Link from "next/link"

export default function ThemedBoxesPage() {
  const themedBoxes = [
    {
      id: "birthday",
      name: "The Birthday Crate",
      description: "Make their special day unforgettable with curated birthday essentials",
      price: 89,
      originalPrice: 105,
      image: "/placeholder.svg?height=400&width=400",
      icon: Gift,
      items: ["Birthday candle", "Gourmet treats", "Celebration tea", "Party favors", "Personalized card"],
      colors: ["bg-pink-100", "text-pink-800"],
      popular: true,
    },
    {
      id: "relaxation",
      name: "The Relaxation Ritual",
      description: "Everything needed for the perfect self-care evening",
      price: 124,
      originalPrice: 145,
      image: "/placeholder.svg?height=400&width=400",
      icon: Heart,
      items: ["Lavender candle", "Bath salts", "Herbal tea blend", "Silk eye mask", "Essential oil roller"],
      colors: ["bg-purple-100", "text-purple-800"],
      popular: false,
    },
    {
      id: "coffee-lover",
      name: "The Coffee Lover",
      description: "Premium coffee experience for the caffeine connoisseur",
      price: 96,
      originalPrice: 115,
      image: "/placeholder.svg?height=400&width=400",
      icon: Coffee,
      items: ["Artisan coffee beans", "Ceramic mug", "Coffee grinder", "Biscotti", "Brewing guide"],
      colors: ["bg-amber-100", "text-amber-800"],
      popular: false,
    },
    {
      id: "new-parent",
      name: "The New Parent",
      description: "Thoughtful essentials for new parents and baby",
      price: 156,
      originalPrice: 180,
      image: "/placeholder.svg?height=400&width=400",
      icon: Baby,
      items: ["Organic baby products", "Comfort tea", "Soft blanket", "Milestone cards", "Parent care items"],
      colors: ["bg-green-100", "text-green-800"],
      popular: false,
    },
    {
      id: "celebration",
      name: "The Celebration Box",
      description: "Perfect for anniversaries, promotions, and special milestones",
      price: 134,
      originalPrice: 160,
      image: "/placeholder.svg?height=400&width=400",
      icon: Sparkles,
      items: ["Champagne truffles", "Celebration candle", "Luxury soap", "Congratulations card", "Gold accents"],
      colors: ["bg-yellow-100", "text-yellow-800"],
      popular: true,
    },
    {
      id: "seasonal",
      name: "The Seasonal Collection",
      description: "Curated items that celebrate the current season",
      price: 78,
      originalPrice: 95,
      image: "/placeholder.svg?height=400&width=400",
      icon: Calendar,
      items: ["Seasonal candle", "Local honey", "Seasonal treats", "Themed decor", "Recipe cards"],
      colors: ["bg-orange-100", "text-orange-800"],
      popular: false,
    },
  ]

  return (
    <PageLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">Themed Gift Boxes</h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Perfectly curated collections for every occasion. Each themed box is thoughtfully designed with
              complementary items that tell a story and create a memorable gifting experience.
            </p>
          </motion.div>

          {/* Themed Boxes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {themedBoxes.map((box, index) => (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full">
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                      <img
                        src={box.image || "/placeholder.svg"}
                        alt={box.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {box.popular && (
                        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground border-0">
                          Popular
                        </Badge>
                      )}
                      <div className="absolute top-4 right-4 w-12 h-12 bg-background/90 rounded-full flex items-center justify-center">
                        <box.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <h3 className="font-serif font-bold text-xl text-foreground mb-2">{box.name}</h3>
                      <p className="text-foreground/70 text-sm mb-4 line-clamp-2">{box.description}</p>

                      <div className="mb-4">
                        <h4 className="font-medium text-foreground mb-2 text-sm">What's included:</h4>
                        <ul className="text-xs text-foreground/60 space-y-1">
                          {box.items.slice(0, 3).map((item, idx) => (
                            <li key={idx}>• {item}</li>
                          ))}
                          {box.items.length > 3 && <li>• And {box.items.length - 3} more items...</li>}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-primary">${box.price}</span>
                          <span className="text-sm text-foreground/50 line-through ml-2">${box.originalPrice}</span>
                        </div>
                        <Badge className={`${box.colors[0]} ${box.colors[1]} border-0 text-xs`}>
                          Save ${box.originalPrice - box.price}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <Link href={`/themed/${box.id}`}>
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                            View Details
                          </Button>
                        </Link>
                        <Button variant="outline" className="w-full rounded-full bg-transparent text-sm">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-foreground/5 rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Why Choose Themed Boxes?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">Expertly Curated</h3>
                <p className="text-foreground/70">
                  Each box is thoughtfully designed by our team to create the perfect experience
                </p>
              </div>
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">Better Value</h3>
                <p className="text-foreground/70">
                  Save money compared to buying items individually while getting premium packaging
                </p>
              </div>
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">Ready to Gift</h3>
                <p className="text-foreground/70">
                  Beautifully packaged and ready to send - no additional wrapping needed
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}
