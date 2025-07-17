// src/backend/models/GalleryImage.ts
// Assuming your backend models directory is at src/backend/models/

import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { IGalleryImage } from "@/types"; // Adjust this path if necessary

// Extend Document to include Mongoose's default properties like _id, createdAt, updatedAt,
// and make sure it aligns with the IGalleryImage interface.
interface GalleryImageDocument extends Omit<IGalleryImage, "_id">, Document {
  _id: Types.ObjectId; // Mongoose internal ObjectId type for _id
}

const GalleryImageSchema: Schema<GalleryImageDocument> = new Schema(
  {
    imageUrl: { 
      type: String, 
      required: [true, "Image URL is required."],
      trim: true,
      
      // Basic URL validation for common image formats
      match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i, "Please provide a valid image URL."],
    },
  },
  {
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const GalleryImage: Model<GalleryImageDocument> =
  (mongoose.models.GalleryImage as Model<GalleryImageDocument>) ||
  mongoose.model<GalleryImageDocument>("GalleryImage", GalleryImageSchema);

export default GalleryImage;
