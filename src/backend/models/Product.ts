import mongoose, { Document, Schema, models, model } from "mongoose";

// Interface for the Product document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number; // For sales
  images: string[];
  category: "Gourmet" | "Wellness" | "Stationery" | "Home Goods" | "Apparel";
  stock: number;
  reviews: mongoose.Schema.Types.ObjectId[];
  dimensions?: string; // e.g., "5in x 3in x 2in"
  weight?: number; // in grams
  materials?: string[];
  isActive: boolean;
}

// Mongoose schema for the Product
const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    images: [{ type: String, required: true }],
    category: {
      type: String,
      required: true,
      enum: ["Gourmet", "Wellness", "Stationery", "Home Goods", "Apparel"],
    },
    stock: { type: Number, required: true, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    dimensions: { type: String },
    weight: { type: Number },
    materials: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Create and export the Product model
const Product = models.Product || model<IProduct>("Product", ProductSchema);
export default Product;
