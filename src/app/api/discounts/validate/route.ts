/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Discount from "@/backend/models/Discount";
import { authenticateAndAuthorize } from "@/backend/lib/auth";

export async function POST(request: NextRequest) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;

  await dbConnect();

  try {
    const { code, cartSubtotal }: { code: string; cartSubtotal: number } =
      await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Discount code is required." },
        { status: 400 }
      );
    }
    if (typeof cartSubtotal !== "number" || cartSubtotal < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid cart subtotal provided." },
        { status: 400 }
      );
    }

    const discount = await Discount.findOne({ code: code.toUpperCase() });

    if (!discount || !discount.isActive) {
      return NextResponse.json(
        { success: false, message: "Invalid or inactive discount code." },
        { status: 404 }
      );
    }

    // Check expiry date
    if (discount.expiryDate && new Date() > new Date(discount.expiryDate)) {
      return NextResponse.json(
        { success: false, message: "Discount code has expired." },
        { status: 400 }
      );
    }

    if (discount.maxUses !== undefined && discount.uses >= discount.maxUses) {
      return NextResponse.json(
        {
          success: false,
          message: "Discount code has reached its maximum usage.",
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (discount.type === "percentage") {
      discountAmount = (cartSubtotal * discount.value) / 100;
    } else if (discount.type === "fixed") {
      discountAmount = discount.value;
    }

    discountAmount = Math.min(discountAmount, cartSubtotal);

    return NextResponse.json(
      {
        success: true,
        message: "Discount applied successfully!",
        data: {
          code: discount.code,
          type: discount.type,
          value: discount.value,
          discountAmount: parseFloat(discountAmount.toFixed(2)),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error validating discount code:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to validate discount code.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
