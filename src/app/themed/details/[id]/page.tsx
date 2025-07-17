"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Gift,
  Star,
  Heart,
  ShoppingBag,
  Check,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/Layout/page-layout";
import {
  useStore,
  type ThemedBox,
  type Product,
} from "@/contexts/store-context";
import Link from "next/link";

// This is a new interface for the Review structure if your themed boxes have them
interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
}

// A new type that includes any extra fields your mock data had
type ThemedBoxWithDetails = ThemedBox & {
  images: string[];
  reviews: Review[];
  features: string[];
  originalPrice?: number; // Make originalPrice optional
};

export default function ThemedBoxDetailPage() {
  const params = useParams();
  const { dispatch, state } = useStore();
  const [selectedImage, setSelectedImage] = useState(0);

  // State for fetching data
  const [themedBox, setThemedBox] = useState<ThemedBoxWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemedBox = async () => {
      if (!params.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/themed-boxes/${params.id}`);
        if (!res.ok) {
          throw new Error("Themed Box not found");
        }
        const data = await res.json();
        // Format the data to match the frontend's expected structure
        const formattedData = {
          ...data,
          id: data._id,
          images: [data.image, ...Array(3).fill(data.image)], // Use main image and create placeholders
          reviews: data.reviews || [], // Use backend reviews or default to empty array
          features: data.features || [], // Use backend features or default to empty array
        };
        setThemedBox(formattedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemedBox();
  }, [params.id]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-12 px-6">
          {/* Skeleton Loader */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-foreground/5 rounded-2xl animate-pulse" />
              <div className="grid grid-cols-4 gap-4">
                <div className="aspect-square bg-foreground/5 rounded-lg animate-pulse" />
                <div className="aspect-square bg-foreground/5 rounded-lg animate-pulse" />
                <div className="aspect-square bg-foreground/5 rounded-lg animate-pulse" />
                <div className="aspect-square bg-foreground/5 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-6 w-1/4 bg-foreground/5 rounded-full animate-pulse" />
              <div className="h-12 w-3/4 bg-foreground/5 rounded-full animate-pulse" />
              <div className="h-20 w-full bg-foreground/5 rounded-lg animate-pulse" />
              <div className="h-10 w-1/3 bg-foreground/5 rounded-full animate-pulse" />
              <div className="h-12 w-full bg-foreground/5 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !themedBox) {
    return (
      <PageLayout>
        <div className="container mx-auto py-20 px-6 text-center">
          <h2 className="text-2xl font-serif text-destructive mb-4">Error</h2>
          <p className="text-foreground/70">
            {error || "The requested gift box could not be found."}
          </p>
          <Link href="/themed-boxes">
            <Button className="mt-8">Back to Themed Boxes</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const isInWishlist = state.wishlist.some((item) => item.id === themedBox.id);

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", item: themedBox, itemType: "themedBox" });
  };

  const handleWishlistToggle = () => {
    const productForWishlist: Product = {
      id: themedBox.id,
      name: themedBox.name,
      price: themedBox.price,
      images: themedBox.images,
      description: themedBox.description,
      // Assign a valid placeholder category.
      category: "Home Goods",
      stock: 1, // Assume stock is always available for wishlisting
    };

    if (isInWishlist) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", productId: themedBox.id });
    } else {
      dispatch({ type: "ADD_TO_WISHLIST", product: productForWishlist });
    }
  };

  const totalValue = themedBox.products.reduce(
    (sum, item) => sum + item.price,
    0
  );
  const savings = themedBox.originalPrice
    ? themedBox.originalPrice - themedBox.price
    : totalValue - themedBox.price;

  return (
    <PageLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              href="/themed-boxes"
              className="flex items-center text-foreground/60 hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Themed Boxes
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl overflow-hidden relative">
                <img
                  src={themedBox.images[selectedImage] || "/placeholder.svg"}
                  alt={themedBox.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {themedBox.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${themedBox.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Gift className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium">
                    Themed Gift Box
                  </span>
                </div>
                <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
                  {themedBox.name}
                </h1>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  {themedBox.description}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary">
                  ${themedBox.price.toFixed(2)}
                </span>
                {themedBox.originalPrice && (
                  <span className="text-xl text-foreground/50 line-through">
                    ${themedBox.originalPrice.toFixed(2)}
                  </span>
                )}
                {savings > 0 && (
                  <Badge className="bg-green-100 text-green-800 border-0">
                    Save ${savings.toFixed(2)}
                  </Badge>
                )}
              </div>

              {themedBox.features && themedBox.features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-lg text-foreground">
                    What makes this special:
                  </h3>
                  <ul className="space-y-2">
                    {themedBox.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-foreground/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-medium rounded-full"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart - ${themedBox.price.toFixed(2)}
                </Button>

                <Button
                  onClick={handleWishlistToggle}
                  variant="outline"
                  size="lg"
                  className="w-full py-4 text-lg font-medium rounded-full bg-transparent"
                >
                  <Heart
                    className={`w-5 h-5 mr-2 ${isInWishlist ? "fill-primary text-primary" : ""}`}
                  />
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <Tabs defaultValue="contents" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="contents" className="rounded-full">
                  Box Contents
                </TabsTrigger>
                <TabsTrigger value="details" className="rounded-full">
                  Details & Care
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-full">
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contents">
                <Card className="bg-background border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-6">
                      What's Inside
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {themedBox.products.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-start space-x-4 p-4 bg-foreground/5 rounded-lg"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-grow">
                            <h4 className="font-medium text-foreground mb-1">
                              {item.name}
                            </h4>
                            <p className="text-sm text-foreground/70">
                              {item.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {savings > 0 && (
                      <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                        <p className="text-foreground/80 text-center">
                          <strong>Total Value:</strong> ${totalValue.toFixed(2)}{" "}
                          • <strong>You Save:</strong> ${savings.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card className="bg-background border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                          Packaging & Presentation
                        </h3>
                        <p className="text-foreground/70 leading-relaxed">
                          Each Themed Crate comes in our signature eco-friendly
                          gift box with premium tissue paper, ribbon, and a
                          personalized message card. The presentation is
                          gift-ready and requires no additional wrapping.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="bg-background border-0 shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-serif font-bold text-foreground mb-6">
                      Customer Reviews
                    </h3>
                    <div className="space-y-6">
                      {themedBox.reviews.length > 0 ? (
                        themedBox.reviews.map((review, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="border-b border-foreground/10 pb-6 last:border-b-0"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium text-foreground">
                                {review.name}
                              </span>
                              <div className="flex items-center">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 fill-primary text-primary"
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-foreground/70 leading-relaxed">
                              {review.comment}
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-center text-foreground/70">
                          No reviews for this box yet.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
