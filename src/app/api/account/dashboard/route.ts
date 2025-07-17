// src/app/api/account/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import Order from "@/backend/models/Order";

export async function GET(req: NextRequest) {
  const authResult = await authenticateAndAuthorize(req);
  if (authResult.response) {
    return authResult.response;
  }
  const user = authResult.user!;

  await dbConnect();

  try {
    const totalOrders = await Order.countDocuments({ userId: user.id });

    // Fetch the 3 most recent orders for the user
    const recentOrders = await Order.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(); 

    // Correctly type the order object within the map function
    const formattedRecentOrders = recentOrders.map((order) => ({
      id: order._id.toString(),
      date: new Date(order.createdAt as Date).toLocaleDateString(),
      total: order.totalPrice,
      status: order.orderStatus,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        recentOrders: formattedRecentOrders,
      },
    });
  } catch (error: any) {
    console.error("Error fetching account dashboard data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch dashboard data.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
