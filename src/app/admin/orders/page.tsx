"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, Filter } from "lucide-react";
import { IOrder, OrderStatus } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link"; // Import Link
import axios from "axios";

export default function OrderManagement() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending": // Added pending status color
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "refunded": // Added refunded status color
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed": // Added completed status color
        return "bg-teal-100 text-teal-800 border-teal-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      params.append("page", pagination.currentPage.toString());

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch orders");
      }
      setOrders(data.data);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, statusFilter, pagination.currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    // Optimistic update (optional, but good for UX)
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );

    try {
      // Use axios for PUT request
      const res = await axios.put(`/api/orders/${orderId}`, {
        orderStatus: newStatus,
      });
      const data = res.data; // axios wraps response in .data
      if (!data.success) {
        throw new Error(data.message || "Failed to update status");
      }
      // Re-fetch to confirm change and get latest data, or update state with returned data if backend sends it
      fetchOrders();
    } catch (err: any) {
      setError(err.message);
      // Revert optimistic update on error by re-fetching
      fetchOrders();
    }
  };

  return (
    <AdminLayout title="Order Management">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by Order ID, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : orders.length > 0 ? (
                orders.map((order: any) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      #{order._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {order.userId?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.userId?.email || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell className="font-medium">
                      ${order.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.orderStatus}
                        onValueChange={(value) =>
                          handleStatusChange(order._id, value as OrderStatus)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>
                            <Badge
                              className={`${getStatusColor(order.orderStatus)} border`}
                            >
                              {order.orderStatus}
                            </Badge>
                          </SelectValue>
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
                    </TableCell>
                    <TableCell>
                      {/* FIX: Link to the new admin order details page */}
                      <Link href={`/admin/orders/details/${order._id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-500 py-12"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
