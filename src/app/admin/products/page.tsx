"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Artisan Coffee Blend",
    category: "Beverages",
    price: "$24.99",
    stock: 45,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Handcrafted Soap Set",
    category: "Bath & Body",
    price: "$18.50",
    stock: 23,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Organic Tea Collection",
    category: "Beverages",
    price: "$32.00",
    stock: 8,
    status: "Low Stock",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 4,
    name: "Scented Candle",
    category: "Home & Decor",
    price: "$15.99",
    stock: 67,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 5,
    name: "Gourmet Chocolate Box",
    category: "Food & Treats",
    price: "$28.75",
    stock: 0,
    status: "Out of Stock",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 6,
    name: "Essential Oil Set",
    category: "Wellness",
    price: "$45.00",
    stock: 34,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 border-green-200"
    case "Low Stock":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Out of Stock":
      return "bg-red-100 text-red-800 border-red-200"
    case "Inactive":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <AdminLayout title="Product Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Products</h2>
            <p className="text-sm text-gray-600">Manage your product inventory</p>
          </div>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Beverages">Beverages</SelectItem>
              <SelectItem value="Bath & Body">Bath & Body</SelectItem>
              <SelectItem value="Home & Decor">Home & Decor</SelectItem>
              <SelectItem value="Food & Treats">Food & Treats</SelectItem>
              <SelectItem value="Wellness">Wellness</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="font-medium">{product.price}</TableCell>
                  <TableCell>
                    <span className={product.stock <= 10 ? "text-red-600 font-medium" : ""}>{product.stock} units</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(product.status)} border`}>{product.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
