import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import ThemedBox from "@/backend/models/ThemedBox";
import { authenticateAndAuthorize } from "@/backend/lib/auth";

// Handler for creating a new themed box (Admin only)
export async function POST(req: NextRequest) {
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();
  try {
    const body = await req.json();
    const newThemedBox = await ThemedBox.create(body);
    return NextResponse.json(newThemedBox, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating themed box", error },
      { status: 500 }
    );
  }
}

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
