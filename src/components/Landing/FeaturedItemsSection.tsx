"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "@/contexts/store-context"; // Assuming your Product type is here

export const FeaturedItemsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Fetch the 10 newest products from the updated backend API
        const res = await fetch("/api/products?sort=newest&limit=10");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        // The backend returns an object with an `id` field (_id), so we map it
        const formattedProducts = data.map((p: any) => ({
          ...p,
          id: p._id,
          image: p.images[0],
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Duplicate the products array to create a seamless loop for the marquee
  const marqueeProducts = [...products, ...products];

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
          {/* Apply a fade-out gradient on the sides */}
          <div className="absolute top-0 left-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute top-0 right-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent" />

          {isLoading ? (
            // Skeleton loader while fetching data
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
              // Animate the marquee effect
              animate={{
                x: ["0%", "-100%"],
                transition: {
                  ease: "linear",
                  duration: 40, // Adjust duration to control speed
                  repeat: Infinity,
                },
              }}
            >
              {marqueeProducts.map((product, index) => (
                <div key={index} className="flex-shrink-0 w-64 mx-3">
                  <Link href={`/shop/details/${product.id}`}>
                    <Card className="overflow-hidden bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-6 text-center">
                        <h3 className="font-serif font-bold text-lg text-foreground mb-2 truncate">
                          {product.name}
                        </h3>
                        <p className="text-primary font-bold text-xl">
                          ${product.price.toFixed(2)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
