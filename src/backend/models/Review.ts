// src/models/Review.ts
import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { IReview } from '@/types';

// Define the Mongoose Document type for Review
interface ReviewDocument extends Omit<IReview, "_id">, Document {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
}

const reviewSchema = new Schema<ReviewDocument>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (once created)
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
    maxlength: 500, // Optional: limit comment length
  },
}, { timestamps: true });

// Ensure a user can only review a product once (or adjust unique index as needed)
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const Review: Model<ReviewDocument> = mongoose.models.Review as Model<ReviewDocument> || mongoose.model<ReviewDocument>('Review', reviewSchema);

export default Review;