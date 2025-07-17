/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/wishlist/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Wishlist from "@/backend/models/Wishlist";
import Product from "@/backend/models/Product";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import mongoose from "mongoose";
import { IProduct } from "@/types";

// GET /api/wishlist - Fetch user's wishlist
export async function GET(request: NextRequest) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();

  try {
    // Find the wishlist for the authenticated user and populate product details
    const wishlist = await Wishlist.findOne({ userId: authenticatedUser.id })
      .populate({
        path: "items.productId",
        model: Product,
        // Select necessary product fields including createdAt for isNewlyReleased calculation
        select: "name price images oldPrice createdAt stock",
      })
      .lean(); // Use .lean() for faster results

    if (!wishlist) {
      // If no wishlist exists, return an empty one
      return NextResponse.json(
        { success: true, data: { items: [] } },
        { status: 200 }
      );
    }

    // Filter out items where productId population might have failed (e.g., product deleted)
    // and format the data to match frontend expectations (e.g., imageUrl from images array)
    const formattedItems = wishlist.items
      .filter((item) => item.productId !== null && item.productId !== undefined)
      .map((item) => {
        // FIX: Cast to unknown first, then to IProduct to correctly handle populated object type
        const productData = item.productId as unknown as IProduct;

        // Apply isNewlyReleased and isOnSale calculation
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const isNewlyReleased = productData.createdAt
          ? productData.createdAt >= sevenDaysAgo
          : false;
        const isOnSale =
          productData.oldPrice !== undefined &&
          productData.oldPrice > productData.price;

        return {
          _id: item._id?.toString(), // The ID of the wishlist item subdocument itself
          productId: productData._id?.toString(), // The actual product's ID
          name: productData.name,
          price: productData.price,
          oldPrice: productData.oldPrice,
          imageUrl:
            productData.images?.[0] || "/images/placeholder-product.jpg", // First image
          isNewlyReleased: isNewlyReleased, // Calculated flag
          isOnSale: isOnSale, // Calculated flag
          // Ensure addedAt is sent as an ISO string or a Date object that can be serialized
          addedAt:
            item.addedAt instanceof Date
              ? item.addedAt.toISOString()
              : item.addedAt,
          stock: productData.stock !== undefined ? productData.stock : 0, // Include stock
        };
      });

    return NextResponse.json(
      { success: true, data: { ...wishlist, items: formattedItems } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch wishlist.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add a product to user's wishlist
export async function POST(request: NextRequest) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();

  try {
    const { productId }: { productId: string } = await request.json();

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Product ID." },
        { status: 400 }
      );
    }

    // Check if product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    let wishlist = await Wishlist.findOne({ userId: authenticatedUser.id });

    if (!wishlist) {
      // Create new wishlist if it doesn't exist
      wishlist = await Wishlist.create({
        userId: authenticatedUser.id,
        items: [],
      });
    }

    // FIX: Explicitly cast item.productId to Types.ObjectId for .equals() method
    const itemExists = wishlist.items.some((item) =>
      (item.productId as mongoose.Types.ObjectId).equals(productId)
    );

    if (itemExists) {
      return NextResponse.json(
        { success: false, message: "Product already in wishlist." },
        { status: 409 }
      );
    }

    // Add new item to wishlist
    wishlist.items.push({
      productId: new mongoose.Types.ObjectId(productId),
      addedAt: new Date(),
    });

    await wishlist.save();

    return NextResponse.json(
      { success: true, message: "Product added to wishlist.", data: wishlist },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding product to wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add product to wishlist.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
