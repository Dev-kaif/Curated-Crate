// src/contexts/store-context.tsx
"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  useEffect,
} from "react";
import axios from "axios";

// --- INTERFACES ---
export interface Product {
  id: string; // Used in frontend (e.g., ShopPage, ThemedBoxDetailPage)
  _id?: string; // Backend _id often comes back
  name: string;
  description: string;
  price: number;
  images: string[];
  imageUrl?: string;
  stock: number;
  category?: string; // Added from IProduct type in types/index.d.ts
  productId?: string; // Added from IProduct type in types/index.d.ts
  compareAtPrice?: number; // Added from IProduct type in types/index.d.ts
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  stock: number;
}

// Redefined ThemedBox to match the populated data structure received by the frontend
export interface ThemedBox {
  id: string; // Frontend uses 'id' instead of '_id'
  _id?: string; // Keep _id as optional in case it's still present
  name: string;
  description: string;
  price: number;
  image: string; // Direct image URL
  products: Product[]; // Populated product objects
  features?: string[]; // Optional features array
  isActive: boolean;
  originalPrice?: number; // From ThemedBoxWithDetails in themed/details/[id]/page.tsx
}

interface StoreState {
  cart: {
    items: CartItem[];
    totalPrice: number;
  };
  wishlist: Product[];
}

type StoreAction =
  | { type: "SET_CART"; payload: StoreState["cart"] }
  | { type: "SET_WISHLIST"; payload: Product[] };

// --- CONTEXT & REDUCER ---
interface StoreContextType {
  state: StoreState;
  dispatch: React.Dispatch<StoreAction>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearCart: () => void; // NEW: Function to clear the cart state
}

const StoreContext = createContext<StoreContextType | null>(null);

const initialState: StoreState = {
  cart: { items: [], totalPrice: 0 },
  wishlist: [],
};

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cart: action.payload };
    case "SET_WISHLIST":
      return { ...state, wishlist: action.payload || [] };
    default:
      return state;
  }
}

// --- STORE PROVIDER COMPONENT ---
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  const transformBackendCart = (backendData: any): StoreState["cart"] => {
    if (!backendData || !Array.isArray(backendData.items)) {
      return { items: [], totalPrice: 0 };
    }
    const transformedItems: CartItem[] = backendData.items.map((item: any) => ({
      id: item._id,
      productId: item.productId,
      name: item.name,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: item.quantity,
      stock: item.stock,
    }));
    return {
      items: transformedItems,
      totalPrice: backendData.totalPrice,
    };
  };

  useEffect(() => {
    const initializeStore = async () => {
      try {
        const [cartRes, wishlistRes] = await Promise.all([
          axios.get("/api/cart"),
          axios.get("/api/wishlist"),
        ]);

        if (cartRes.data.success) {
          const cart = transformBackendCart(cartRes.data.data);
          dispatch({ type: "SET_CART", payload: cart });
        }

        if (wishlistRes.data.success) {
          const products = wishlistRes.data.data.items || [];
          dispatch({ type: "SET_WISHLIST", payload: products });
        }
      } catch (error) {
        console.error("Failed to initialize store:", error);
        dispatch({ type: "SET_WISHLIST", payload: [] });
      }
    };
    initializeStore();
  }, []);

  // --- ASYNCHRONOUS ACTIONS ---

  const addToCart = async (productId: string, quantity: number) => {
    try {
      const { data } = await axios.post("/api/cart", { productId, quantity });
      if (data.success) {
        dispatch({
          type: "SET_CART",
          payload: transformBackendCart(data.data),
        });
      }
      // NEW LOGIC: If item was successfully added to cart, remove it from wishlist
      // Remove the single product from wishlist
      const isInWishlist = state.wishlist.some(
        (item) => item._id === productId
      );
      if (isInWishlist) {
        removeFromWishlist(productId);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const { data } = await axios.delete(`/api/cart/${cartItemId}`);
      if (data.success) {
        dispatch({
          type: "SET_CART",
          payload: transformBackendCart(data.data),
        });
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(cartItemId);
    try {
      const { data } = await axios.put(`/api/cart/${cartItemId}`, { quantity });
      if (data.success) {
        dispatch({
          type: "SET_CART",
          payload: transformBackendCart(data.data),
        });
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      const { data } = await axios.post("/api/wishlist", { productId });
      console.log("add==>", data);
      if (data.success) {
        dispatch({ type: "SET_WISHLIST", payload: data.data.items || [] });
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    console.log("i am here in remove wishlist");
    try {
      const { data } = await axios.delete(`/api/wishlist/${productId}`);
      console.log("rem ==>", data);
      if (data.success) {
        dispatch({ type: "SET_WISHLIST", payload: data.data.items || [] });
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  // NEW: clearCart function
  const clearCart = () => {
    dispatch({ type: "SET_CART", payload: { items: [], totalPrice: 0 } });
  };

  return (
    <StoreContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        dispatch,
        clearCart, // NEW: Expose clearCart
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// --- CUSTOM HOOK ---
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
