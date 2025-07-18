"use client";

import { motion } from "framer-motion";
import { Heart, Users, Leaf, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/Layout/page-layout";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Thoughtful Curation",
      description:
        "Every item is carefully selected for quality, craftsmanship, and the story it tells.",
    },
    {
      icon: Users,
      title: "Supporting Artisans",
      description:
        "We partner with independent creators and small businesses to bring you unique, handcrafted goods.",
    },
    {
      icon: Leaf,
      title: "Sustainable Practices",
      description:
        "We prioritize eco-friendly packaging and work with makers who share our environmental values.",
    },
    {
      icon: Award,
      title: "Quality Promise",
      description:
        "We stand behind every product and ensure each gift box meets our high standards.",
    },
  ];

  return (
    <PageLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section with Background Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-center mb-16 h-96 rounded-lg overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1670540805858-e67f494d6022?q=80&w=1734&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              }}
            >
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white">
                  <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
                    Our Story
                  </h1>
                  <p className="text-xl leading-relaxed max-w-3xl mx-auto">
                    Curated Crate was born from a simple belief: the best gifts
                    tell a story, create connections, and spread joy.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Story Content with Interspersed Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg max-w-none mb-16"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-foreground/80 leading-relaxed">
                <p>
                  It all started in 2020 when our founder, Emma, was struggling
                  to find the perfect gift for her grandmother's 90th birthday.
                </p>
                <p>
                  That's when Emma discovered the world of independent artisans
                  and small makers. She spent weeks curating a collection of
                  handmade soaps, artisanal teas, and a beautiful hand-thrown
                  ceramic mug.
                </p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1607687441627-27b17d7e44e4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Artisanal products"
                className="rounded-lg shadow-lg"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
              <img
                src="https://plus.unsplash.com/premium_photo-1677702162684-4586ad6f47a8?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Handcrafted goods"
                className="rounded-lg shadow-lg h-72 w-full object-cover"
              />
              <div className="space-y-6 text-foreground/80 leading-relaxed">
                <p>
                  Emma realized that many people faced the same challenge:
                  wanting to give meaningful gifts but not knowing where to find
                  them. That's how Curated Crate was born.
                </p>
                <p>
                  Today, we work with over 200 independent makers across the
                  country, from candle makers in Vermont to chocolatiers in
                  California.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Values Section with Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">
              What We Believe In
            </h2>
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
                      <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                        {value.title}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed">
                        {value.description}
                      </p>
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
                <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <p className="text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto">
                  To make every gift-giving moment special by connecting
                  thoughtful people with beautiful, handcrafted goods from
                  independent artisans around the world.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
