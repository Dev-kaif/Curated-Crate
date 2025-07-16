"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, ShoppingCart, Users, AlertTriangle, TrendingUp, Eye } from "lucide-react"

const metrics = [
  {
    title: "Total Revenue",
    value: "$24,580",
    change: "+12.5%",
    period: "Last 30 Days",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "New Orders",
    value: "156",
    change: "+8.2%",
    period: "Last 7 Days",
    icon: ShoppingCart,
    trend: "up",
  },
  {
    title: "Total Customers",
    value: "2,847",
    change: "+5.1%",
    period: "All Time",
    icon: Users,
    trend: "up",
  },
  {
    title: "Low Stock Items",
    value: "12",
    change: "+3",
    period: "Requires Attention",
    icon: AlertTriangle,
    trend: "warning",
  },
]

const recentOrders = [
  { id: "#ORD-001", customer: "Sarah Johnson", status: "Processing", total: "$89.99" },
  { id: "#ORD-002", customer: "Mike Chen", status: "Shipped", total: "$124.50" },
  { id: "#ORD-003", customer: "Emma Davis", status: "Delivered", total: "$67.25" },
  { id: "#ORD-004", customer: "James Wilson", status: "Processing", total: "$156.75" },
  { id: "#ORD-005", customer: "Lisa Brown", status: "Shipped", total: "$98.00" },
  { id: "#ORD-006", customer: "David Miller", status: "Processing", total: "$203.45" },
  { id: "#ORD-007", customer: "Anna Garcia", status: "Delivered", total: "$78.90" },
  { id: "#ORD-008", customer: "Tom Anderson", status: "Cancelled", total: "$145.20" },
  { id: "#ORD-009", customer: "Maria Rodriguez", status: "Processing", total: "$112.35" },
  { id: "#ORD-010", customer: "Chris Taylor", status: "Shipped", total: "$89.60" },
]

const salesData = [
  { day: "Mon", sales: 2400 },
  { day: "Tue", sales: 1800 },
  { day: "Wed", sales: 3200 },
  { day: "Thu", sales: 2800 },
  { day: "Fri", sales: 3600 },
  { day: "Sat", sales: 4200 },
  { day: "Sun", sales: 3800 },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Processing":
      return "bg-yellow-100 text-yellow-800"
    case "Shipped":
      return "bg-blue-100 text-blue-800"
    case "Delivered":
      return "bg-green-100 text-green-800"
    case "Cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                <metric.icon
                  className={`h-4 w-4 ${metric.trend === "warning" ? "text-yellow-600" : "text-gray-400"}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <TrendingUp
                    className={`h-3 w-3 mr-1 ${
                      metric.trend === "up"
                        ? "text-green-500"
                        : metric.trend === "warning"
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  />
                  <span
                    className={
                      metric.trend === "up"
                        ? "text-green-600"
                        : metric.trend === "warning"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }
                  >
                    {metric.change}
                  </span>
                  <span className="ml-1">{metric.period}</span>
                </div>
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
                {salesData.map((day) => (
                  <div key={day.day} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">{day.day}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.sales / 4200) * 100}%` }}
                      />
                    </div>
                    <div className="w-16 text-sm font-medium text-right">${day.sales.toLocaleString()}</div>
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
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{order.id}</div>
                      <div className="text-xs text-gray-500">{order.customer}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                      <div className="font-medium text-sm">{order.total}</div>
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
  )
}
