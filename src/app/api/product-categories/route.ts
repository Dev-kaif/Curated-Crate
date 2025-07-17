/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Product from "@/backend/models/Product";

export async function GET() {
  await dbConnect();

  try {
    const categories: string[] = await Product.distinct("category");
    const sortedCategories = categories.sort((a, b) => a.localeCompare(b));

    return NextResponse.json(
      { success: true, data: sortedCategories },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching product categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product categories.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
