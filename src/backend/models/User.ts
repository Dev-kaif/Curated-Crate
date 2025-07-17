// src/models/User.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAddress {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  label?: "Home" | "Work" | "Other";
  isDefault?: boolean;
}

export interface IUser {
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

interface AddressDocument extends IAddress, Document {}

const addressSchema = new Schema<AddressDocument>(
  {
    street: {
      type: String,
      required: [true, "Street address is required."],
      trim: true,
    },
    apartment: { type: String, trim: true },
    city: { type: String, required: [true, "City is required."], trim: true },
    state: {
      type: String,
      required: [true, "State/Province is required."],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, "Zip/Postal code is required."],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required."],
      trim: true,
    },
    label: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
      trim: true,
      required: false,
    },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: false }
);

export interface UserDocument extends IUser, Document {
  _id: Types.ObjectId;
  password?: string; // Password should be optional here to align with IUser
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true, // This automatically creates an index on the email field
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be at least 6 characters long."],
      select: false,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    name: { type: String, trim: true, required: false },
    phone: {
      type: String,
      trim: true,
      required: false,
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number."],
    },
    profilePicture: {
      type: String,
      trim: true,
      required: false,
      match: [
        /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/,
        "Please provide a valid image URL.",
      ],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: [true, "User role is required."],
    },
    addresses: { type: [addressSchema], default: [] },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

userSchema.index({ role: 1 });
userSchema.index({ "addresses.isDefault": 1 });

const User: Model<UserDocument> =
  (mongoose.models.User as Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", userSchema);

export default User;
