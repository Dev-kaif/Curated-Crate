// src/backend/models/Discount.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDiscount extends Document {
  code: string;
  type: "percentage" | "fixed" | "free-shipping";
  value: number;
  description?: string;
  uses: number;
  maxUses?: number;
  expiryDate?: Date;
  isActive: boolean;
}

const DiscountSchema = new Schema<IDiscount>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed", "free-shipping"],
      required: true,
    },
    value: { type: Number, required: true },
    description: { type: String, trim: true },
    uses: { type: Number, default: 0 },
    maxUses: { type: Number },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Discount: Model<IDiscount> =
  mongoose.models.Discount ||
  mongoose.model<IDiscount>("Discount", DiscountSchema);

export default Discount;
