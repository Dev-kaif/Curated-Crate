import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import ThemedBox from "@/backend/models/ThemedBox";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();
  try {
    const body = await req.json();

    // Add validation to ensure products array is not empty
    if (!body.products || body.products.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "A themed box must contain at least one product.",
        },
        { status: 400 }
      );
    }

    const updatedThemedBox = await ThemedBox.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).populate("products");

    if (!updatedThemedBox) {
      return NextResponse.json(
        { success: false, message: "Themed box not found" },
        { status: 404 }
      );
    }
    // Return a standardized success response
    return NextResponse.json({ success: true, data: updatedThemedBox });
  } catch (error: any) {
    // Return a standardized error response
    return NextResponse.json(
      {
        success: false,
        message: "Error updating themed box",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Handler for deleting a themed box (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }
    const deletedThemedBox = await ThemedBox.findByIdAndDelete(params.id);
    if (!deletedThemedBox) {
      return NextResponse.json(
        { success: false, message: "Themed box not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Themed box deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting themed box",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
