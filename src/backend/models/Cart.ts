import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { ICart, ICartItem } from "@/types"; // Import both interfaces

// Define the Mongoose Document type for Cart Item
interface CartItemDocument extends Omit<ICartItem, "_id">, Document {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
}

interface CartDocument extends Omit<ICart, "_id">, Document {
  userId: Types.ObjectId;
  items: Types.DocumentArray<CartItemDocument>;
}

const cartItemSchema = new Schema<CartItemDocument>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    stock: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const cartSchema = new Schema<CartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  next();
});

const Cart: Model<CartDocument> =
  (mongoose.models.Cart as Model<CartDocument>) ||
  mongoose.model<CartDocument>("Cart", cartSchema);

export default Cart;
