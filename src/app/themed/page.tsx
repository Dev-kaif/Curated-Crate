// src/app/themed/page.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Gift, Heart, Coffee, Baby, Sparkles, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/Layout/page-layout";
import Link from "next/link";
import {
  useStore,
  type ThemedBox,
  type Product,
} from "@/contexts/store-context";
import { useRouter } from "next/navigation"; // Import useRouter

// A helper to map a name to a Lucide icon component
const iconMap: { [key: string]: React.ElementType } = {
  Birthday: Gift,
  Relaxation: Heart,
  Coffee: Coffee,
  "New Parent": Baby,
  Celebration: Sparkles,
  Seasonal: Calendar,
  Default: Gift,
};

// The card component for a single themed box
const ThemedBoxCard = ({ box }: { box: ThemedBox }) => {
  // No longer directly using addToCart from useStore here
  const router = useRouter(); // Initialize useRouter
  const [isBuying, setIsBuying] = useState(false); // Changed from isAdding to isBuying

  // Find a matching icon, or use a default one
  const IconComponent = Object.keys(iconMap).find((key) =>
    box.name.includes(key)
  )
    ? iconMap[Object.keys(iconMap).find((key) => box.name.includes(key))!]
    : iconMap.Default;

  const handleBuyNow = async () => {
    // Renamed function
    setIsBuying(true); // Set loading state
    try {
      // Navigate directly to checkout, passing the themedBoxId
      router.push(`/checkout?themedBoxId=${box.id}`);
    } catch (error) {
      console.error("Error initiating themed box purchase:", error);
      // You could add an error toast notification here
    } finally {
      setIsBuying(false); // Reset loading state
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
        <div className="relative">
          <Link href={`/themed/details/${box.id}`}>
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
              <img
                src={box.image || "/placeholder.svg"}
                alt={box.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 w-12 h-12 bg-background/90 rounded-full flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Link>
        </div>

        <CardContent className="p-6 flex flex-col flex-grow">
          <div className="flex-grow">
            <Link href={`/themed/details/${box.id}`}>
              <h3 className="font-serif font-bold text-xl text-foreground mb-2 hover:text-primary">
                {box.name}
              </h3>
            </Link>
            <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
              {box.description}
            </p>

            <div className="mb-4">
              <h4 className="font-medium text-foreground mb-2 text-sm">
                What's included:
              </h4>
              <ul className="text-xs text-foreground/60 space-y-1">
                {box.products.slice(0, 3).map((item: Product) => (
                  <li key={item.id}>• {item.name}</li>
                ))}
                {box.products.length > 3 && (
                  <li>• And {box.products.length - 3} more items...</li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-2xl font-bold text-primary">
                  ${box.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Link href={`/themed/details/${box.id}`}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                  View Details
                </Button>
              </Link>
              {/* Changed to Buy Now button */}
              <Button
                variant="outline"
                className="w-full rounded-full bg-transparent text-sm"
                onClick={handleBuyNow} // Call new function
                disabled={isBuying} // Use new loading state
              >
                {isBuying ? "Proceeding..." : "Buy Now"}{" "}
                {/* Change button text */}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function ThemedBoxesPage() {
  const [themedBoxes, setThemedBoxes] = useState<ThemedBox[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemedBoxes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/themed-boxes");
        if (!res.ok) {
          throw new Error("Failed to fetch themed boxes");
        }
        const data = await res.json();
        const formattedData = data.map((box: any) => ({
          ...box,
          id: box._id,
          products: box.products.map((p: any) => ({ ...p, id: p._id })),
        }));
        setThemedBoxes(formattedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchThemedBoxes();
  }, []);

  return (
    <PageLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
              Themed Gift Boxes
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Perfectly curated collections for every occasion. Each themed box
              is thoughtfully designed with complementary items that tell a
              story and create a memorable gifting experience.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] bg-foreground/5 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-destructive">{error}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {themedBoxes.map((box) => (
                <ThemedBoxCard key={box.id} box={box} />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-foreground/5 rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
              Why Choose Themed Boxes?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                  Expertly Curated
                </h3>
                <p className="text-foreground/70">
                  Each box is thoughtfully designed by our team to create the
                  perfect experience
                </p>
              </div>
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                  Better Value
                </h3>
                <p className="text-foreground/70">
                  Save money compared to buying items individually while getting
                  premium packaging
                </p>
              </div>
              <div>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg text-foreground mb-2">
                  Ready to Gift
                </h3>
                <p className="text-foreground/70">
                  Beautifully packaged and ready to send - no additional
                  wrapping needed
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
