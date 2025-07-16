"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Mail, Phone } from "lucide-react"

const customers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    signUpDate: "2024-01-15",
    totalOrders: 8,
    totalSpent: "$456.78",
    status: "Active",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@example.com",
    phone: "+1 (555) 234-5678",
    signUpDate: "2024-01-10",
    totalOrders: 12,
    totalSpent: "$789.45",
    status: "Active",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@example.com",
    phone: "+1 (555) 345-6789",
    signUpDate: "2024-01-08",
    totalOrders: 5,
    totalSpent: "$234.56",
    status: "Active",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james@example.com",
    phone: "+1 (555) 456-7890",
    signUpDate: "2024-01-05",
    totalOrders: 15,
    totalSpent: "$1,234.90",
    status: "VIP",
  },
  {
    id: 5,
    name: "Lisa Brown",
    email: "lisa@example.com",
    phone: "+1 (555) 567-8901",
    signUpDate: "2024-01-03",
    totalOrders: 3,
    totalSpent: "$156.78",
    status: "Active",
  },
  {
    id: 6,
    name: "David Miller",
    email: "david@example.com",
    phone: "+1 (555) 678-9012",
    signUpDate: "2023-12-28",
    totalOrders: 0,
    totalSpent: "$0.00",
    status: "Inactive",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 border-green-200"
    case "VIP":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "Inactive":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AdminLayout title="Customer Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Customers</h2>
            <p className="text-sm text-gray-600">Manage your customer base and view their activity</p>
          </div>
          <div className="text-sm text-gray-500">Total Customers: {customers.length}</div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Sign-Up Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">ID: {customer.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1 text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(customer.signUpDate).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{customer.totalOrders}</TableCell>
                  <TableCell className="font-medium">{customer.totalSpent}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(customer.status)} border`}>{customer.status}</Badge>
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

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No customers found matching your search.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
