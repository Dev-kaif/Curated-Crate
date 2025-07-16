"use client"

import { motion } from "framer-motion"
import { Heart, Users, Leaf, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PageLayout } from "@/components/Layout/page-layout"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Thoughtful Curation",
      description: "Every item is carefully selected for quality, craftsmanship, and the story it tells.",
    },
    {
      icon: Users,
      title: "Supporting Artisans",
      description: "We partner with independent creators and small businesses to bring you unique, handcrafted goods.",
    },
    {
      icon: Leaf,
      title: "Sustainable Practices",
      description: "We prioritize eco-friendly packaging and work with makers who share our environmental values.",
    },
    {
      icon: Award,
      title: "Quality Promise",
      description: "We stand behind every product and ensure each gift box meets our high standards.",
    },
  ]

  return (
    <PageLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">Our Story</h1>
            <p className="text-xl text-foreground/80 leading-relaxed max-w-3xl mx-auto">
              Curated Crate was born from a simple belief: the best gifts tell a story, create connections, and spread
              joy. We're here to make gifting personal, meaningful, and effortless.
            </p>
          </motion.div>

          {/* Story Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg max-w-none mb-16"
          >
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <p>
                It all started in 2020 when our founder, Emma, was struggling to find the perfect gift for her
                grandmother's 90th birthday. She wanted something personal, something that would show how much she
                cared, but everything felt generic or impersonal.
              </p>
              <p>
                That's when Emma discovered the world of independent artisans and small makers. She spent weeks curating
                a collection of handmade soaps, artisanal teas, and a beautiful hand-thrown ceramic mug. When her
                grandmother opened the box, her eyes lit up with joy. It wasn't just the items themselves—it was the
                thought, care, and story behind each piece.
              </p>
              <p>
                Emma realized that many people faced the same challenge: wanting to give meaningful gifts but not
                knowing where to find them or how to put them together. That's how Curated Crate was born—to bridge the
                gap between thoughtful gift-givers and talented artisans.
              </p>
              <p>
                Today, we work with over 200 independent makers across the country, from candle makers in Vermont to
                chocolatiers in California. Every item in our collection is chosen not just for its quality, but for the
                passion and craftsmanship behind it.
              </p>
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">What We Believe In</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-foreground mb-3">{value.title}</h3>
                      <p className="text-foreground/70 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <Card className="bg-primary/5 border-0 shadow-lg">
              <CardContent className="p-12">
                <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Our Mission</h2>
                <p className="text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto">
                  To make every gift-giving moment special by connecting thoughtful people with beautiful, handcrafted
                  goods from independent artisans around the world.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}
