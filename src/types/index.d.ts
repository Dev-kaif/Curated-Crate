import { Types } from "mongoose";

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  category: string;
  images?: string[];
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
  reviewsCount?: number;
  isNewlyReleased?: boolean;
  isOnSale?: boolean;
}

export interface IReview {
  _id?: Types.ObjectId;
  productId?: Types.ObjectId;
  themedBoxId?: Types.ObjectId; // Add themedBoxId
  userId: Types.ObjectId;
  userName: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id?: string | Types.ObjectId;
  email: string;
  password?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
  role: "user" | "admin";
  addresses?: IAddress[];
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
}

export interface IAddress {
  _id?: Types.ObjectId | string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  label?: "Home" | "Work" | "Other"; // Make it optional since it has a default
  isDefault?: boolean;
}

export interface ICartItem {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface ICart {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICartItemFrontend {
  _id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "completed";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "card" | "cash_on_delivery" | "paypal";

export interface IOrder {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | IUser;
  items: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress?: IAddress;
  totalPrice: number;
  shippingPrice: number;
  taxPrice: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentResult?: {
    id: string;
    status: string;
    update_time?: string;
    email_address?: string;
  };
  isPaid: boolean;
  paidAt?: Date;
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWishlistItem {
  _id?: Types.ObjectId | string;
  productId: Types.ObjectId | string;
  addedAt: Date;
}

export interface IWishlist {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  items: IWishlistItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWishlistItemFrontend {
  _id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  oldPrice?: number;
  isNewlyReleased?: boolean;
  isOnSale?: boolean;
  addedAt: string;
  stock?: number;
}

export interface IPet {
  _id: string;
  name: string;
  category: string;
  type: string;
  age: string;
  color: string;
  gender: "Male" | "Female" | "N/A";
  size: "Tiny" | "Small" | "Medium" | "Large";
  weight: number;
  price: number;
  location: string;
  images: string[];
  description?: string;
  isNewlyAdded?: boolean;
  availableDate?: string;
  breed?: string;
  dateOfBirth?: string;
  additionalInfo?: string[];
  mapLocation?: {
    address: string;
    coords: { lat: number; lng: number };
    link: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface IPopulatedCartItem {
  _id: Types.ObjectId; // The Mongoose _id for the cart item subdocument
  productId: IProduct; // This is the populated IProduct document
  quantity: number;
}

// The output structure of the pricing service, including all calculated components
export interface CalculatedCartSummary {
  subtotal: number;
  shippingPrice: number;
  taxRate: number; // Useful to know what rate was applied
  taxPrice: number;
  totalPrice: number;
  itemCount: number;
  // Details of items used for calculation, including authoritative price and stock
  itemsDetails: Array<{
    productId: string; // Product ID as string
    name: string;
    price: number; // Authoritative price from DB
    quantity: number;
    stock: number; // Authoritative stock from DB
    imageUrl: string; // Include image URL for order items
    totalItemPrice: number; // Price for this specific item (price * quantity)
  }>;
  errors: string[]; // To capture any non-fatal issues (e.g., product not found)
}

// Type for the input to stock validation/deduction functions
export interface IStockOperationItem {
  productId: string; // Product ID as string
  quantity: number;
}
