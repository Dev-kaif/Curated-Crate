"use client"

import type React from "react"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, X, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

const availableProducts = [
  {
    id: 1,
    name: "Artisan Coffee Blend",
    price: "$24.99",
    category: "Beverages",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Handcrafted Soap Set",
    price: "$18.50",
    category: "Bath & Body",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Organic Tea Collection",
    price: "$32.00",
    category: "Beverages",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Scented Candle",
    price: "$15.99",
    category: "Home & Decor",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Gourmet Chocolate Box",
    price: "$28.75",
    category: "Food & Treats",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Essential Oil Set",
    price: "$45.00",
    category: "Wellness",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "Herbal Face Mask",
    price: "$22.00",
    category: "Bath & Body",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    name: "Bamboo Utensil Set",
    price: "$19.99",
    category: "Home & Decor",
    image: "/placeholder.svg?height=40&width=40",
  },
]

export default function NewThemedBox() {
  const [boxData, setBoxData] = useState({
    name: "",
    description: "",
    price: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<typeof availableProducts>([])

  const handleInputChange = (field: string, value: string) => {
    setBoxData((prev) => ({ ...prev, [field]: value }))
  }

  const addProduct = (product: (typeof availableProducts)[0]) => {
    if (!selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts((prev) => [...prev, product])
    }
  }

  const removeProduct = (productId: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  const filteredProducts = availableProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalValue = selectedProducts.reduce((sum, product) => {
    return sum + Number.parseFloat(product.price.replace("$", ""))
  }, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Themed box data:", boxData)
    console.log("Selected products:", selectedProducts)
  }

  return (
    <AdminLayout title="Create New Themed Box">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/themed-boxes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Themed Boxes
              </Button>
            </Link>
            <div>
              <h2 className="text-lg font-semibold">Create New Themed Box</h2>
              <p className="text-sm text-gray-600">Curate a collection of products for a themed experience</p>
            </div>
          </div>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Save Themed Box
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Box Information */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Box Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Box Name</Label>
                    <Input
                      id="name"
                      value={boxData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g., Birthday Celebration Crate"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={boxData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe the theme and purpose of this box"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Box Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={boxData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  {/* Selected Products Summary */}
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Box Contents</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Items: {selectedProducts.length}</div>
                      <div>Total Value: ${totalValue.toFixed(2)}</div>
                      {boxData.price && (
                        <div className="font-medium">
                          Savings: ${Math.max(0, totalValue - Number.parseFloat(boxData.price)).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Picker */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                {/* Available Products */}
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle>Available Products</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    <div className="space-y-2">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium text-sm">{product.name}</div>
                              <div className="text-xs text-gray-500">{product.category}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{product.price}</span>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => addProduct(product)}
                              disabled={selectedProducts.some((p) => p.id === product.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Products */}
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle>Selected Products ({selectedProducts.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    {selectedProducts.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p>No products selected yet</p>
                        <p className="text-sm">Add products from the left panel</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-3 border rounded-lg bg-blue-50"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <div className="font-medium text-sm">{product.name}</div>
                                <Badge variant="secondary" className="text-xs">
                                  {product.category}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{product.price}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProduct(product.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
