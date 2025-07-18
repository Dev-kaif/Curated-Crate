"use client";

import type React from "react";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  Check,
  Lock,
  CreditCard,
  Truck,
  FileText,
  Plus,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckoutLayout } from "@/components/checkout-layout";
import {
  useStore,
  type CartItem,
  type ThemedBox,
  type Product,
} from "@/contexts/store-context";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge"; // Import Badge for address display

// Define IAddress interface locally, matching backend model
interface IAddress {
  _id?: string; // Mongoose _id for saved addresses
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  label?: "Home" | "Work" | "Other";
  isDefault: boolean; // Changed to be a required boolean
}

// Props for OrderSummary component
interface OrderSummaryProps {
  items: Array<
    | CartItem
    | {
        id: string;
        name: string;
        imageUrl: string;
        price: number;
        quantity: number;
      }
  >;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { number: 1, name: "Shipping", icon: Truck },
    { number: 2, name: "Payment", icon: CreditCard },
    { number: 3, name: "Review", icon: FileText },
  ];

  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentStep >= step.number
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/10 text-foreground/50"
              }`}
            >
              {currentStep > step.number ? (
                <Check className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <span
              className={`ml-3 font-medium ${currentStep >= step.number ? "text-foreground" : "text-foreground/50"}`}
            >
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-6 transition-all ${
                currentStep > step.number ? "bg-primary" : "bg-foreground/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Updated OrderSummary component to accept items as props
const OrderSummary = ({
  items,
  subtotal,
  shipping,
  tax,
  total,
}: OrderSummaryProps) => {
  return (
    <Card className="p-6 bg-background border-0 shadow-lg sticky top-6">
      <h2 className="font-serif font-bold text-xl text-foreground mb-6">
        Order Summary
      </h2>

      <div className="space-y-4 mb-6">
        {items.length === 0 ? (
          <p className="text-center text-foreground/70">No items to display.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-xs text-foreground/60">
                  Qty: {item.quantity}
                </p>
              </div>
              <span className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3 border-t border-foreground/20 pt-4">
        <div className="flex justify-between">
          <span className="text-foreground/70">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/70">Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/70">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t border-foreground/20 pt-3">
          <span>Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themedBoxId = searchParams.get("themedBoxId");

  const { state: globalStoreState, clearCart } = useStore(); // UPDATED: Destructure clearCart

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    apartment: "", // Added apartment
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });
  const [checkoutItems, setCheckoutItems] = useState<
    Array<
      | CartItem
      | {
          id: string;
          name: string;
          productId?: string;
          imageUrl: string;
          price: number;
          quantity: number;
        }
    >
  >([]);
  const [orderSummaryCalculated, setOrderSummaryCalculated] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });
  const [userAddresses, setUserAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Function to calculate summary based on provided items
  const calculateSummary = useCallback(
    (
      items: Array<
        | CartItem
        | {
            id: string;
            name: string;
            imageUrl: string;
            price: number;
            quantity: number;
          }
      >
    ) => {
      const subtotal = items.reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity,
        0
      );
      const shipping = subtotal > 50 ? 0 : 9.99;
      const tax = subtotal * 0.08; // Example tax rate
      const total = subtotal + shipping + tax;
      return { subtotal, shipping, tax, total };
    },
    []
  );

  // Effect to fetch initial data (cart or themed box, and user addresses)
  useEffect(() => {
    const fetchCheckoutData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let itemsToProcess: Array<
          | CartItem
          | {
              id: string;
              name: string;
              imageUrl: string;
              price: number;
              quantity: number;
            }
        > = [];

        if (themedBoxId) {
          // Fetch themed box details
          const res = await axios.get(`/api/themed-boxes/${themedBoxId}`);
          if (!res.data) {
            throw new Error("Themed box not found.");
          }
          const themedBox: ThemedBox = { ...res.data, id: res.data._id };

          // For themed boxes, create a single item representing the box
          itemsToProcess = [
            {
              id: themedBox.id,
              name: themedBox.name,
              imageUrl: themedBox.image,
              price: themedBox.price,
              quantity: 1,
            },
          ];
        } else {
          // Use cart items from global state
          if (globalStoreState.cart.items.length === 0) {
            setError(
              "Your cart is empty. Please add items before checking out."
            );
            setIsLoading(false);
            return; // Exit early if cart is empty
          }
          itemsToProcess = globalStoreState.cart.items;
        }

        const summary = calculateSummary(itemsToProcess);

        setCheckoutItems(itemsToProcess);
        setOrderSummaryCalculated(summary);

        // Fetch user addresses
        const userRes = await axios.get("/api/users/me");
        if (userRes.data.success && userRes.data.data.addresses) {
          const addresses: IAddress[] = userRes.data.data.addresses;
          setUserAddresses(addresses);
          const defaultAddress = addresses.find((addr) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress._id as string);
            setShippingData({
              firstName: userRes.data.data.firstName || "",
              lastName: userRes.data.data.lastName || "",
              email: userRes.data.data.email || "",
              address: defaultAddress.street,
              apartment: defaultAddress.apartment || "", // Set apartment
              city: defaultAddress.city,
              state: defaultAddress.state,
              zipCode: defaultAddress.zipCode,
              country: defaultAddress.country,
            });
          } else if (addresses.length > 0) {
            // If no default, select the first one
            setSelectedAddressId(addresses[0]._id as string);
            setShippingData({
              firstName: userRes.data.data.firstName || "",
              lastName: userRes.data.data.lastName || "",
              email: userRes.data.data.email || "",
              address: addresses[0].street,
              apartment: addresses[0].apartment || "", // Set apartment
              city: addresses[0].city,
              state: addresses[0].state,
              zipCode: addresses[0].zipCode,
              country: addresses[0].country,
            });
          }
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load checkout data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckoutData();
  }, [themedBoxId, globalStoreState.cart.items, calculateSummary]);

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !shippingData.firstName ||
      !shippingData.lastName ||
      !shippingData.email ||
      !shippingData.address ||
      !shippingData.city ||
      !shippingData.state ||
      !shippingData.zipCode ||
      !shippingData.country
    ) {
      setError("Please fill in all required shipping fields.");
      return;
    }

    // If a new address form is shown, save it first
    if (showNewAddressForm) {
      try {
        const newAddress: IAddress = {
          street: shippingData.address,
          apartment: shippingData.apartment,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.zipCode,
          country: shippingData.country,
          label: "Home", // Default label for new address
          isDefault: userAddresses.length === 0, // Set as default if it's the first address
        };

        // Create a copy of existing addresses and unset their default flag
        const updatedAddresses = userAddresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }));

        // Check if the new address already exists (simple check by street and zip)
        const existingAddrIndex = updatedAddresses.findIndex(
          (addr) =>
            addr.street === newAddress.street &&
            addr.zipCode === newAddress.zipCode
        );

        if (existingAddrIndex !== -1) {
          // If address exists, update it to be default and select it
          updatedAddresses[existingAddrIndex].isDefault = true;
          setSelectedAddressId(
            updatedAddresses[existingAddrIndex]._id as string
          );
        } else {
          // If new address, add it and set it as default
          newAddress.isDefault = true;
          updatedAddresses.push(newAddress);
        }

        const userRes = await axios.put("/api/users/me", {
          addresses: updatedAddresses,
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          email: shippingData.email,
        });

        if (userRes.data.success) {
          setUserAddresses(userRes.data.data.addresses);
          // Find the address that is now default (either newly added or existing one set to default)
          const newlySelectedAddress = userRes.data.data.addresses.find(
            (addr: IAddress) => addr.isDefault
          );
          if (newlySelectedAddress) {
            setSelectedAddressId(newlySelectedAddress._id as string);
            setShippingData((prev) => ({
              ...prev,
              address: newlySelectedAddress.street,
              apartment: newlySelectedAddress.apartment || "",
              city: newlySelectedAddress.city,
              state: newlySelectedAddress.state,
              zipCode: newlySelectedAddress.zipCode,
              country: newlySelectedAddress.country,
            }));
          }
          setShowNewAddressForm(false);
          setCurrentStep(2);
        } else {
          throw new Error(
            userRes.data.message || "Failed to save new address."
          );
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to save address."
        );
      }
    } else if (selectedAddressId) {
      // If an existing address is selected, ensure it's set as default on the backend
      const selectedAddr = userAddresses.find(
        (addr) => addr._id === selectedAddressId
      );
      if (selectedAddr) {
        const updatedAddresses = userAddresses.map((addr) => ({
          ...addr,
          isDefault: addr._id === selectedAddressId, // Set only the selected one as default
        }));

        try {
          const userRes = await axios.put("/api/users/me", {
            addresses: updatedAddresses,
          });
          if (userRes.data.success) {
            setUserAddresses(userRes.data.data.addresses); // Update local state with fresh data
            setShippingData((prev) => ({
              ...prev,
              address: selectedAddr.street,
              apartment: selectedAddr.apartment || "",
              city: selectedAddr.city,
              state: selectedAddr.state,
              zipCode: selectedAddr.zipCode,
              country: selectedAddr.country,
            }));
            setCurrentStep(2);
          } else {
            throw new Error(
              userRes.data.message || "Failed to update default address."
            );
          }
        } catch (err: any) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to update address preference."
          );
        }
      } else {
        setError("Please select a valid address or add a new one.");
      }
    } else {
      setError("Please select or add a shipping address.");
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !paymentData.cardNumber ||
      !paymentData.expiryDate ||
      !paymentData.cvv ||
      !paymentData.nameOnCard
    ) {
      setError("Please fill in all payment details.");
      return;
    }
    setCurrentStep(3);
  };

  const handleFinalSubmit = async () => {
    setIsProcessingOrder(true);
    setError(null);

    try {
      let orderItemsPayload: any[] = [];
      if (themedBoxId) {
        orderItemsPayload = [{ type: "themedBox", themedBoxId: themedBoxId }];
      } else {
        orderItemsPayload = checkoutItems.map((item) => ({
          type: "product",
          productId: item.productId,
          quantity: item.quantity,
        }));
      }

      const orderPayload = {
        shippingAddress: {
          street: shippingData.address,
          apartment: shippingData.apartment,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.zipCode,
          country: shippingData.country,
        },
        paymentMethod: "card",
        cartItems: orderItemsPayload,
        totalPrice: orderSummaryCalculated.total,
        shippingPrice: orderSummaryCalculated.shipping,
        taxPrice: orderSummaryCalculated.tax,
      };

      const res = await axios.post("/api/orders", orderPayload);

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to place order.");
      }

      // Clear cart after successful order if it was a cart purchase
      if (!themedBoxId) {
        clearCart(); // UPDATED: Use clearCart function
      }

      router.push("/order/success");
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to place order."
      );
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <CheckoutLayout>
        <div className="py-12 px-6">
          <div className="container mx-auto max-w-6xl">
            <Skeleton className="h-10 w-full mb-12" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-80 w-full" />
              </div>
            </div>
          </div>
        </div>
      </CheckoutLayout>
    );
  }

  if (error && !isProcessingOrder) {
    return (
      <CheckoutLayout>
        <div className="py-20 px-6 text-center">
          <h2 className="text-2xl font-serif text-destructive mb-4">Error</h2>
          <p className="text-foreground/70">{error}</p>
          <Button onClick={() => setError(null)} className="mt-4">
            Try Again
          </Button>
        </div>
      </CheckoutLayout>
    );
  }

  return (
    <CheckoutLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ProgressBar currentStep={currentStep} />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-8 bg-background border-0 shadow-lg">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                      Shipping Information
                    </h2>
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <form onSubmit={handleShippingSubmit} className="space-y-6">
                      {userAddresses.length > 0 && !showNewAddressForm && (
                        <div className="space-y-4">
                          <Label className="text-foreground font-medium">
                            Select an existing address:
                          </Label>
                          <RadioGroup
                            value={selectedAddressId || ""}
                            onValueChange={(value) => {
                              setSelectedAddressId(value);
                              const selectedAddr = userAddresses.find(
                                (addr) => addr._id === value
                              );
                              if (selectedAddr) {
                                setShippingData((prev) => ({
                                  ...prev,
                                  address: selectedAddr.street,
                                  apartment: selectedAddr.apartment || "", // Ensure apartment is set
                                  city: selectedAddr.city,
                                  state: selectedAddr.state,
                                  zipCode: selectedAddr.zipCode,
                                  country: selectedAddr.country,
                                }));
                              }
                              setError(null);
                            }}
                            className="grid gap-4"
                          >
                            {userAddresses.map((addr) => (
                              <div
                                key={addr._id as string}
                                className="flex items-start space-x-3 p-4 border rounded-lg bg-foreground/5"
                              >
                                <RadioGroupItem
                                  value={addr._id as string}
                                  id={addr._id as string}
                                />
                                <Label
                                  htmlFor={addr._id as string}
                                  className="flex-grow cursor-pointer"
                                >
                                  <div className="font-medium text-foreground">
                                    {addr.label || "Unnamed Address"}{" "}
                                    {addr.isDefault && (
                                      <Badge className="ml-2 bg-primary/10 text-primary border-0 text-xs">
                                        Default
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-foreground/70">
                                    {addr.street}
                                  </p>
                                  {addr.apartment && (
                                    <p className="text-sm text-foreground/70">
                                      {addr.apartment}
                                    </p>
                                  )}
                                  <p className="text-sm text-foreground/70">
                                    {addr.city}, {addr.state} {addr.zipCode}
                                  </p>
                                  <p className="text-sm text-foreground/70">
                                    {addr.country}
                                  </p>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowNewAddressForm(true)}
                            className="w-full rounded-full mt-4"
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add New Address
                          </Button>
                        </div>
                      )}

                      {/* New Address Form (shown if no addresses or "Add New Address" is clicked) */}
                      {(userAddresses.length === 0 || showNewAddressForm) && (
                        <div className="space-y-6">
                          {userAddresses.length > 0 && showNewAddressForm && (
                            <h3 className="text-xl font-serif font-bold text-foreground mt-8">
                              Enter New Address Details
                            </h3>
                          )}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                id="firstName"
                                value={shippingData.firstName}
                                onChange={(e) =>
                                  setShippingData({
                                    ...shippingData,
                                    firstName: e.target.value,
                                  })
                                }
                                className="rounded-full border-foreground/20 focus:border-primary"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                value={shippingData.lastName}
                                onChange={(e) =>
                                  setShippingData({
                                    ...shippingData,
                                    lastName: e.target.value,
                                  })
                                }
                                className="rounded-full border-foreground/20 focus:border-primary"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={shippingData.email}
                              onChange={(e) =>
                                setShippingData({
                                  ...shippingData,
                                  email: e.target.value,
                                })
                              }
                              className="rounded-full border-foreground/20 focus:border-primary"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address">Street Address</Label>
                            <Input
                              id="address"
                              value={shippingData.address}
                              onChange={(e) =>
                                setShippingData({
                                  ...shippingData,
                                  address: e.target.value,
                                })
                              }
                              className="rounded-full border-foreground/20 focus:border-primary"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="apartment">
                              Apartment, suite, etc. (Optional)
                            </Label>
                            <Input
                              id="apartment"
                              value={shippingData.apartment || ""}
                              onChange={(e) =>
                                setShippingData({
                                  ...shippingData,
                                  apartment: e.target.value,
                                })
                              }
                              className="rounded-full border-foreground/20 focus:border-primary"
                            />
                          </div>

                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                value={shippingData.city}
                                onChange={(e) =>
                                  setShippingData({
                                    ...shippingData,
                                    city: e.target.value,
                                  })
                                }
                                className="rounded-full border-foreground/20 focus:border-primary"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="state">State</Label>
                              <Select
                                value={shippingData.state}
                                onValueChange={(value) =>
                                  setShippingData({
                                    ...shippingData,
                                    state: value,
                                  })
                                }
                                required
                              >
                                <SelectTrigger className="rounded-full border-foreground/20 focus:border-primary">
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="CA">California</SelectItem>
                                  <SelectItem value="NY">New York</SelectItem>
                                  <SelectItem value="TX">Texas</SelectItem>
                                  <SelectItem value="FL">Florida</SelectItem>
                                  <SelectItem value="IL">Illinois</SelectItem>
                                  {/* Add more states as needed */}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="zipCode">ZIP Code</Label>
                              <Input
                                id="zipCode"
                                value={shippingData.zipCode}
                                onChange={(e) =>
                                  setShippingData({
                                    ...shippingData,
                                    zipCode: e.target.value,
                                  })
                                }
                                className="rounded-full border-foreground/20 focus:border-primary"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              value={shippingData.country}
                              onChange={(e) =>
                                setShippingData({
                                  ...shippingData,
                                  country: e.target.value,
                                })
                              }
                              className="rounded-full border-foreground/20 focus:border-primary"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-full"
                        disabled={isProcessingOrder}
                      >
                        Continue to Payment
                      </Button>
                    </form>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-8 bg-background border-0 shadow-lg">
                    <div className="flex items-center mb-6">
                      <Lock className="w-5 h-5 text-primary mr-2" />
                      <h2 className="text-2xl font-serif font-bold text-foreground">
                        Secure Payment
                      </h2>
                    </div>
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentData.cardNumber}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              cardNumber: e.target.value,
                            })
                          }
                          className="rounded-full border-foreground/20 focus:border-primary"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={paymentData.expiryDate}
                            onChange={(e) =>
                              setPaymentData({
                                ...paymentData,
                                expiryDate: e.target.value,
                              })
                            }
                            className="rounded-full border-foreground/20 focus:border-primary"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentData.cvv}
                            onChange={(e) =>
                              setPaymentData({
                                ...paymentData,
                                cvv: e.target.value,
                              })
                            }
                            className="rounded-full border-foreground/20 focus:border-primary"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input
                          id="nameOnCard"
                          value={paymentData.nameOnCard}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              nameOnCard: e.target.value,
                            })
                          }
                          className="rounded-full border-foreground/20 focus:border-primary"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-foreground/70">
                        <Lock className="w-4 h-4" />
                        <span>
                          Your payment information is encrypted and secure
                        </span>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1 py-3 rounded-full bg-transparent"
                          disabled={isProcessingOrder}
                        >
                          Back to Shipping
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-full"
                          disabled={isProcessingOrder}
                        >
                          Review Order
                        </Button>
                      </div>
                    </form>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-8 bg-background border-0 shadow-lg">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                      Review Your Order
                    </h2>
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-foreground mb-2">
                          Shipping Address
                        </h3>
                        <p className="text-foreground/70">
                          {shippingData.firstName} {shippingData.lastName}
                          <br />
                          {shippingData.address}
                          <br />
                          {shippingData.apartment && (
                            <>
                              {shippingData.apartment}
                              <br />
                            </>
                          )}
                          {shippingData.city}, {shippingData.state}{" "}
                          {shippingData.zipCode}
                          <br />
                          {shippingData.country}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-bold text-foreground mb-2">
                          Payment Method
                        </h3>
                        <p className="text-foreground/70">
                          **** **** **** {paymentData.cardNumber.slice(-4)}
                          <br />
                          {paymentData.nameOnCard}
                        </p>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                          className="flex-1 py-3 rounded-full bg-transparent"
                          disabled={isProcessingOrder}
                        >
                          Back to Payment
                        </Button>
                        <Button
                          onClick={handleFinalSubmit}
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-full"
                          disabled={isProcessingOrder}
                        >
                          {isProcessingOrder
                            ? "Placing Order..."
                            : "Place Order"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <OrderSummary
                  items={checkoutItems}
                  subtotal={orderSummaryCalculated.subtotal}
                  shipping={orderSummaryCalculated.shipping}
                  tax={orderSummaryCalculated.tax}
                  total={orderSummaryCalculated.total}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
}
