import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import ThemedBox from "@/backend/models/ThemedBox";

// Handler for fetching a single themed box by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const themedBox = await ThemedBox.findById(params.id).populate("products");
    if (!themedBox) {
      return NextResponse.json(
        { message: "Themed box not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(themedBox);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching themed box", error },
      { status: 500 }
    );
  }
}


