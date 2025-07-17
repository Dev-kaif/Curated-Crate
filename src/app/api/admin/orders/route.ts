// src/app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import Order from "@/backend/models/Order";
import User from "@/backend/models/User";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status");
    const searchQuery = searchParams.get("search");
    const skip = (page - 1) * limit;

    const filter: any = {};

    // Apply status filter if provided and not 'all'
    if (status && status !== "all") {
      filter.orderStatus = status;
    }

    // Apply search query filter for customer name or email
    if (searchQuery) {
      const userIds = await User.find({
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ],
      }).select("_id");

      const userFilter = userIds.map((user) => user._id);

      // Add search by Order ID (if it's a valid ObjectId)
      const orConditions: any[] = [{ userId: { $in: userFilter } }];
      if (mongoose.Types.ObjectId.isValid(searchQuery)) {
        orConditions.push({ _id: new mongoose.Types.ObjectId(searchQuery) });
      }
      filter.$or = orConditions;
    }

    // Fetch orders with filters, pagination, and populate user data
    const orders = await Order.find(filter)
      .populate({
        path: "userId",
        model: User,
        select: "name email",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
      },
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch orders.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
