import mongoose, { Document, Schema, models, model } from "mongoose";

// Interface for the ThemedBox document
export interface IThemedBox extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  products: mongoose.Schema.Types.ObjectId[]; // An array of Product IDs
  features: string[]; // NEW: An array of feature strings
  isActive: boolean;
}

// Mongoose schema for the ThemedBox
const ThemedBoxSchema = new Schema<IThemedBox>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ThemedBox =
  models.ThemedBox || model<IThemedBox>("ThemedBox", ThemedBoxSchema);
export default ThemedBox;
