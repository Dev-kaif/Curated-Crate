// src/app/api/admin/customers/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import User from "@/backend/models/User";
import Order from "@/backend/models/Order";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search");

    const filter: any = { role: "user" };

    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const users = await User.find(filter).lean();

    // Aggregate order data for all fetched users
    const userIds = users.map((user) => user._id);
    const orderStats = await Order.aggregate([
      { $match: { userId: { $in: userIds } } },
      {
        $group: {
          _id: "$userId",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
        },
      },
    ]);

    const statsMap = new Map(
      orderStats.map((stat) => [stat._id.toString(), stat])
    );

    const customersData = users.map((user) => {
      const stats = statsMap.get(user._id.toString()) || {
        totalOrders: 0,
        totalSpent: 0,
      };
      let status = "Inactive";
      if (stats.totalOrders > 0) status = "Active";
      if (stats.totalSpent > 1000) status = "VIP"; 

      return {
        id: user._id.toString(),
        name:
          user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email,
        phone: user.phone || "N/A",
        signUpDate: user.createdAt,
        totalOrders: stats.totalOrders,
        totalSpent: stats.totalSpent,
        status: status,
      };
    });

    const totalCustomerCount = await User.countDocuments({ role: "user" });

    return NextResponse.json({
      success: true,
      data: customersData,
      totalCustomers: totalCustomerCount,
    });
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch customers.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
