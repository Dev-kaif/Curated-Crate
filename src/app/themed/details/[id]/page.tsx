// src/app/themed/details/[id]/page.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
import { useParams, useRouter } from "next/navigation";
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
  themedBoxId,
  onReviewSubmitted,
}: {
  themedBoxId: string;
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
      const { data } = await axios.post(
        `/api/themed-boxes/${themedBoxId}/reviews`,
        {
          rating,
          comment,
        }
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to submit review.");
      }
      onReviewSubmitted(data.data);
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
          placeholder="Share your thoughts about this themed box..."
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={isLoading || rating === 0}>
        {isLoading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

// A new type that includes any extra fields your mock data had
type ThemedBoxWithDetails = ThemedBox & {
  images: string[];
  reviews: Review[];
  features: string[];
  originalPrice?: number;
};

export default function ThemedBoxDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedImage, setSelectedImage] = useState(0); // This is the state declaration
  const [themedBox, setThemedBox] = useState<ThemedBoxWithDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const [themedBoxRes, reviewsRes] = await Promise.all([
          axios.get(`/api/themed-boxes/${params.id}`),
          axios.get(`/api/themed-boxes/${params.id}/reviews`),
        ]);

        if (themedBoxRes.data) {
          const formattedBoxData = {
            ...themedBoxRes.data,
            id: themedBoxRes.data._id,
            images: themedBoxRes.data.image
              ? [
                  themedBoxRes.data.image,
                  ...(themedBoxRes.data.images || []).filter(
                    (img: string) => img !== themedBoxRes.data.image
                  ),
                ]
              : [],
            features: themedBoxRes.data.features || [],
          };
          setThemedBox(formattedBoxData);
        } else {
          throw new Error("Themed Box not found");
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

  const handleBuyNow = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    if (!themedBox) return;
    setIsBuying(true);
    try {
      router.push(`/checkout?themedBoxId=${themedBox.id}`);
    } catch (error) {
      console.error("Error initiating themed box purchase:", error);
    } finally {
      setIsBuying(false);
    }
  };

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
              href="/themed"
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
                  onClick={handleBuyNow}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-medium rounded-full"
                  disabled={isBuying && !!session}
                >
                  {!session
                    ? "Sign in to Buy"
                    : isBuying
                      ? "Proceeding..."
                      : `Buy Now - $${themedBox.price.toFixed(2)}`}
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
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-foreground">
                              {review.userName}
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

      {/* Review Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isReviewModalOpen ? 1 : 0 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
        onClick={() => setIsReviewModalOpen(false)}
        style={{ pointerEvents: isReviewModalOpen ? "auto" : "none" }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{
            scale: isReviewModalOpen ? 1 : 0.9,
            y: isReviewModalOpen ? 0 : 20,
          }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-background rounded-2xl shadow-xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-bold text-foreground mb-6">
                Write a Review
              </h3>
              {themedBox && (
                <ReviewForm
                  themedBoxId={themedBox.id}
                  onReviewSubmitted={handleNewReview}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageLayout>
  );
}
