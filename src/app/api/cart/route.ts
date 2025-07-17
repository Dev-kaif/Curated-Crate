/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Product from "@/backend/models/Product";
import Cart from "@/backend/models/Cart";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import {
  ICartItem,
  IProduct as BackendIProduct,
  ICartItemFrontend,
} from "@/types";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();

  try {
    const userIdString = authenticatedUser.id; // "687834128ce058f75d97aa79"

    // ✅ Convert the string to a proper ObjectId
    const userIdObject = new mongoose.Types.ObjectId(userIdString);

    // Now use the ObjectId in your query
    const cart = await Cart.findOne({ user: userIdObject })
      .populate({
        path: "items.productId",
        model: Product,
        select: "name price images stock",
      })
      .lean(); // Use .lean() for faster query results (returns plain JavaScript objects)

    if (!cart) {
      // If no cart exists for the user, return an empty cart structure.
      return NextResponse.json(
        { success: true, data: { items: [], totalPrice: 0 } },
        { status: 200 }
      );
    }

    const formattedItems: ICartItemFrontend[] = cart.items
      .filter(
        (item) => item.productId && (item.productId as BackendIProduct).images
      )
      .map((item) => {
        const productData = item.productId as BackendIProduct;
        return {
          _id: item._id!.toString(),
          productId: productData._id!.toString(),
          name: productData.name,
          imageUrl:
            productData.images?.[0] || "/images/placeholder-product.jpg",
          price: productData.price,
          quantity: item.quantity,
          stock: productData.stock !== undefined ? productData.stock : 0,
        };
      });

      console.log(formattedItems)

    // Recalculate totalPrice based on the formatted (and potentially filtered) items.
    const recalculatedTotalPrice = formattedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Return the formatted cart data.
    return NextResponse.json(
      {
        success: true,
        data: {
          _id: cart._id!.toString(), // FIX: Use non-null assertion for cart._id
          userId: cart.user!.toString(), // FIX: Use non-null assertion for cart.user
          items: formattedItems,
          totalPrice: recalculatedTotalPrice, // Use recalculated total price
          createdAt: cart.createdAt,
          updatedAt: cart.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cart.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Adds a new product to the user's cart or updates quantity if product already exists.
 */
export async function POST(request: NextRequest) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();

  try {
    const { productId, quantity }: { productId: string; quantity: number } =
      await request.json();

    // Validate incoming product ID and quantity
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Product ID." },
        { status: 400 }
      );
    }
    if (typeof quantity !== "number" || quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Quantity must be a positive number." },
        { status: 400 }
      );
    }

    // Find the product by ID to get its details and stock
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }
    // Ensure the product has images defined before adding to cart
    if (!product.images || product.images.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product has no images defined." },
        { status: 400 }
      );
    }

    // Check if the requested quantity exceeds product stock
    if (product.stock !== undefined && product.stock < quantity) {
      return NextResponse.json(
        {
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        },
        { status: 400 }
      );
    }

    // Find or create the user's cart
    const userIdObject = new mongoose.Types.ObjectId(authenticatedUser.id);
    let cart = await Cart.findOne({ user: userIdObject });

    if (!cart) {
      cart = await Cart.create({
        user: authenticatedUser.id,
        items: [],
        totalPrice: 0,
      });
    }

    // Check if the item already exists in the cart
    const itemIndex = cart.items.findIndex(
      (item) => (item.productId as mongoose.Types.ObjectId).equals(productId) // Cast to ObjectId for .equals()
    );

    if (itemIndex > -1) {
      // Item exists in cart, update its quantity
      const existingItem = cart.items[itemIndex];
      const newQuantity = existingItem.quantity + quantity;

      // Validate total quantity against product stock
      if (product.stock !== undefined && product.stock < newQuantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Cannot add more. Insufficient stock for ${product.name}.`,
          },
          { status: 400 }
        );
      }
      existingItem.quantity = newQuantity;
    } else {
      // Item does not exist, add as a new cart item subdocument
      const newItem: ICartItem = {
        // Use ICartItem from '@/types'
        productId: new mongoose.Types.ObjectId(productId),
        name: product.name,
        // Assign the first image from the 'images' array to 'imageUrl'
        imageUrl: product.images[0] || "/images/placeholder-product.jpg", // Fallback to placeholder
        price: product.price,
        quantity: quantity,
        stock: product.stock !== undefined ? product.stock : 0,
      };
      cart.items.push(newItem);
    }

    // Save the cart (pre-save hook will automatically recalculate totalPrice)
    await cart.save();

    return NextResponse.json({ success: true, data: cart }, { status: 200 });
  } catch (error: any) {
    console.error("Error adding/updating cart item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add/update cart item.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
