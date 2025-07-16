"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "The most thoughtful gift I've ever received. Every item was perfect!",
      name: "Sarah Johnson",
      rating: 5,
    },
    {
      quote: "Building a custom crate was so easy and fun. My sister loved it!",
      name: "Michael Chen",
      rating: 5,
    },
    {
      quote: "Quality products, beautiful packaging, and incredible service.",
      name: "Emma Davis",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-6 bg-foreground/5">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Loved by Givers and Getters
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full bg-background border-0 shadow-lg">
                <CardContent className="space-y-6 text-center">
                  <div className="flex justify-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg font-serif italic text-foreground leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <p className="font-medium text-foreground/80">
                    — {testimonial.name}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
