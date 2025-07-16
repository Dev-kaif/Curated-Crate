"use client"

import { motion } from "framer-motion"
import { ArrowRight} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"


export const HeroSection = () => {
  return (
    <section className="pt-12 pb-20 px-6">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight"
            >
              The Perfect Gift,{" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-primary"
              >
                Perfectly Personal
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-foreground/80 leading-relaxed max-w-lg"
            >
              Build a unique gift box in minutes. Choose from our curated
              collection of artisanal goods, add a personal note, and we'll
              deliver it beautifully packaged.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium rounded-full"
                >
                  Start Building Your Box
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 aspect-square flex items-center justify-center">
              <div className="w-64 h-48 bg-background rounded-lg shadow-2xl border-2 border-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <div className="text-sm font-medium text-foreground/60">
                    Your Custom Crate
                  </div>
                </div>
              </div>

              {/* Floating Products */}
              {[
                { icon: "🕯️", position: "top-4 right-8", delay: 0.8 },
                { icon: "🍫", position: "bottom-8 left-4", delay: 1.0 },
                { icon: "🧴", position: "top-12 left-8", delay: 1.2 },
                { icon: "📖", position: "bottom-4 right-12", delay: 1.4 },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: item.delay }}
                  className={`absolute ${item.position} text-3xl animate-bounce`}
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  {item.icon}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
