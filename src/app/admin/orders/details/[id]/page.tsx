"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Package,
  Truck,
  CreditCard,
  CheckCircle,
  XCircle,
  ArrowLeft,
  User,
  Calendar,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin-layout"; // Use AdminLayout
import { IOrder, IOrderItem, OrderStatus, PaymentStatus, IUser } from "@/types"; // Import IUser
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id: orderId } = params;

  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<{ success: boolean; data: IOrder }>(
          `/api/orders/${orderId}`
        );
        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          throw new Error(
            response.data.success || "Failed to fetch order details."
          );
        }
      } catch (err: any) {
        console.error("Error fetching admin order details:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "An unexpected error occurred while fetching order details."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

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
      case "refunded":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order || !order._id) return;

    setIsUpdatingStatus(true);
    setError(null);
    try {
      const response = await axios.put<{ success: boolean; data: IOrder }>(
        `/api/orders/${order._id}`,
        { orderStatus: newStatus }
      );

      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        throw new Error(
          response.data.success || "Failed to update order status."
        );
      }
    } catch (err: any) {
      console.error("Error updating order status:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update order status."
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Type guard to check if userId is populated
  const isUserPopulated = (userId: IOrder["userId"]): userId is IUser => {
    return typeof userId === "object" && userId !== null && "email" in userId;
  };

  if (isLoading) {
    return (
      <AdminLayout title="Order Details">
        <div className="space-y-8">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout title="Order Details">
        <div className="text-center py-20">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
            {error || "Order Not Found"}
          </h2>
          <p className="text-foreground/70 mb-8">
            {error
              ? "There was an issue loading the order details."
              : "The order you are looking for does not exist."}
          </p>
          <Link href="/admin/orders">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  // If loading is false and order is not null/error, render the details
  return (
    <AdminLayout title="Order Details">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Orders
              </Button>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-foreground">
              Order Details
            </h1>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Order Summary Card */}
            <Card className="bg-background border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-foreground/70">
                <p>
                  <strong>Order ID:</strong> #
                  {order._id
                    ? (order._id as string).slice(-8).toUpperCase()
                    : "N/A"}
                </p>
                <p>
                  <strong>Total Price:</strong> $
                  {order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}
                </p>
                <p>
                  <strong>Shipping:</strong> $
                  {order.shippingPrice
                    ? order.shippingPrice.toFixed(2)
                    : "0.00"}
                </p>
                <p>
                  <strong>Tax:</strong> $
                  {order.taxPrice ? order.taxPrice.toFixed(2) : "0.00"}
                </p>
                <p>
                  <strong>Placed On:</strong>{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
                <div className="flex items-center">
                  <strong>Status:</strong>{" "}
                  <Badge
                    className={`ml-2 ${getStatusColor(order.orderStatus)} border-0 capitalize`}
                  >
                    {order.orderStatus}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <strong>Payment:</strong>{" "}
                  <Badge
                    className={`ml-2 ${order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} border-0 capitalize`}
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="bg-background border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-foreground/70">
                {isUserPopulated(order.userId) ? (
                  <>
                    <p className="font-medium text-foreground">
                      Name:{" "}
                      {order.userId.name ||
                        `${order.userId.firstName || ""} ${order.userId.lastName || ""}`.trim() ||
                        "N/A"}
                    </p>
                    <p>Email: {order.userId.email || "N/A"}</p>
                    <p>Phone: {order.userId.phone || "N/A"}</p>
                  </>
                ) : (
                  <p>Customer details not available or not populated.</p>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="bg-background border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-primary" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-foreground/70">
                <p className="font-medium text-foreground">
                  {order.shippingAddress.street}
                </p>
                {order.shippingAddress.apartment && (
                  <p>{order.shippingAddress.apartment}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </CardContent>
            </Card>
          </div>

          {/* Order Status & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-background border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Update Order Status</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Select
                  value={order.orderStatus}
                  onValueChange={handleStatusChange}
                  disabled={isUpdatingStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => handleStatusChange(order.orderStatus)}
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Updating..." : "Save Status"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
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
                  <p className="text-center text-foreground/70 py-4">
                    No items found for this order.
                  </p>
                ) : (
                  order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-foreground/5 rounded-lg"
                    >
                      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-sm text-foreground/70">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-primary">
                          ${item.price.toFixed(2)} each
                        </p>
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
        </motion.div>
      </div>
    </AdminLayout>
  );
}
