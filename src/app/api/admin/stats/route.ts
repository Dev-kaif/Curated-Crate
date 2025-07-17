// src/app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import Product from "@/backend/models/Product";
import Order from "@/backend/models/Order";
import User from "@/backend/models/User";

export async function GET(req: NextRequest) {
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();

  try {
    // --- Aggregate Metrics ---

    // 1. Total Revenue from delivered orders
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: "delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // 2. Total number of all orders
    const totalOrders = await Order.countDocuments();

    // 3. Total number of customers (users with 'user' role)
    const totalCustomers = await User.countDocuments({ role: "user" });

    // 4. Count of products with low stock (e.g., stock <= 10)
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 10 } });

    // --- Recent Orders ---
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "userId",
        model: User,
        select: "name", // Select only the user's name
      });

    // Format recent orders to match frontend expectations
    const formattedRecentOrders = recentOrders.map((order: any) => ({
      id: order._id.toString(),
      customer: order.userId?.name || "N/A",
      status: order.orderStatus,
      total: order.totalPrice,
    }));

    // --- Sales Data for the last 7 days ---
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format sales data for the chart
    const formattedSalesData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const sale = salesData.find((s) => s._id === dayStr);
      return { day: dayName, sales: sale ? sale.totalSales : 0 };
    }).reverse();

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        lowStockCount,
        recentOrders: formattedRecentOrders,
        salesData: formattedSalesData,
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
