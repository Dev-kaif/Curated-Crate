// src/app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import Order from "@/backend/models/Order";
import User from "@/backend/models/User";
import Product from "@/backend/models/Product";
import mongoose from "mongoose";

// Helper to get date range based on query param
const getDateRange = (
  range: string,
  startDateStr?: string,
  endDateStr?: string
) => {
  const endDate = endDateStr ? new Date(endDateStr) : new Date();
  let startDate;

  switch (range) {
    case "7days":
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "30days":
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
      break;
    case "90days":
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 90);
      break;
    case "custom":
      startDate = startDateStr ? new Date(startDateStr) : new Date(0);
      break;
    default:
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 30); // Default to 30 days
      break;
  }
  return { startDate, endDate };
};

export async function GET(req: NextRequest) {
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) return authResult.response;

  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get("reportType") || "sales";
    const dateRange = searchParams.get("dateRange") || "30days";
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const { startDate, endDate } = getDateRange(
      dateRange,
      startDateParam || undefined,
      endDateParam || undefined
    );

    let reportData: any = {};

    if (reportType === "sales") {
      const salesStats = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalPrice" },
            totalOrders: { $sum: 1 },
          },
        },
      ]);

      const stats = salesStats[0] || { totalSales: 0, totalOrders: 0 };
      reportData = {
        totalSales: stats.totalSales,
        totalOrders: stats.totalOrders,
        averageOrderValue:
          stats.totalOrders > 0 ? stats.totalSales / stats.totalOrders : 0,
        period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      };
    } else if (reportType === "products") {
      const performance = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            unitsSold: { $sum: "$items.quantity" },
            revenue: {
              $sum: { $multiply: ["$items.price", "$items.quantity"] },
            },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 20 }, // Limit to top 20 products
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            id: "$_id",
            name: "$productDetails.name",
            unitsSold: "$unitsSold",
            revenue: "$revenue",
            _id: 0,
          },
        },
      ]);
      reportData = performance;
    } else if (reportType === "customers") {
      const newCustomers = await User.countDocuments({
        role: "user",
        createdAt: { $gte: startDate, $lte: endDate },
      });

      const returningCustomersResult = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: "$userId", orderCount: { $sum: 1 } } },
        { $match: { orderCount: { $gt: 1 } } },
        { $count: "count" },
      ]);
      const returningCustomers =
        returningCustomersResult.length > 0
          ? returningCustomersResult[0].count
          : 0;

      const clvResult = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: "$userId", totalSpent: { $sum: "$totalPrice" } } },
        { $group: { _id: null, avgCLV: { $avg: "$totalSpent" } } },
      ]);
      const averageCLV = clvResult.length > 0 ? clvResult[0].avgCLV : 0;

      reportData = {
        newCustomers,
        returningCustomers,
        averageCLV,
      };
    }

    return NextResponse.json({ success: true, data: reportData });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate report",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
