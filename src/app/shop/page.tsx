"use client"

import { motion } from "framer-motion"
import { useState, useMemo } from "react"
import { Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageLayout } from "@/components/Layout/page-layout"
import { useStore, type Product } from "@/contexts/store-context"
import Link from "next/link"

// Mock product data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Lavender Candle",
    price: 24,
    image: "/placeholder.svg?height=300&width=300",
    category: "Wellness",
    description: "Hand-poured soy candle with natural lavender essential oil",
  },
  {
    id: "2",
    name: "Artisan Chocolate",
    price: 18,
    image: "/placeholder.svg?height=300&width=300",
    category: "Gourmet",
    description: "Small-batch dark chocolate with sea salt",
  },
  {
    id: "3",
    name: "Herbal Tea Set",
    price: 32,
    image: "/placeholder.svg?height=300&width=300",
    category: "Gourmet",
    description: "Organic herbal tea blend collection",
  },
  {
    id: "4",
    name: "Hand Cream",
    price: 16,
    image: "/placeholder.svg?height=300&width=300",
    category: "Wellness",
    description: "Moisturizing hand cream with shea butter",
  },
  {
    id: "5",
    name: "Leather Notebook",
    price: 22,
    image: "/placeholder.svg?height=300&width=300",
    category: "Stationery",
    description: "Handbound leather journal with lined pages",
  },
  {
    id: "6",
    name: "Bath Salts",
    price: 20,
    image: "/placeholder.svg?height=300&width=300",
    category: "Wellness",
    description: "Himalayan pink salt with eucalyptus",
  },
  {
    id: "7",
    name: "Coffee Beans",
    price: 28,
    image: "/placeholder.svg?height=300&width=300",
    category: "Gourmet",
    description: "Single-origin coffee beans, medium roast",
  },
  {
    id: "8",
    name: "Artisan Soap",
    price: 14,
    image: "/placeholder.svg?height=300&width=300",
    category: "Wellness",
    description: "Natural soap bar with olive oil and herbs",
  },
]

const ProductCard = ({ product }: { product: Product }) => {
  const { dispatch } = useStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <Link href={`/shop/details/${product.id}`}>
          <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        <CardContent className="p-6">
          <Link href={`/shop/details/${product.id}`}>
            <h3 className="font-serif font-bold text-lg text-foreground mb-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-foreground/60 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-primary font-bold text-xl">${product.price}</p>
            <Button
              onClick={() => dispatch({ type: "ADD_TO_CART", product })}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4"
            >
              Add to Box
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) => {
  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-full"
      >
        Previous
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-full ${currentPage === page ? "bg-primary text-primary-foreground" : ""}`}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-full"
      >
        Next
      </Button>
    </div>
  )
}

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 50])
  const [sortBy, setSortBy] = useState("popularity")
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const itemsPerPage = 8

  const categories = ["Gourmet", "Wellness", "Stationery"]

  const filteredProducts = useMemo(() => {
    const filtered = mockProducts.filter((product) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
      return categoryMatch && priceMatch
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order for popularity
        break
    }

    return filtered
  }, [selectedCategories, priceRange, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
    setCurrentPage(1)
  }

  return (
    <PageLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">Explore Our Collection</h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Discover handcrafted items from independent artisans to build your perfect gift box
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="p-6 bg-background border-0 shadow-lg sticky top-24">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-primary" />
                    <h3 className="font-serif font-bold text-lg text-foreground">Filters</h3>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Category</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                          />
                          <label htmlFor={category} className="text-sm text-foreground/70 cursor-pointer">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </h4>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={50}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategories([])
                      setPriceRange([0, 50])
                      setCurrentPage(1)
                    }}
                    className="w-full rounded-full"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Sort and View Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex items-center justify-between mb-8"
              >
                <p className="text-foreground/70">
                  Showing {paginatedProducts.length} of {filteredProducts.length} products
                </p>

                <div className="flex items-center space-x-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 rounded-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="p-2 rounded-full"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="p-2 rounded-full"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Products Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {paginatedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
