// src/models/Review.ts
import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { IReview } from "@/types"; // Assuming IReview might need productId and themedBoxId

// Define the Mongoose Document type for Review
interface ReviewDocument extends Omit<IReview, "_id">, Document {
  productId?: Types.ObjectId;
  themedBoxId?: Types.ObjectId; 
  userId: Types.ObjectId;
}

const reviewSchema = new Schema<ReviewDocument>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product", // Reference to the Product model
      required: false, // Make optional
    },
    themedBoxId: {
      // New field for themed box reviews
      type: Schema.Types.ObjectId,
      ref: "ThemedBox", // Reference to the ThemedBox model
      required: false, // Make optional
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (once created)
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Custom validator to ensure that either productId OR themedBoxId is present, but not both
reviewSchema.pre("validate", function (next) {
  if (
    (this.productId && this.themedBoxId) ||
    (!this.productId && !this.themedBoxId)
  ) {
    // If both are present, or neither is present, it's invalid
    this.invalidate(
      "productId",
      "A review must be for either a product or a themed box, but not both.",
      this.productId
    );
    this.invalidate(
      "themedBoxId",
      "A review must be for either a product or a themed box, but not both.",
      this.themedBoxId
    );
  }
  next();
});

// Ensure a user can only review a specific product once (sparse: true allows nulls)
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true, sparse: true });

// Ensure a user can only review a specific themed box once (sparse: true allows nulls)
reviewSchema.index(
  { themedBoxId: 1, userId: 1 },
  { unique: true, sparse: true }
);

const Review: Model<ReviewDocument> =
  (mongoose.models.Review as Model<ReviewDocument>) ||
  mongoose.model<ReviewDocument>("Review", reviewSchema);

export default Review;
