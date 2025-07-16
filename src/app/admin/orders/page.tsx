"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Filter } from "lucide-react"

const orders = [
  {
    id: "#ORD-001",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    date: "2024-01-15",
    status: "Processing",
    total: "$89.99",
    items: 3,
  },
  {
    id: "#ORD-002",
    customer: "Mike Chen",
    email: "mike@example.com",
    date: "2024-01-14",
    status: "Shipped",
    total: "$124.50",
    items: 2,
  },
  {
    id: "#ORD-003",
    customer: "Emma Davis",
    email: "emma@example.com",
    date: "2024-01-14",
    status: "Delivered",
    total: "$67.25",
    items: 1,
  },
  {
    id: "#ORD-004",
    customer: "James Wilson",
    email: "james@example.com",
    date: "2024-01-13",
    status: "Processing",
    total: "$156.75",
    items: 4,
  },
  {
    id: "#ORD-005",
    customer: "Lisa Brown",
    email: "lisa@example.com",
    date: "2024-01-13",
    status: "Shipped",
    total: "$98.00",
    items: 2,
  },
  {
    id: "#ORD-006",
    customer: "David Miller",
    email: "david@example.com",
    date: "2024-01-12",
    status: "Processing",
    total: "$203.45",
    items: 5,
  },
  {
    id: "#ORD-007",
    customer: "Anna Garcia",
    email: "anna@example.com",
    date: "2024-01-12",
    status: "Delivered",
    total: "$78.90",
    items: 1,
  },
  {
    id: "#ORD-008",
    customer: "Tom Anderson",
    email: "tom@example.com",
    date: "2024-01-11",
    status: "Cancelled",
    total: "$145.20",
    items: 3,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Processing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Shipped":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Delivered":
      return "bg-green-100 text-green-800 border-green-200"
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orderData, setOrderData] = useState(orders)

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrderData((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const filteredOrders = orderData.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout title="Order Management">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search orders, customers, or order IDs..."
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
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
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
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell className="font-medium">{order.total}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status.toLowerCase()}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>
                          <Badge className={`${getStatusColor(order.status)} border`}>{order.status}</Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found matching your criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
