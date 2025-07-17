import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import ThemedBox from "@/backend/models/ThemedBox";
import { authenticateAndAuthorize } from "@/backend/lib/auth";

// Handler for fetching all themed boxes (Publicly accessible)
export async function GET() {
  await dbConnect();
  try {
    const themedBoxes = await ThemedBox.find({ isActive: true }).populate(
      "products"
    );
    return NextResponse.json(themedBoxes);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching themed boxes", error },
      { status: 500 }
    );
  }
}
