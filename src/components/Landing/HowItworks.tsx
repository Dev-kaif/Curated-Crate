"use client";

import { motion } from "framer-motion";
import { Box, Sparkles, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// How It Works Section
export const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: Box,
      title: "Choose Your Crate",
      description: "Start with one of our elegant, eco-friendly boxes.",
    },
    {
      number: "02",
      icon: Sparkles,
      title: "Fill It With Joy",
      description: "Select from our collection of curated artisanal goods.",
    },
    {
      number: "03",
      icon: Gift,
      title: "Send It With Love",
      description: "Add a personal note, and we'll pack and ship it.",
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
            Create Your Crate in Three Simple Steps
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Card className="p-8 h-full bg-background border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="space-y-6">
                  <div className="text-6xl font-serif font-bold text-primary/20">
                    {step.number}
                  </div>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {step.description}
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
