"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "@/contexts/store-context";
import axios from "axios";
import { InfiniteMovingProducts } from "@/components/ui/Marque";

export const FeaturedItemsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use axios to make the GET request
        const response = await axios.get("/api/products", {
          params: {
            sort: "popularity",
            limit: 10,
          },
        });

        if (response.data && Array.isArray(response.data.products)) {
          const formattedProducts = response.data.products.map((p: any) => ({
            ...p,
            id: p._id,
            imageUrl: p.images?.[0] || "/placeholder.svg",
          }));
          setProducts(formattedProducts);
        } else {
          throw new Error("Received invalid data structure from server.");
        }
      } catch (err: any) {
        console.error("Error fetching featured products:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load featured products."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const marqueeProducts = products.length > 0 ? [...products, ...products] : [];

  if (error) {
    return (
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-serif text-destructive mb-4">
            Error Loading Products
          </h2>
          <p className="text-foreground/70">{error}</p>
        </div>
      </section>
    );
  }

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
            Explore Our Collection
          </h2>
          <Link href="/shop">
            <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full">
              View All Products
            </Button>
          </Link>
        </motion.div>

        <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute top-0 right-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />

          {isLoading ? (
            <div className="flex space-x-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-64 h-80 bg-foreground/5 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="flex"
              animate={{
                x: ["0%", "-100%"],
                transition: {
                  ease: "linear",
                  duration: 40,
                  repeat: Infinity,
                },
              }}
            >
              <section className="my-12">
                <InfiniteMovingProducts
                  products={marqueeProducts}
                  direction="left"
                  speed="slow"
                  pauseOnHover={true}
                />
              </section>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
