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

// INTERFACES
export interface Product {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  imageUrl?: string;
  stock: number;
  category?: string;
  productId?: string;
  compareAtPrice?: number;
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

export interface ThemedBox {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  products: Product[];
  features?: string[];
  isActive: boolean;
  originalPrice?: number;
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

interface StoreContextType {
  state: StoreState;
  dispatch: React.Dispatch<StoreAction>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearCart: () => void;
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

// STORE PROVIDER COMPONENT
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

  const addToCart = async (productId: string, quantity: number) => {
    try {
      const { data } = await axios.post("/api/cart", { productId, quantity });
      if (data.success) {
        dispatch({
          type: "SET_CART",
          payload: transformBackendCart(data.data),
        });
      }
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
        clearCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// CUSTOM HOOK
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
