import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import ThemedBox from "@/backend/models/ThemedBox";
import { authenticateAndAuthorize } from "@/backend/lib/auth";

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

// Handler for updating a themed box (Admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // CORRECTED: Using the exact authorization logic from your auth.ts file
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) {
    return authResult.response; // Return the unauthorized/forbidden response if it exists
  }

  await dbConnect();
  try {
    const body = await req.json();
    const updatedThemedBox = await ThemedBox.findByIdAndUpdate(
      params.id,
      body,
      {
        new: true,
      }
    );
    if (!updatedThemedBox) {
      return NextResponse.json(
        { message: "Themed box not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedThemedBox);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating themed box", error },
      { status: 500 }
    );
  }
}

// Handler for deleting a themed box (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // CORRECTED: Using the exact authorization logic from your auth.ts file
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) {
    return authResult.response; // Return the unauthorized/forbidden response if it exists
  }

  await dbConnect();
  try {
    const deletedThemedBox = await ThemedBox.findByIdAndDelete(params.id);
    if (!deletedThemedBox) {
      return NextResponse.json(
        { message: "Themed box not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Themed box deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting themed box", error },
      { status: 500 }
    );
  }
}
