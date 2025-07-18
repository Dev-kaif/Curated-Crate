"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  Minus,
  Plus,
  Star,
  ChevronLeft,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/Layout/page-layout";
import { useStore, type Product } from "@/contexts/store-context"; // Import Product for type
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axios from "axios";

// Interface for the Review structure
interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Review submission form component
const ReviewForm = ({
  productId, // Now accepts productId
  onReviewSubmitted,
}: {
  productId: string; // Product ID is now required
  onReviewSubmitted: (newReview: Review) => void;
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`/api/products/${productId}/reviews`, {
        rating,
        comment,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to submit review.");
      }
      onReviewSubmitted(data.data);
      // Clear form on success
      setRating(0);
      setComment("");
    } catch (err: any) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err.message;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div>
        <Label>Rating</Label>
        <div className="flex items-center space-x-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer transition-colors ${
                rating >= star
                  ? "text-primary fill-primary"
                  : "text-foreground/30"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={isLoading || rating === 0}>
        {isLoading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state, addToCart, addToWishlist, removeFromWishlist } = useStore();
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // State for Add to Cart button loading
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  // State for Add to Wishlist button loading
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`/api/products/${params.id}`),
          axios.get(`/api/products/${params.id}/reviews`),
        ]);

        if (productRes.data.success) {
          setProduct(productRes.data.data);
        } else {
          throw new Error("Product not found");
        }

        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.data);
        }
      } catch (err: any) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err.message;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleNewReview = (newReview: Review) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
    setIsReviewModalOpen(false);
  };

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    if (!product || !product._id) return;
    setIsAddingToCart(true); // Set loading state for Add to Cart
    try {
      await addToCart(product._id, quantity);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setIsAddingToCart(false); // Reset loading state
    }
  };

  const handleWishlistToggle = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    if (!product || !product._id) return;

    // Check if product is already in cart, if so, prevent adding to wishlist
    const productIsInCart = state.cart.items.some(
      (item) => item.productId === product.productId
    );

    if (productIsInCart) {
      // Optionally, show a toast notification here
      console.log("Product is already in cart, cannot add to wishlist.");
      return;
    }

    setIsAddingToWishlist(true); // Set loading state for Wishlist
    try {
      const isInWishlist = state.wishlist.some(
        (item) => item._id === product._id
      );

      if (isInWishlist) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    } finally {
      setIsAddingToWishlist(false); // Reset loading state
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-12 px-6">
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
              <div className="h-12 w-full bg-foreground/5 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !product) {
    return (
      <PageLayout>
        <div className="container mx-auto py-20 px-6 text-center">
          <h2 className="text-2xl font-serif text-destructive mb-4">Error</h2>
          <p className="text-foreground/70">
            {error || "The requested product could not be found."}
          </p>
          <Link href="/shop">
            <Button className="mt-8">Back to Shop</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const images = product.images || [];
  const isInWishlist = session
    ? state.wishlist.some((item) => item.id === product.productId)
    : false;
  const isInCart = session
    ? state.cart.items.some((item) => item.productId === product._id)
    : false;

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
              href="/shop"
              className="flex items-center text-foreground/60 hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Shop
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl overflow-hidden">
                <img
                  src={images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? "border-primary" : "border-transparent hover:border-primary/50"}`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
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
                <p className="text-primary font-medium mb-2">
                  {product.category}
                </p>
                <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>
              <div className="text-3xl font-bold text-primary">
                ${(product.price || 0).toFixed(2)}
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium text-foreground">Quantity:</span>
                <div className="flex items-center border border-foreground/20 rounded-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-full"
                    disabled={isAddingToCart} // Disable if adding to cart
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-full"
                    disabled={isAddingToCart} // Disable if adding to cart
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {!session ? (
                  <Button
                    onClick={() => router.push("/login")}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-medium rounded-full"
                  >
                    Sign in to Add to Box
                  </Button>
                ) : isInCart ? (
                  <Button
                    onClick={() => router.push("/cart")}
                    size="lg"
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-4 text-lg font-medium rounded-full"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Go to Cart
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-medium rounded-full"
                    disabled={isAddingToCart} // Disable if adding to cart
                  >
                    {isAddingToCart
                      ? "Adding..."
                      : `Add to Box - $${(product.price * quantity).toFixed(
                          2
                        )}`}
                  </Button>
                )}

                {session && (
                  <Button
                    onClick={handleWishlistToggle}
                    variant="outline"
                    size="lg"
                    className="w-full py-4 text-lg font-medium rounded-full bg-transparent"
                    disabled={isInCart || isAddingToWishlist} // Disable if in cart or adding to wishlist
                  >
                    <Heart
                      className={`w-5 h-5 mr-2 ${
                        isInWishlist ? "fill-primary text-primary" : ""
                      }`}
                    />
                    {isAddingToWishlist
                      ? "Updating Wishlist..."
                      : isInCart
                        ? "Already in Cart"
                        : isInWishlist
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="description" className="rounded-full">
                  Full Description
                </TabsTrigger>
                <TabsTrigger value="specifications" className="rounded-full">
                  Specifications
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-full">
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <Card className="p-8 bg-background border-0 shadow-lg">
                  <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
                    <p>{product.description}</p>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="specifications">
                <Card className="p-8 bg-background border-0 shadow-lg">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Specifications details go here */}
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="reviews">
                <Card className="p-8 bg-background border-0 shadow-lg">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-serif font-bold text-foreground">
                      Customer Reviews
                    </h2>
                    {session && (
                      <Button
                        onClick={() => setIsReviewModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
                      >
                        Write a Review
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-6">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div
                          key={review._id}
                          className="border-b border-foreground/10 pb-4 last:border-b-0"
                        >
                          {/* Review item JSX */}
                        </div>
                      ))
                    ) : (
                      <p className="text-foreground/70 text-center py-8">
                        No reviews yet. Be the first to write one!
                      </p>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isReviewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setIsReviewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-background rounded-2xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-0">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-6">
                    Write a Review
                  </h3>
                  {product && (
                    <ReviewForm
                      productId={product.productId as string}
                      onReviewSubmitted={handleNewReview}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
