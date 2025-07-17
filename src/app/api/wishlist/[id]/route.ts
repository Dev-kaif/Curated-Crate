/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/wishlist/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Wishlist from "@/backend/models/Wishlist";
import Product from "@/backend/models/Product"; // Make sure Product model is imported
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import mongoose from "mongoose";
import { IProduct } from "@/types"; // Assuming you have this type

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();
  const { id } = params;
  const productIdToRemove = id;

  if (!mongoose.Types.ObjectId.isValid(productIdToRemove)) {
    return NextResponse.json(
      { success: false, message: "Invalid Product ID format." },
      { status: 400 }
    );
  }

  try {
    // Find the wishlist and pull the item in one step
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: authenticatedUser.id },
      {
        $pull: {
          items: { productId: new mongoose.Types.ObjectId(productIdToRemove) },
        },
      },
      { new: true } // This option returns the document *after* the update has been applied
    );

    if (!wishlist) {
      // This can happen if the user has no wishlist, which is not an error.
      // We can just return an empty successful response.
      return NextResponse.json({ success: true, data: { items: [] } });
    }

    // ✅ FIX: After removing the item, we must populate the remaining items
    // to send the complete, updated data back to the frontend.
    await wishlist.populate({
      path: "items.productId",
      model: Product,
      select: "name price images stock description category", // Select all fields your frontend needs
    });

    // Format the remaining items to match the frontend's expected structure
    const formattedItems = wishlist.items.map((item: any) => {
      const productData = item.productId as IProduct;
      return {
        _id: productData._id,
        productId: productData._id,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        images: productData.images,
        stock: productData.stock,
        category: productData.category,
      };
    });

    return NextResponse.json({
      success: true,
      data: { items: formattedItems },
    });
  } catch (error: any) {
    console.error("Error removing product from wishlist:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove product from wishlist.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
