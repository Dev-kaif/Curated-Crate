"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const FinalCTASection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.h2
            className="text-4xl lg:text-6xl font-serif font-bold text-foreground"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            Ready to create a memorable gift?
          </motion.h2>
          <Link href="/shop">
            <Button
              size="lg"
              className="bg-primary mt-10 hover:bg-primary/90 text-primary-foreground px-12 py-4 text-xl font-medium rounded-full animate-breathe"
            >
              Build Your Custom Crate
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
