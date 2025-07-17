import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Product from "@/backend/models/Product";
import ThemedBox from "@/backend/models/ThemedBox";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { message: "Search query is required" },
        { status: 400 }
      );
    }

    // Create a regex for case-insensitive search
    const regex = new RegExp(query, "i");

    // Search for individual products
    const products = await Product.find({
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
        { category: { $regex: regex } },
      ],
    }).limit(10); // Limit results for performance

    // Search for themed boxes
    const themedBoxes = await ThemedBox.find({
      $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }],
    }).limit(5);

    return NextResponse.json({
      products,
      themedBoxes,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error performing search", error },
      { status: 500 }
    );
  }
}
