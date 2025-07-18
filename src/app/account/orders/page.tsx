"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Package, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AccountLayout } from "@/components/account-layout";
import { IOrder } from "@/types";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session) {
        setIsLoading(false); // Stop loading if no session
        return;
      }
      setIsLoading(true);
      try {
        // FIX: Access data.data from the API response
        const response = await axios.get<{ success: boolean; data: IOrder[] }>(
          "/api/orders"
        );
        if (response.data.success) {
          setOrders(response.data.data); // Correctly set the array of orders
        } else {
          console.error("Failed to fetch orders:", response.data.data);
          setOrders([]); // Ensure orders is an empty array on failure
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]); // Ensure orders is an empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session]); // Re-run effect when session changes

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

  return (
    <AccountLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Order History
          </h1>
          <p className="text-foreground/70">
            Track and manage your past orders
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-background border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-foreground/5">
                    <tr>
                      <th className="text-left p-4 font-medium text-foreground">
                        Order ID
                      </th>
                      <th className="text-left p-4 font-medium text-foreground">
                        Date
                      </th>
                      <th className="text-left p-4 font-medium text-foreground">
                        Items
                      </th>
                      <th className="text-left p-4 font-medium text-foreground">
                        Total
                      </th>
                      <th className="text-left p-4 font-medium text-foreground">
                        Status
                      </th>
                      <th className="text-left p-4 font-medium text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      // Skeleton loader rows
                      [...Array(3)].map((_, i) => (
                        <tr key={i} className="border-b border-foreground/10">
                          <td className="p-4">
                            <Skeleton className="h-5 w-24" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-5 w-24" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-5 w-16" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-5 w-20" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-6 w-24 rounded-full" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-8 w-24 rounded-full" />
                          </td>
                        </tr>
                      ))
                    ) : orders.length > 0 ? (
                      // Display actual orders if available
                      orders.map((order, index) => (
                        <motion.tr
                          key={order._id as string}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="border-b border-foreground/10 hover:bg-foreground/5 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-primary" />
                              </div>
                              <span className="font-medium text-foreground">
                                #
                                {order._id
                                  ? (order._id as string)
                                      .slice(-6)
                                      .toUpperCase()
                                  : "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-foreground/70">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="p-4 text-foreground/70">
                            {order.items?.length || 0} items
                          </td>
                          <td className="p-4 font-medium text-foreground">
                            $
                            {order.totalPrice
                              ? order.totalPrice.toFixed(2)
                              : "0.00"}
                          </td>
                          <td className="p-4">
                            <Badge
                              className={`${getStatusColor(order.orderStatus)} border-0 capitalize`}
                            >
                              {order.orderStatus}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Link href={`/account/orders/details/${order._id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full bg-transparent"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </Link>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      // Message when no orders are found
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center p-8 text-foreground/60"
                        >
                          You have no order history.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AccountLayout>
  );
}
