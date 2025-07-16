"use client"

import type React from "react"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Copy, Calendar } from "lucide-react"

const discounts = [
  {
    id: 1,
    code: "SUMMER10",
    type: "Percentage",
    value: "10%",
    description: "Summer sale discount",
    uses: 45,
    maxUses: 100,
    expiryDate: "2024-08-31",
    status: "Active",
  },
  {
    id: 2,
    code: "WELCOME20",
    type: "Percentage",
    value: "20%",
    description: "New customer welcome discount",
    uses: 23,
    maxUses: 50,
    expiryDate: "2024-12-31",
    status: "Active",
  },
  {
    id: 3,
    code: "FREESHIP",
    type: "Free Shipping",
    value: "Free",
    description: "Free shipping on orders over $50",
    uses: 78,
    maxUses: 200,
    expiryDate: "2024-09-30",
    status: "Active",
  },
  {
    id: 4,
    code: "HOLIDAY25",
    type: "Percentage",
    value: "25%",
    description: "Holiday special discount",
    uses: 156,
    maxUses: 150,
    expiryDate: "2024-01-15",
    status: "Expired",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 border-green-200"
    case "Expired":
      return "bg-red-100 text-red-800 border-red-200"
    case "Paused":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function MarketingManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    type: "percentage",
    value: "",
    description: "",
    maxUses: "",
    expiryDate: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setNewDiscount((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating discount:", newDiscount)
    setIsCreateModalOpen(false)
    setNewDiscount({
      code: "",
      type: "percentage",
      value: "",
      description: "",
      maxUses: "",
      expiryDate: "",
    })
  }

  const copyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <AdminLayout title="Marketing & Promotions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Discount Codes</h2>
            <p className="text-sm text-gray-600">Create and manage promotional discount codes</p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Discount Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Discount Code</DialogTitle>
                <DialogDescription>Set up a new promotional discount code for your customers.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDiscount} className="space-y-4">
                <div>
                  <Label htmlFor="code">Code Name</Label>
                  <Input
                    id="code"
                    value={newDiscount.code}
                    onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                    placeholder="e.g., SUMMER10"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Discount Type</Label>
                  <Select value={newDiscount.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free-shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    value={newDiscount.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                    placeholder={newDiscount.type === "percentage" ? "10" : "25.00"}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newDiscount.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Brief description of the discount"
                  />
                </div>

                <div>
                  <Label htmlFor="maxUses">Max Uses (Optional)</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={newDiscount.maxUses}
                    onChange={(e) => handleInputChange("maxUses", e.target.value)}
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newDiscount.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Discount</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Uses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">302</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Savings Given</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,456</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5%</div>
            </CardContent>
          </Card>
        </div>

        {/* Discounts Table */}
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{discount.code}</code>
                      <Button variant="ghost" size="sm" onClick={() => copyDiscountCode(discount.code)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{discount.description}</div>
                  </TableCell>
                  <TableCell>{discount.type}</TableCell>
                  <TableCell className="font-medium">{discount.value}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {discount.uses} / {discount.maxUses || "∞"}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{
                          width: `${discount.maxUses ? (discount.uses / discount.maxUses) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                      {new Date(discount.expiryDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(discount.status)} border`}>{discount.status}</Badge>
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
      </div>
    </AdminLayout>
  )
}
