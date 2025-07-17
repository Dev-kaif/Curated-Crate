// src/backend/models/Wishlist.ts
import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { IWishlist, IWishlistItem } from "@/types"; // Import both interfaces

// Define the Mongoose Document type for WishlistItem (subdocument)
interface WishlistItemDocument extends Omit<IWishlistItem, "_id">, Document {}

// Define the Mongoose Document type for Wishlist
interface WishlistDocument extends IWishlist, Document {
  _id: Types.ObjectId; 
}

// Define the WishlistItem Schema (as a subdocument schema)
const wishlistItemSchema = new Schema<WishlistItemDocument>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product", // Reference to the Product model
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now, // Automatically set when added
    },
  },
  { _id: true }
); // Ensure subdocuments have their own _id

// Define the main Wishlist Schema
const wishlistSchema = new Schema<WishlistDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
      unique: true, // A user can only have one wishlist
    },
    items: [wishlistItemSchema], // Array of wishlistItemSchema subdocuments
  },
  { timestamps: true }
); // Mongoose automatically adds createdAt and updatedAt

// Add an index for faster lookup by userId
wishlistSchema.index({ userId: 1 });

const Wishlist: Model<WishlistDocument> =
  (mongoose.models.Wishlist as Model<WishlistDocument>) ||
  mongoose.model<WishlistDocument>("Wishlist", wishlistSchema);

export default Wishlist;
