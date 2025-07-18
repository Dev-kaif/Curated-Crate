"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Our Story Section
export const OurStorySection = () => {
  return (
    <section className="py-20 px-6 bg-foreground/5">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl overflow-hidden">
              <img
                src="/ourStory.png"
                alt="Gift box being packed"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-foreground">
              From Our Hands to Theirs
            </h2>
            <p className="text-xl text-foreground/80 leading-relaxed">
              When you build a crate, you're not just giving a gift—you're
              supporting a community of creators. Every item in our collection
              is carefully selected from independent artisans who pour their
              heart into their craft.
            </p>
            <p className="text-lg text-foreground/70 leading-relaxed">
              We believe that the best gifts tell a story, create connections,
              and spread joy. That's why we've made it our mission to make
              gifting personal, meaningful, and effortless.
            </p>
            <Link href="/about">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full">
                Learn More About Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
