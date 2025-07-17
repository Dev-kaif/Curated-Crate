/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import Review from "@/backend/models/Review";
import mongoose from "mongoose";

export async function DELETE(request: NextRequest, context: any) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) {
    return authResult.response;
  }
  const authenticatedUser = authResult.user!;

  await dbConnect();
  const { id } = await context.params; 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid Review ID format." },
      { status: 400 }
    );
  }

  try {
    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found." },
        { status: 404 }
      );
    }

    // Authorization check: Admin OR the owner of the review
    if (
      authenticatedUser.role !== "admin" &&
      review.userId.toString() !== authenticatedUser.id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden. You do not have permission to delete this review.",
        },
        { status: 403 }
      );
    }

    await Review.findByIdAndDelete(id);
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete review.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
