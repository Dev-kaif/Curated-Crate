"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  specifications?: Record<string, string>
}

export interface CartItem extends Product {
  quantity: number
}

interface StoreState {
  cart: CartItem[]
  wishlist: Product[]
  searchQuery: string
  isSearchOpen: boolean
}

type StoreAction =
  | { type: "ADD_TO_CART"; product: Product }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "ADD_TO_WISHLIST"; product: Product }
  | { type: "REMOVE_FROM_WISHLIST"; productId: string }
  | { type: "SET_SEARCH_QUERY"; query: string }
  | { type: "TOGGLE_SEARCH"; isOpen?: boolean }

const initialState: StoreState = {
  cart: [],
  wishlist: [],
  searchQuery: "",
  isSearchOpen: false,
}

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.cart.find((item) => item.id === action.product.id)
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.product, quantity: 1 }],
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.productId),
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart
          .map((item) => (item.id === action.productId ? { ...item, quantity: Math.max(0, action.quantity) } : item))
          .filter((item) => item.quantity > 0),
      }

    case "ADD_TO_WISHLIST":
      if (state.wishlist.find((item) => item.id === action.product.id)) {
        return state
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.product],
      }

    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => item.id !== action.productId),
      }

    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.query,
      }

    case "TOGGLE_SEARCH":
      return {
        ...state,
        isSearchOpen: action.isOpen ?? !state.isSearchOpen,
      }

    default:
      return state
  }
}

const StoreContext = createContext<{
  state: StoreState
  dispatch: React.Dispatch<StoreAction>
} | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState)

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
