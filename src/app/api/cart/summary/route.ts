// src/app/api/cart/summary/route.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Cart from "@/backend/models/Cart";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import { calculateCartSummary } from "@/backend/lib/pricingService";
import { IPopulatedCartItem, IProduct } from "@/types"; // Import IProduct as well

export async function GET(request: NextRequest) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) {
    return authResult.response;
  }
  const authenticatedUser = authResult.user!;

  await dbConnect();

  try {
    const cart = await Cart.findOne({ userId: authenticatedUser.id })
      .populate({
        path: 'items.productId',
        model: 'Product',
        select: 'name price stock images',
      })
      .lean();

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: {
            subtotal: 0,
            shippingPrice: 0,
            taxPrice: 0,
            totalPrice: 0,
            itemCount: 0,
            itemsDetails: [],
            errors: []
          },
          message: "Cart is empty.",
        },
        { status: 200 }
      );
    }

    // --- FIX START ---
    const populatedAndFilteredCartItems: IPopulatedCartItem[] = [];

    for (const item of cart.items) {
      // Check if productId exists and is a valid Product object from population
      const populatedProduct = item.productId as IProduct | null | undefined;

      if (
        populatedProduct &&
        populatedProduct._id && 
        typeof populatedProduct.price === 'number' && // Ensure price is a number
        typeof populatedProduct.stock === 'number' && // Ensure stock is a number
        Array.isArray(populatedProduct.images) && // Ensure images is an array
        item.quantity !== undefined // Ensure quantity exists on the cart item itself
      ) {
        populatedAndFilteredCartItems.push({
          _id: item._id, // The _id of the cart item subdocument
          productId: populatedProduct, // The actual populated product document
          quantity: item.quantity,
        });
      } else {
        console.warn(`Invalid cart item found for cart ID ${cart._id}: Product missing or invalid for item _id ${item._id}`);
      }
    }

    if (populatedAndFilteredCartItems.length === 0 && cart.items.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Some items in your cart are no longer available or invalid. Please review your cart.",
        },
        { status: 400 }
      );
    }
    // --- FIX END ---

    const summary = await calculateCartSummary(populatedAndFilteredCartItems);

    if (summary.errors && summary.errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Error calculating cart summary. Some products may be unavailable or have issues.",
          details: summary.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          subtotal: summary.subtotal,
          shippingPrice: summary.shippingPrice,
          taxPrice: summary.taxPrice,
          totalPrice: summary.totalPrice,
          itemCount: summary.itemCount,
          itemsDetails: summary.itemsDetails,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error calculating cart summary:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate cart summary.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}