// src/app/api/admin/themed-boxes/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import ThemedBox from "@/backend/models/ThemedBox";

export async function GET(req: NextRequest) {
  // Ensure the user is an authenticated admin
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search");

    const filter: any = {};

    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Fetch all themed boxes matching the filter
    const themedBoxes = await ThemedBox.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: themedBoxes,
    });
  } catch (error: any) {
    console.error("Error fetching themed boxes for admin:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch themed boxes.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();
  try {
    const body = await req.json();
    const newThemedBox = await ThemedBox.create(body);
    // Return a standardized success response
    return NextResponse.json({ success: true, data: newThemedBox }, { status: 201 });
  } catch (error: any) {
    // Return a standardized error response
    return NextResponse.json(
      { success: false, message: "Error creating themed box", error: error.message },
      { status: 500 }
    );
  }
}