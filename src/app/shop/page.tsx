"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Filter, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageLayout } from "@/components/Layout/page-layout";
import { useStore, type Product } from "@/contexts/store-context";
import Link from "next/link";
import axios from "axios";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      // You can add a success toast notification here
    } catch (error) {
      console.error("Error adding to cart:", error);
      // You can add an error toast notification here
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link href={`/shop/details/${product.id}`}>
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
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <CardContent className="p-6">
            <h3 className="font-serif font-bold text-lg text-foreground mb-2 hover:text-primary transition-colors truncate">
              {product.name}
            </h3>
            <p className="text-foreground/60 text-sm mb-3 line-clamp-2 h-10">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-primary font-bold text-xl">
                ${product.price.toFixed(2)}
              </p>
              <Button
                onClick={handleAddToCart}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4"
                disabled={isAdding}
              >
                {isAdding ? (
                  "Adding..."
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 mr-2" /> Add to Box
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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
          className={`w-10 h-10 rounded-full ${
            currentPage === page ? "bg-primary text-primary-foreground" : ""
          }`}
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
  );
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 8;

  const categories = [
    "Gourmet",
    "Wellness",
    "Stationery",
    "Home Goods",
    "Apparel",
  ];

  // Inside your ShopPage component

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get("/api/products", {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            sortBy,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            categories: selectedCategories.join(","),
          },
        });

        if (data && data.products) {
          const formattedProducts = data.products.map((p: any) => ({
            ...p,
            id: p._id,
          }));
          setProducts(formattedProducts);
          setTotalPages(data.totalPages);
          setTotalProducts(data.totalProducts);
        } else {
          throw new Error("Received invalid data from server.");
        }
      } catch (err: any) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err.message;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedCategories, priceRange, sortBy]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (newRange: number[]) => {
    setPriceRange(newRange);
    setCurrentPage(1);
  };

  return (
    <PageLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
              Explore Our Collection
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Discover handcrafted items from independent artisans to build your
              perfect gift box
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
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
                    <h3 className="font-serif font-bold text-lg text-foreground">
                      Filters
                    </h3>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3">
                      Category
                    </h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) =>
                              handleCategoryChange(category, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={category}
                            className="text-sm text-foreground/70 cursor-pointer"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </h4>
                    <Slider
                      value={priceRange}
                      onValueChange={handlePriceChange}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategories([]);
                      setPriceRange([0, 100]);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-full"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            </motion.div>

            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex items-center justify-between mb-8"
              >
                <p className="text-foreground/70">
                  Showing {products.length} of {totalProducts} products
                </p>

                <div className="flex items-center space-x-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 rounded-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(itemsPerPage)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-foreground/5 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center text-destructive">{error}</div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              )}

              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
