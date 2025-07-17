import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import Order from "@/backend/models/Order";
import Product from "@/backend/models/Product";
import ThemedBox from "@/backend/models/ThemedBox";
import Cart from "@/backend/models/Cart";

// Handler for fetching a user's own orders
export async function GET(req: NextRequest) {
  // A user must be authenticated to see their orders
  const authResult = await authenticateAndAuthorize(req);
  if (authResult.response) {
    return authResult.response;
  }
  const user = authResult.user!;

  await dbConnect();
  try {
    const orders = await Order.find({ user: user.id })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching orders", error },
      { status: 500 }
    );
  }
}

// Handler for creating a new order
export async function POST(req: NextRequest) {
  // A user must be authenticated to create an order
  const authResult = await authenticateAndAuthorize(req);
  if (authResult.response) {
    return authResult.response;
  }
  const user = authResult.user!;

  await dbConnect();

  try {
    const { shippingAddress, paymentMethod, cartItems } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { message: "No items in cart" },
        { status: 400 }
      );
    }

    let finalOrderItems: any[] = [];
    let calculatedTotalPrice = 0;

    // Process cart items, expanding any themed boxes into individual products
    for (const item of cartItems) {
      if (item.type === "themedBox" && item.themedBoxId) {
        // If the item is a themed box, find it and add its contents to the order
        const themedBox = await ThemedBox.findById(item.themedBoxId).populate(
          "products"
        );
        if (themedBox) {
          calculatedTotalPrice += themedBox.price;
          for (const product of themedBox.products) {
            finalOrderItems.push({
              name: product.name,
              quantity: 1,
              image: product.images[0],
              price: product.price,
              product: product._id,
            });
            // NOTE: In a real-world scenario, you would also decrement stock here
            await Product.findByIdAndUpdate(product._id, {
              $inc: { stock: -1 },
            });
          }
        }
      } else if (item.type === "product" && item.productId) {
        // If the item is a single product
        const product = await Product.findById(item.productId);
        if (product) {
          calculatedTotalPrice += product.price * item.quantity;
          finalOrderItems.push({
            name: product.name,
            quantity: item.quantity,
            image: product.images[0],
            price: product.price,
            product: product._id,
          });
          // NOTE: Decrement stock for individual items
          await Product.findByIdAndUpdate(product._id, {
            $inc: { stock: -item.quantity },
          });
        }
      }
    }

    if (finalOrderItems.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty or items are invalid" },
        { status: 400 }
      );
    }

    // Create the new order
    const order = new Order({
      user: user.id,
      orderItems: finalOrderItems,
      shippingAddress,
      paymentMethod,
      totalPrice: calculatedTotalPrice,
    });

    const createdOrder = await order.save();

    // Clear the user's cart after the order is created
    await Cart.findOneAndDelete({ user: user.id });

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Error creating order", error },
      { status: 500 }
    );
  }
}
