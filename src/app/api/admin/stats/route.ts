import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import Product from "@/backend/models/Product";
import Order from "@/backend/models/Order";
import User from "@/backend/models/User";
import ThemedBox from "@/backend/models/ThemedBox";

export async function GET(req: NextRequest) {
  // Secure this endpoint, only admins can access stats
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();

  try {
    // Calculate total revenue from completed orders
    const totalRevenueResult = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue =
      totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

    // Count total number of orders
    const totalOrders = await Order.countDocuments();

    // Count total number of customers (users with 'user' role)
    const totalCustomers = await User.countDocuments({ role: "user" });

    // Count total number of individual products
    const totalProducts = await Product.countDocuments();

    // Count total number of themed boxes
    const totalThemedBoxes = await ThemedBox.countDocuments();

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        totalThemedBoxes,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching admin statistics.",
      },
      { status: 500 }
    );
  }
}
