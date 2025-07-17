/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Order from "@/backend/models/Order";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import { OrderStatus, PaymentStatus } from "@/types";
import mongoose from "mongoose";

export async function GET(request: NextRequest, context: any) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();
  const { id } = await context.params; 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid Order ID format." },
      { status: 400 }
    );
  }

  try {
    const order = await Order.findById(id).populate("userId", "name email");

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    // Authorization: User can only see their own orders unless they are an admin
    if (
      authenticatedUser.role !== "admin" &&
      !order.userId.equals(authenticatedUser.id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden. You do not have permission to view this order.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching order by ID:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch order.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: any) {
  const authResult = await authenticateAndAuthorize(request, "admin");
  if (authResult.response) return authResult.response;

  await dbConnect();
  const { id } = await context.params; 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid Order ID format." },
      { status: 400 }
    );
  }

  try {
    const body: {
      orderStatus?: OrderStatus;
      paymentStatus?: PaymentStatus;
      isPaid?: boolean;
      paidAt?: Date;
      deliveredAt?: Date;
    } = await request.json();
    const { orderStatus, paymentStatus, isPaid, paidAt, deliveredAt } = body;

    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (isPaid !== undefined) updateData.isPaid = isPaid;
    if (paidAt) updateData.paidAt = paidAt;
    if (deliveredAt) updateData.deliveredAt = deliveredAt;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No update data provided." },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found for update." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedOrder },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating order:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ORDER CANCLEING 
export async function DELETE(request: NextRequest, context: any) {
  const authResult = await authenticateAndAuthorize(request); // Authenticate any logged-in user
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();
  const { id } = await context.params; 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid Order ID format." },
      { status: 400 }
    );
  }

  try {
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    // Authorization: User can "delete" (cancel) their own order, or admin can cancel any order
    if (
      authenticatedUser.role !== "admin" &&
      !order.userId.equals(authenticatedUser.id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden. You do not have permission to delete this order.",
        },
        { status: 403 }
      );
    }

    // Business Logic: Define statuses where "deletion" (cancellation) is allowed
    // 'pending' and 'processing' are common cancellable states
    const cancellableStatuses: OrderStatus[] = ['pending', 'processing'];

    if (!cancellableStatuses.includes(order.orderStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: `Order cannot be deleted as it is currently '${order.orderStatus}'. Only 'pending' or 'processing' orders can be deleted.`,
        },
        { status: 400 } // Bad Request
      );
    }

    // Update order status to 'cancelled' (logical deletion)
    order.orderStatus = 'cancelled';
    order.updatedAt = new Date(); // Update the updatedAt timestamp

    await order.save(); // Save the updated order document

    return NextResponse.json(
      { success: true, message: "Order deleted (cancelled) successfully.", data: order },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error deleting (cancelling) order:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete (cancel) order.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}