"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Package, Truck, CreditCard, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AccountLayout } from "@/components/account-layout";
import { IOrder } from "@/types"; 
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id: orderId } = params; // Get the order ID from the URL

  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return; // Ensure orderId is available
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<{ success: boolean; data: IOrder }>(`/api/orders/${orderId}`);
        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          throw new Error(response.data.success || "Failed to fetch order details.");
        }
      } catch (err: any) {
        console.error("Error fetching order details:", err);
        setError(err.response?.data?.message || err.message || "An unexpected error occurred while fetching order details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]); // Re-fetch when orderId changes

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <AccountLayout>
        <div className="space-y-8">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </AccountLayout>
    );
  }

  if (error || !order) {
    return (
      <AccountLayout>
        <div className="text-center py-20">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
            {error || "Order Not Found"}
          </h2>
          <p className="text-foreground/70 mb-8">
            {error ? "There was an issue loading the order details." : "The order you are looking for does not exist or you do not have permission to view it."}
          </p>
          <Link href="/account/orders">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Order History
            </Button>
          </Link>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Link href="/account/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              Order Details
            </h1>
          </div>
          <p className="text-foreground/70 text-lg">
            Order ID: <span className="font-medium text-primary">#{order._id ? (order._id as string).slice(-8).toUpperCase() : 'N/A'}</span>
          </p>
          <p className="text-foreground/70 text-lg">
            Placed On: <span className="font-medium">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
          </p>
          <p className="text-foreground/70 text-lg">
            Total Amount: <span className="font-bold text-primary">${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</span>
          </p>
          <p className="text-foreground/70 text-lg">
            Status:{" "}
            <Badge className={`${getStatusColor(order.orderStatus)} border-0 capitalize`}>
              {order.orderStatus}
            </Badge>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-background border-0 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-primary" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-foreground/70">
                <p className="font-medium text-foreground">{order.shippingAddress.street}</p>
                {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-background border-0 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-primary" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-foreground/70">
                <p className="font-medium text-foreground">Method: {order.paymentMethod.replace(/_/g, ' ')}</p>
                {order.isPaid ? (
                  <p className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" /> Paid on {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'N/A'}
                  </p>
                ) : (
                  <p className="text-red-600">Payment Status: {order.paymentStatus}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-background border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-primary" />
                Items in Order ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.length === 0 ? (
                <p className="text-center text-foreground/70 py-4">No items found for this order.</p>
              ) : (
                order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-foreground/5 rounded-lg">
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-foreground/70">Quantity: {item.quantity}</p>
                      <p className="text-sm font-bold text-primary">${item.price.toFixed(2)} each</p>
                    </div>
                    <span className="font-bold text-lg text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AccountLayout>
  );
}
