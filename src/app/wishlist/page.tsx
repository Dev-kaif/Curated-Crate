"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react"; // Import useEffect
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/Layout/page-layout";
import { useStore, type Product } from "@/contexts/store-context";
import Link from "next/link";
import axios from "axios"; // Import axios
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { state, addToCart, removeFromWishlist, dispatch } = useStore(); // Destructure dispatch
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(true); // New loading state for initial fetch

  // Fetch wishlist on component mount if the user is authenticated
  useEffect(() => {
    const fetchWishlist = async () => {
      if (status !== "authenticated") {
        dispatch({ type: "SET_WISHLIST", payload: [] });
        setIsLoadingWishlist(false);
        return;
      }

      setIsLoadingWishlist(true);
      try {
        const response = await axios.get("/api/wishlist");
        if (response.data.success) {
          dispatch({
            type: "SET_WISHLIST",
            payload: response.data.data.items || [],
          });
        } else {
          console.error("Failed to fetch wishlist:", response.data.message);
          dispatch({ type: "SET_WISHLIST", payload: [] });
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        dispatch({ type: "SET_WISHLIST", payload: [] });
      } finally {
        setIsLoadingWishlist(false);
      }
    };
    fetchWishlist();
  }, [status, dispatch]); // Depend on session status and dispatch

  const moveToCart = async (product: Product) => {
    setLoadingItemId(product.productId as string);
    try {
      await addToCart(product.productId as string, 1);
    } catch (error: any) {
      console.error("Error moving to cart:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  // Show skeleton loader while session status is loading or while fetching wishlist for an authenticated user
  if (
    status === "loading" ||
    (status === "authenticated" && isLoadingWishlist)
  ) {
    return (
      <PageLayout>
        <div className="py-20 px-6">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-md mx-auto space-y-6"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-foreground">
                Loading Wishlist...
              </h1>
              <Skeleton className="h-6 w-48 mx-auto mt-4" />
              <div className="grid grid-cols-1 gap-4 mt-8">
                <Skeleton className="h-12 rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Show login prompt if the user is unauthenticated
  if (status === "unauthenticated") {
    return (
      <PageLayout>
        <div className="py-20 px-6">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-md mx-auto space-y-6"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-foreground">
                Please Sign In
              </h1>
              <p className="text-foreground/70 text-lg">
                Login to view your wishlist and save your favorite items for
                later.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="bg-primary mt-5 hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full"
              >
                Login / Sign Up
              </Button>
            </motion.div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Show empty wishlist message for authenticated users with no items
  if (state.wishlist.length === 0) {
    return (
      <PageLayout>
        <div className="py-20 px-6">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-md mx-auto space-y-6"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-foreground">
                Your Wishlist is Empty
              </h1>
              <p className="text-foreground/70 text-lg">
                Explore our collection to find something you love and save it
                for later.
              </p>
              <Link href="/shop">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full">
                  Explore Collection
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Render wishlist for authenticated users with items
  return (
    <PageLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
              My Wishlist
            </h1>
            <p className="text-xl text-foreground/70">
              Items you've saved for later
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {state.wishlist.map((product, index) => {
              // Check if the product is already in the cart
              const isInCart = state.cart.items.some(
                (item) => item.productId === product.productId
              );

              return (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Link href={`/shop/details/${product.productId}`}>
                      <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                        <img
                          src={product.imageUrl || "/placeholder.svg"} // FIX: Use product.imageUrl directly
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <CardContent className="p-6">
                      <Link href={`/shop/details/${product.productId}`}>
                        <h3 className="font-serif font-bold text-lg text-foreground mb-2 hover:text-primary transition-colors truncate">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-foreground/60 text-sm mb-3 line-clamp-2 h-10">
                        {product.description}
                      </p>
                      <p className="text-primary font-bold text-xl mb-4">
                        ${product.price.toFixed(2)}
                      </p>

                      <div className="space-y-2">
                        {isInCart ? (
                          <Button
                            onClick={() => (window.location.href = "/cart")} // Direct navigation to cart
                            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full"
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" /> In Cart
                          </Button>
                        ) : (
                          <Button
                            onClick={() => moveToCart(product)}
                            disabled={loadingItemId === product.productId}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                          >
                            {loadingItemId === product.productId ? (
                              "Moving..."
                            ) : (
                              <>
                                <ShoppingBag className="w-4 h-4 mr-2" /> Move to
                                Cart
                              </>
                            )}
                          </Button>
                        )}

                        <Button
                          onClick={() =>
                            removeFromWishlist(product.productId as string)
                          } // Call removeFromWishlist from useStore
                          disabled={loadingItemId === product.productId}
                          variant="outline"
                          className="w-full rounded-full bg-transparent"
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
