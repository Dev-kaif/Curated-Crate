/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/cart/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import Cart from "@/backend/models/Cart";
import Product from "@/backend/models/Product";
// Assuming you also have a ThemedBox model for population
import ThemedBox from "@/backend/models/ThemedBox";
import mongoose from "mongoose";

// Handler for updating an item's quantity in the cart

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticateAndAuthorize(req);
  if (authResult.response) {
    return authResult.response;
  }
  const user = authResult.user!;
  const cartItemId = (await params).id; // ✅ FIX: No 'await' needed here

  if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
    return NextResponse.json(
      { message: "Invalid cart item ID" },
      { status: 400 }
    );
  }

  await dbConnect();
  try {
    const { quantity } = await req.json();

    if (typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json(
        { message: "Quantity must be a positive number" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({
      user: new mongoose.Types.ObjectId(user.id),
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const itemToUpdate = cart.items.find(
      (item) => item._id?.toString() === cartItemId
    );

    if (!itemToUpdate) {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 }
      );
    }

    // (Your stock check logic is fine)
    if (itemToUpdate.productId) {
        // ...
    }

    itemToUpdate.quantity = quantity;

    const updatedCart = await cart.save();

    // ✅ FIX: Only populate the 'productId' path that actually exists in your schema.
    await updatedCart.populate({
      path: "items.productId",
      model: "Product",
      select: "name price images stock", // Optionally select fields
    });

    // The API should return the updated cart data in a consistent format
    return NextResponse.json({ success: true, data: updatedCart });

  } catch (error: any) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { success: false, message: "Error updating cart item", error: error.message },
      { status: 500 }
    );
  }
}

// Handler for removing an item from the cart
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const authResult = await authenticateAndAuthorize(req);
//   if (authResult.response) {
//     return authResult.response;
//   }
//   const user = authResult.user!;
//   const cartItemId = (await params).id; // FIX: No await needed for params

//   if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
//     return NextResponse.json(
//       { message: "Invalid cart item ID" },
//       { status: 400 }
//     );
//   }

//   await dbConnect();
//   try {
//     const cart = await Cart.findOne({
//       user: new mongoose.Types.ObjectId(user.id), // FIX: Convert user ID to ObjectId
//     });

//     if (!cart) {
//       return NextResponse.json({ message: "Cart not found" }, { status: 404 });
//     }

//     // Find the index of the item to remove
//     const itemIndex = cart.items.findIndex(
//       (item) => item._id?.toString() === cartItemId
//     );

//     if (itemIndex === -1) {
//       return NextResponse.json(
//         { message: "Item not found in cart" },
//         { status: 404 }
//       );
//     }

//     // Remove the item from the array
//     cart.items.splice(itemIndex, 1);

//     // FIX: Call .save() to trigger hooks (like totalPrice recalculation)
//     const updatedCart = await cart.save();

//     return NextResponse.json(updatedCart);
//   } catch (error: any) {
//     console.error("Error removing cart item:", error);
//     return NextResponse.json(
//       { message: "Error removing cart item", error: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticateAndAuthorize(req);
  if (authResult.response) {
    return authResult.response;
  }
  const user = authResult.user!;
  const cartItemId = params.id;

  if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
    return NextResponse.json(
      { success: false, message: "Invalid cart item ID" },
      { status: 400 }
    );
  }

  await dbConnect();
  try {
    const cart = await Cart.findOne({
      user: new mongoose.Types.ObjectId(user.id),
    });

    if (!cart) {
      return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });
    }
    
    // Keep a reference to the item's original length
    const initialItemCount = cart.items.length;

    // Remove the item from the items array
    cart.items = cart.items.filter(
      (item) => item._id?.toString() !== cartItemId
    );
    
    // Check if an item was actually removed
    if (cart.items.length === initialItemCount) {
       return NextResponse.json(
        { success: false, message: "Item not found in cart" },
        { status: 404 }
      );
    }

    const savedCart = await cart.save();

    // ✅ FIX: After saving, populate the cart to get the full product details
    await savedCart.populate({
      path: "items.productId",
      model: Product,
      select: "name price images stock",
    });

    return NextResponse.json({ success: true, data: savedCart });

  } catch (error: any) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { success: false, message: "Error removing cart item", error: error.message },
      { status: 500 }
    );
  }
}