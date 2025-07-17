"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  TrendingUp,
  Eye,
} from "lucide-react";

// Define the structure for the fetched stats
interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockCount: number;
  recentOrders: {
    id: string;
    customer: string;
    status: string;
    total: number;
  }[];
  salesData: {
    day: string;
    sales: number;
  }[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch stats");
        }
        setStats(data.stats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const metrics = stats
    ? [
        {
          title: "Total Revenue",
          value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          icon: DollarSign,
        },
        {
          title: "Total Orders",
          value: stats.totalOrders.toLocaleString(),
          icon: ShoppingCart,
        },
        {
          title: "Total Customers",
          value: stats.totalCustomers.toLocaleString(),
          icon: Users,
        },
        {
          title: "Low Stock Items",
          value: stats.lowStockCount.toLocaleString(),
          icon: AlertTriangle,
          trend: "warning",
        },
      ]
    : [];

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="text-center text-red-500">
          <p>Error loading dashboard data: {error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <metric.icon
                  className={`h-4 w-4 ${metric.trend === "warning" ? "text-yellow-600" : "text-gray-400"}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Over Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.salesData.map((day) => (
                  <div key={day.day} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">{day.day}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(day.sales / (Math.max(...stats.salesData.map((d) => d.sales)) || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="w-20 text-sm font-medium text-right">
                      ${day.sales.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {order.id.substring(0, 8)}...
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customer}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={`text-xs ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </Badge>
                      <div className="font-medium text-sm">
                        ${order.total.toFixed(2)}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
