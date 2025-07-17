import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import Discount from "@/backend/models/Discount";
import mongoose from "mongoose";

// DELETE a discount
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) return authResult.response;

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid discount ID" },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const deletedDiscount = await Discount.findByIdAndDelete(id);
    if (!deletedDiscount) {
      return NextResponse.json(
        { success: false, message: "Discount not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Discount deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete discount",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
