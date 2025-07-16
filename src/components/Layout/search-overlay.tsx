"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { X, Search } from "lucide-react"
import { useStore } from "@/contexts/store-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const SearchOverlay = () => {
  const { state, dispatch } = useStore()
  const [localQuery, setLocalQuery] = useState("")

  useEffect(() => {
    if (state.isSearchOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [state.isSearchOpen])

  const handleSearch = () => {
    dispatch({ type: "SET_SEARCH_QUERY", query: localQuery })
    dispatch({ type: "TOGGLE_SEARCH", isOpen: false })
    // Here you would typically navigate to search results
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
    if (e.key === "Escape") {
      dispatch({ type: "TOGGLE_SEARCH", isOpen: false })
    }
  }

  return (
    <AnimatePresence>
      {state.isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => dispatch({ type: "TOGGLE_SEARCH", isOpen: false })}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="w-full max-w-2xl bg-background rounded-2xl p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-foreground">Search Products</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch({ type: "TOGGLE_SEARCH", isOpen: false })}
                className="p-2 hover:bg-foreground/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/50" />
              <Input
                type="text"
                placeholder="Search for candles, chocolates, soaps..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-12 pr-4 py-4 text-lg border-2 border-foreground/10 focus:border-primary rounded-full"
                autoFocus
              />
            </div>

            <div className="flex justify-center mt-6">
              <Button
                onClick={handleSearch}
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              >
                Search Products
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
