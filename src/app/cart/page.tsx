"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageLayout } from "@/components/Layout/page-layout";
import { useStore } from "@/contexts/store-context";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { state, updateQuantity, removeFromCart } = useStore();
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    const storedDiscount = sessionStorage.getItem("appliedDiscount");
    if (storedDiscount) {
      try {
        const parsedDiscount = JSON.parse(storedDiscount);
        handleApplyCoupon(parsedDiscount.code);
      } catch (e) {
        console.error("Failed to parse stored discount:", e);
        sessionStorage.removeItem("appliedDiscount");
      }
    }
  }, [state.cart.items]);

  const subtotal = state.cart.items.reduce(
    (sum, cartItem) => sum + (cartItem.price || 0) * cartItem.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;

  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = subtotalAfterDiscount * 0.08;

  const total = subtotalAfterDiscount + shipping + tax;

  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    setLoadingItemId(cartItemId);
    await updateQuantity(cartItemId, newQuantity);
    setLoadingItemId(null);
    if (appliedDiscount) {
      handleApplyCoupon(appliedDiscount.code);
    }
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    setLoadingItemId(cartItemId);
    await removeFromCart(cartItemId);
    setLoadingItemId(null);
    if (appliedDiscount) {
      handleApplyCoupon(appliedDiscount.code);
    }
  };

  const handleApplyCoupon = async (codeToApply: string = couponCode) => {
    if (!codeToApply) {
      setCouponError("Please enter a coupon code.");
      setAppliedDiscount(null);
      sessionStorage.removeItem("appliedDiscount");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);
    setAppliedDiscount(null);

    try {
      const response = await axios.post("/api/discounts/validate", {
        code: codeToApply,
        cartSubtotal: subtotal,
      });

      if (response.data.success) {
        const newAppliedDiscount = {
          code: response.data.data.code,
          amount: response.data.data.discountAmount,
        };
        setAppliedDiscount(newAppliedDiscount);
        setCouponCode(newAppliedDiscount.code);
        sessionStorage.setItem(
          "appliedDiscount",
          JSON.stringify(newAppliedDiscount)
        );
      } else {
        setCouponError(response.data.message || "Invalid coupon code.");
        sessionStorage.removeItem("appliedDiscount");
      }
    } catch (err: any) {
      console.error("Error applying coupon:", err);
      setCouponError(
        err.response?.data?.message || err.message || "Failed to apply coupon."
      );
      sessionStorage.removeItem("appliedDiscount");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    setCouponCode("");
    setCouponError(null);
    sessionStorage.removeItem("appliedDiscount");
  };

  if (state.cart.items.length === 0) {
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
                <ShoppingBag className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-foreground">
                Your Crate is Empty
              </h1>
              <p className="text-foreground/70 text-lg">
                Start building your perfect gift box.
              </p>
              <Link href="/shop">
                <Button className="bg-primary mt-5 hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full">
                  Start Shopping
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </PageLayout>
    );
  }

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
              Your Custom Crate
            </h1>
            <p className="text-xl text-foreground/70">
              Review your selected items and proceed to checkout
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {state.cart.items.map((cartItem, index) => (
                <motion.div
                  key={cartItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-background border-0 shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={cartItem.imageUrl || "/placeholder.svg"}
                          alt={cartItem.name || "Cart item"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-serif font-bold text-lg text-foreground mb-1">
                          {cartItem.name || "Unnamed Product"}
                        </h3>
                        <p className="text-primary font-bold text-lg">
                          ${(cartItem.price || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-foreground/20 rounded-full">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(
                                cartItem.id,
                                cartItem.quantity - 1
                              )
                            }
                            disabled={loadingItemId === cartItem.id}
                            className="p-2 rounded-full"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="px-3 py-1 font-medium">
                            {cartItem.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(
                                cartItem.id,
                                cartItem.quantity + 1
                              )
                            }
                            disabled={loadingItemId === cartItem.id}
                            className="p-2 rounded-full"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromCart(cartItem.id)}
                          disabled={loadingItemId === cartItem.id}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="p-6 bg-background border-0 shadow-lg sticky top-24">
                <h2 className="font-serif font-bold text-xl text-foreground mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/70">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  {/* Coupon Input and Apply Button */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponError(null); 
                        }}
                        className="flex-grow rounded-full border-foreground/20 focus:border-primary"
                        disabled={isApplyingCoupon || !!appliedDiscount}
                      />
                      {!appliedDiscount ? (
                        <Button
                          onClick={() => handleApplyCoupon()}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4"
                        >
                          {isApplyingCoupon ? (
                            "Applying..."
                          ) : (
                            <Tag className="w-4 h-4" />
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleRemoveCoupon}
                          variant="outline"
                          className="rounded-full px-4"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    {couponError && (
                      <Alert
                        variant="destructive"
                        className="py-2 px-3 text-sm"
                      >
                        <AlertTitle className="text-sm">Error</AlertTitle>
                        <AlertDescription className="text-xs">
                          {couponError}
                        </AlertDescription>
                      </Alert>
                    )}
                    {appliedDiscount && (
                      <Alert
                        variant="default"
                        className="py-2 px-3 text-sm border-green-500 text-green-700"
                      >
                        <AlertTitle className="text-sm">
                          Discount Applied!
                        </AlertTitle>
                        <AlertDescription className="text-xs">
                          '{appliedDiscount.code}' saved you $
                          {appliedDiscount.amount.toFixed(2)}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  {/* Discount Row */}
                  {appliedDiscount && (
                    <div className="flex justify-between items-center text-green-600 font-medium">
                      <span>Discount ({appliedDiscount.code})</span>
                      <span>-${appliedDiscount.amount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-foreground/70">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal > 0 && subtotal < 50 && (
                    <p className="text-sm text-foreground/60">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  {/* Tax Row */}
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/70">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-foreground/20 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-lg text-primary">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  {session ? (
                    <Link href="/checkout">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-medium rounded-full">
                        Proceed to Checkout
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={() => router.push("/login")}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-medium rounded-full"
                    >
                      Login / Sign Up to Continue
                    </Button>
                  )}
                  <Link href="/shop">
                    <Button
                      variant="outline"
                      className="w-full py-3 rounded-full bg-transparent"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
