"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Themed Boxes Section
export const ThemedBoxesSection = () => {
  const themes = [
    {
      name: "The Birthday Crate",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "The Relaxation Ritual",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "The Coffee Lover",
      image: "/placeholder.svg?height=300&width=300",
    },
    { name: "The New Parent", image: "/placeholder.svg?height=300&width=300" },
  ];

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
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Need Inspiration? Start with a Theme
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {themes.map((theme, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <Card className="overflow-hidden bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                  <img
                    src={theme.image || "/placeholder.svg"}
                    alt={theme.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button className="bg-background text-foreground hover:bg-background/90">
                      View Box
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif font-bold text-xl text-foreground text-center">
                    {theme.name}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
