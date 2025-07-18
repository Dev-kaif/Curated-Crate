"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemedBox } from "@/contexts/store-context";

export const ThemedBoxesSection = () => {
  const [themes, setThemes] = useState<ThemedBox[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThemedBoxes = async () => {
      try {
        // Fetch the themed boxes from the backend API
        const res = await fetch("/api/themed-boxes");
        if (!res.ok) {
          throw new Error("Failed to fetch themed boxes");
        }
        const data = await res.json();
        // Format the data to match the frontend type structure
        const formattedThemes = data.map((box: any) => ({
          ...box,
          id: box._id, // Map MongoDB's _id to id
        }));
        setThemes(formattedThemes);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemedBoxes();
  }, []);

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
            Need Inspiration? Start with a Theme
          </h2>
          <Link href="/themed-boxes">
            <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full">
              View All Themed Boxes
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-foreground/5 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {themes.slice(0, 4).map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/themed-boxes/${theme.id}`}>
                  <Card className="overflow-hidden bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 transform">
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
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
