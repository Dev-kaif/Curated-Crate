// src/models/Order.ts
import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { IOrder, IOrderItem, IAddress } from "@/types";

// Define the Mongoose Document type for Order Item
interface OrderItemDocument extends Omit<IOrderItem, "_id">, Document {
  productId: Types.ObjectId;
}


// Define the Mongoose Document type for Order
interface OrderDocument extends Omit<IOrder, "_id">, Document {
  userId: Types.ObjectId;
  items: Types.DocumentArray<OrderItemDocument>;
  shippingAddress: IAddress; // Use IAddress directly
  billingAddress?: IAddress; // Use IAddress directly
}

const orderItemSchema = new Schema<OrderItemDocument>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: true }
);

const addressSchema = new Schema<IAddress>( // Use IAddress directly here too
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    shippingAddress: { type: addressSchema, required: true },
    billingAddress: { type: addressSchema },
    totalPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "completed" 
      ],
      default: "pending",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash_on_delivery", "paypal"],
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

const Order: Model<OrderDocument> =
  (mongoose.models.Order as Model<OrderDocument>) ||
  mongoose.model<OrderDocument>("Order", orderSchema);

export default Order;