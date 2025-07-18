// src/app/api/orders/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import Order from "@/backend/models/Order";
import Product from "@/backend/models/Product";
import ThemedBox from "@/backend/models/ThemedBox";
import Cart from "@/backend/models/Cart";
import Discount from "@/backend/models/Discount"; // Import Discount model
import { IOrderItem, IAddress, PaymentStatus } from "@/types";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const authResult = await authenticateAndAuthorize(req);
  if (authResult.response) {
    return authResult.response;
  }
  const user = authResult.user!;

  await dbConnect();
  try {
    const orders = await Order.find({ userId: user.id })
      .populate("items.productId")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching orders", error: error.message },
      { status: 500 }
    );
  }
}

// Handler for creating a new order
export async function POST(req: NextRequest) {
  const authResult = await authenticateAndAuthorize(req);
  if (authResult.response) {
    return authResult.response;
  }
  const user = authResult.user!;

  await dbConnect();

  try {
    const {
      shippingAddress,
      paymentMethod,
      cartItems,
      totalPrice,
      shippingPrice,
      taxPrice,
      paymentDetails,
      appliedCouponCode,
    } = await req.json();

    if (
      !shippingAddress ||
      !paymentMethod ||
      !cartItems ||
      cartItems.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required order details." },
        { status: 400 }
      );
    }
    if (
      typeof totalPrice !== "number" ||
      typeof shippingPrice !== "number" ||
      typeof taxPrice !== "number"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid pricing information." },
        { status: 400 }
      );
    }

    let finalOrderItems: IOrderItem[] = [];
    let productIdsToClearFromCart: string[] = [];
    let isThemedBoxDirectPurchase = false;

    for (const item of cartItems) {
      if (item.type === "themedBox" && item.themedBoxId) {
        isThemedBoxDirectPurchase = true;
        if (!mongoose.Types.ObjectId.isValid(item.themedBoxId)) {
          console.error(`Invalid Themed Box ID format: ${item.themedBoxId}`);
          return NextResponse.json(
            { success: false, message: "Invalid Themed Box ID format." },
            { status: 400 }
          );
        }
        const themedBox = await ThemedBox.findById(item.themedBoxId).populate(
          "products"
        );
        if (!themedBox) {
          console.error(`Themed Box with ID ${item.themedBoxId} not found.`);
          return NextResponse.json(
            {
              success: false,
              message: `Themed Box with ID ${item.themedBoxId} not found.`,
            },
            { status: 404 }
          );
        }

        for (const product of themedBox.products as any[]) {
          if (!product || !product._id) {
            console.error(
              `Product in themed box ${themedBox._id} is missing _id or is null:`,
              product
            );
            return NextResponse.json(
              {
                success: false,
                message: `A product in themed box "${themedBox.name}" is invalid or missing ID.`,
              },
              { status: 400 }
            );
          }
          if (product.stock < 1) {
            return NextResponse.json(
              {
                success: false,
                message: `Insufficient stock for product "${product.name}" in themed box "${themedBox.name}".`,
              },
              { status: 400 }
            );
          }

          finalOrderItems.push({
            productId: product._id,
            name: product.name,
            imageUrl: product.images?.[0] || "/images/placeholder-product.jpg",
            price: product.price,
            quantity: 1,
          });
          await Product.findByIdAndUpdate(product._id, { $inc: { stock: -1 } });
        }
      } else if (item.type === "product" && item.productId && item.quantity) {
        if (!mongoose.Types.ObjectId.isValid(item.productId)) {
          console.error(
            `Invalid Product ID format for cart item: ${item.productId}`
          );
          return NextResponse.json(
            {
              success: false,
              message: `Invalid Product ID format for item ${item.productId}.`,
            },
            { status: 400 }
          );
        }
        const product = await Product.findById(item.productId);
        if (!product) {
          console.error(
            `Product with ID ${item.productId} not found during order creation.`
          );
          return NextResponse.json(
            {
              success: false,
              message: `Product with ID ${item.productId} not found.`,
            },
            { status: 404 }
          );
        }
        if (product.stock < item.quantity) {
          return NextResponse.json(
            {
              success: false,
              message: `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}.`,
            },
            { status: 400 }
          );
        }

        finalOrderItems.push({
          productId: product._id,
          name: product.name,
          imageUrl: product.images?.[0] || "/images/placeholder-product.jpg",
          price: product.price,
          quantity: item.quantity,
        });
        await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
        productIdsToClearFromCart.push(item.productId);
      } else {
        console.error("Invalid item structure in cartItems payload:", item);
        return NextResponse.json(
          {
            success: false,
            message: "Invalid item structure in cartItems payload.",
          },
          { status: 400 }
        );
      }
    }

    if (finalOrderItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid items to create an order." },
        { status: 400 }
      );
    }

    let orderPaymentStatus: PaymentStatus = "pending";
    let isOrderPaid = false;
    let paidAt: Date | undefined;
    let paymentResult: any = {};

    if (paymentMethod === "card") {
        if (totalPrice > 0 && paymentDetails?.cardNumber && paymentDetails.cardNumber.startsWith("4")) {
            orderPaymentStatus = "paid";
            isOrderPaid = true;
            paidAt = new Date();
            paymentResult = {
                id: `mock_txn_${Date.now()}`,
                status: "COMPLETED",
                update_time: new Date().toISOString(),
                email_address: user.email,
            };
        } else if (totalPrice > 0 && paymentDetails?.cardNumber && paymentDetails.cardNumber.startsWith("5")) {
            orderPaymentStatus = "failed";
            isOrderPaid = false;
            paymentResult = {
                id: `mock_txn_failed_${Date.now()}`,
                status: "FAILED",
                error_code: "MOCK_DECLINED",
                error_message: "Simulated card decline.",
            };
            return NextResponse.json(
                { success: false, message: "Payment failed. Please try again with a different card." },
                { status: 402 }
            );
        } else if (totalPrice === 0) {
             orderPaymentStatus = "paid";
             isOrderPaid = true;
             paidAt = new Date();
             paymentResult = {
                id: `mock_txn_free_${Date.now()}`,
                status: "FREE_ORDER",
                message: "Order with zero total price."
            };
        }
        else {
            orderPaymentStatus = "pending";
            isOrderPaid = false;
            paymentResult = {
                id: `mock_txn_pending_${Date.now()}`,
                status: "PENDING",
                message: "Payment initiated, awaiting confirmation."
            };
        }
    } else {
        orderPaymentStatus = "pending";
        isOrderPaid = false;
    }

    const order = new Order({
      userId: user.id,
      items: finalOrderItems,
      shippingAddress: shippingAddress as IAddress,
      paymentMethod,
      totalPrice,
      shippingPrice,
      taxPrice,
      orderStatus: "pending",
      paymentStatus: orderPaymentStatus,
      isPaid: isOrderPaid,
      paidAt: paidAt,
      paymentResult: paymentResult,
      appliedDiscountCode: appliedCouponCode, 
    });

    const createdOrder = await order.save();

    if (appliedCouponCode && isOrderPaid) {
        const discount = await Discount.findOne({ code: appliedCouponCode.toUpperCase() });
        if (discount) {
            discount.uses = (discount.uses || 0) + 1;
            await discount.save();
            console.log(`Discount code ${appliedCouponCode} usesCount incremented.`);
        }
    }

    if (!isThemedBoxDirectPurchase && productIdsToClearFromCart.length > 0) {
      const userCart = await Cart.findOne({ user: user.id });
      if (userCart) {
        userCart.items.pull(
          ...userCart.items
            .filter((cartItem) =>
              productIdsToClearFromCart.includes(cartItem.productId.toString())
            )
            .map((item) => item._id)
        );
        await userCart.save();
      }
    }

    return NextResponse.json(
      { success: true, data: createdOrder },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Error creating order", error: error.message },
      { status: 500 }
    );
  }
}
