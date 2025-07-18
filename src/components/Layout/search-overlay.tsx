"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import axios from "axios";
import Link from "next/link";
import { Product, ThemedBox } from "@/contexts/store-context";

type SearchResultItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
} & ({ type: "product" } | { type: "themedBox" });

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSearchTerm("");
      setSearchResults([]);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `/api/search?q=${debouncedSearchTerm}`
        );
        if (response.data.success) {
          // FIX: Correctly map imageUrl for products and ensure type casting
          const products: SearchResultItem[] = response.data.data.products.map(
            (p: any) => ({
              ...p,
              id: p._id,
              imageUrl:
                p.images && p.images.length > 0
                  ? p.images[0]
                  : "/placeholder.svg", // Ensure imageUrl is set from images[0]
              type: "product" as const,
            })
          );
          const themedBoxes: SearchResultItem[] =
            response.data.data.themedBoxes.map((tb: any) => ({
              ...tb,
              id: tb._id,
              imageUrl: tb.image || "/placeholder.svg", // ThemedBox uses 'image' property
              type: "themedBox" as const,
            }));

          setSearchResults([...products, ...themedBoxes]);
        } else {
          setError(response.data.message || "Failed to fetch search results.");
          setSearchResults([]);
        }
      } catch (err: any) {
        console.error("Search API error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "An error occurred during search."
        );
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between border-b border-foreground/10">
        <div className="relative flex-grow mr-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60 h-5 w-5" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products, themed boxes..."
            className="w-full pl-10 pr-4 py-2 text-lg rounded-full border-foreground/20 focus:border-primary focus:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-foreground/10"
          aria-label="Close search"
        >
          <X className="w-6 h-6 text-foreground" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto container mx-auto px-6 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-foreground/70">Searching...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">
            <p>{error}</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((item) => (
              <Link
                key={item.id}
                href={
                  item.type === "product"
                    ? `/shop/details/${item.id}`
                    : `/themed/details/${item.id}`
                }
                onClick={onClose}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-4 p-4 bg-background border border-foreground/10 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-medium text-foreground text-lg">
                      {item.name}
                    </h3>
                    <p className="text-sm text-foreground/70 line-clamp-1">
                      {item.description}
                    </p>
                    <p className="text-primary font-bold">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : searchTerm && !isLoading ? (
          <div className="text-center py-12 text-foreground/70">
            <p>No results found for "{searchTerm}".</p>
          </div>
        ) : (
          <div className="text-center py-12 text-foreground/70">
            <p>Start typing to search for products or themed boxes.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
