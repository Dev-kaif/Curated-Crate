"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Product } from "@/contexts/store-context"; // Assuming your Product type is here
import axios from "axios"; // Import axios

export const FeaturedItemsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added error state

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        // Use axios to make the GET request
        const response = await axios.get("/api/products", {
          params: {
            sort: "popularity", // Using 'popularity' or 'newest' as desired
            limit: 10,
          },
        });

        // Backend /api/products returns an object with products array
        if (response.data && Array.isArray(response.data.products)) {
          const formattedProducts = response.data.products.map((p: any) => ({
            ...p,
            id: p._id, // Map MongoDB's _id to id
            imageUrl: p.images?.[0] || "/placeholder.svg", // FIX: Correctly map imageUrl from the images array
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
  }, []); // Empty dependency array means this runs once on mount

  // Duplicate the products array to create a seamless loop for the marquee
  // Only duplicate if products are loaded to avoid issues with empty array
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
                // FIX: Wrap the entire Card with Link for full clickability
                <div key={index} className="flex-shrink-0 w-64 mx-3">
                  <Link href={`/shop/details/${product.id}`} passHref>
                    {" "}
                    {/* Use passHref */}
                    <Card className="overflow-hidden bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                      {" "}
                      {/* Added cursor-pointer */}
                      <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <img
                          src={product.imageUrl || "/placeholder.svg"} // Use product.imageUrl
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
