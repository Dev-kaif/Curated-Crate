"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2, Package } from "lucide-react"
import Link from "next/link"

const themedBoxes = [
  {
    id: 1,
    name: "Birthday Celebration Crate",
    description: "Perfect for birthday celebrations",
    price: "$89.99",
    items: 8,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 2,
    name: "Relaxation Ritual Box",
    description: "Unwind and destress collection",
    price: "$124.50",
    items: 6,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 3,
    name: "Coffee Lover's Paradise",
    description: "For the ultimate coffee enthusiast",
    price: "$67.25",
    items: 5,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 4,
    name: "New Parent Care Package",
    description: "Support for new parents",
    price: "$156.75",
    items: 10,
    status: "Active",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: 5,
    name: "Holiday Special Box",
    description: "Seasonal holiday collection",
    price: "$98.00",
    items: 7,
    status: "Inactive",
    image: "/placeholder.svg?height=50&width=50",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 border-green-200"
    case "Inactive":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function ThemedBoxManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBoxes = themedBoxes.filter(
    (box) =>
      box.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      box.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AdminLayout title="Themed Box Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Themed Boxes</h2>
            <p className="text-sm text-gray-600">Manage your curated themed box collections</p>
          </div>
          <Link href="/admin/themed-boxes/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Themed Box
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search themed boxes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Themed Boxes Table */}
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Themed Box</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBoxes.map((box) => (
                <TableRow key={box.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={box.image || "/placeholder.svg"}
                        alt={box.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium">{box.name}</div>
                        <div className="text-sm text-gray-500">ID: {box.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-gray-600 truncate">{box.description}</p>
                  </TableCell>
                  <TableCell className="font-medium">{box.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1 text-gray-400" />
                      {box.items} items
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(box.status)} border`}>{box.status}</Badge>
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

        {filteredBoxes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No themed boxes found matching your search.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
