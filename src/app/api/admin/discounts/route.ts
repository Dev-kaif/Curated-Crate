// src/app/api/admin/discounts/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import Discount from "@/backend/models/Discount";

// GET all discounts and stats
export async function GET(req: NextRequest) {
    const authResult = await authenticateAndAuthorize(req, "admin");
    if (authResult.response) return authResult.response;

    await dbConnect();

    try {
        const discounts = await Discount.find({}).sort({ createdAt: -1 });

        // Calculate stats
        const activeCodes = await Discount.countDocuments({ 
            isActive: true, 
            $or: [
                { expiryDate: { $exists: false } }, 
                { expiryDate: { $gt: new Date() } }
            ] 
        });
        const totalUsesResult = await Discount.aggregate([{ $group: { _id: null, total: { $sum: "$uses" } } }]);
        const totalUses = totalUsesResult.length > 0 ? totalUsesResult[0].total : 0;

        return NextResponse.json({
            success: true,
            data: discounts,
            stats: {
                activeCodes,
                totalUses,
                savingsGiven: 2456, // Placeholder - requires order tracking
                conversionRate: 12.5, // Placeholder - requires analytics
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Failed to fetch discounts", error: error.message }, { status: 500 });
    }
}

// POST a new discount
export async function POST(req: NextRequest) {
    const authResult = await authenticateAndAuthorize(req, "admin");
    if (authResult.response) return authResult.response;

    await dbConnect();

    try {
        const body = await req.json();
        const newDiscount = await Discount.create(body);
        return NextResponse.json({ success: true, data: newDiscount }, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: "Discount code must be unique." }, { status: 409 });
        }
        return NextResponse.json({ success: false, message: "Failed to create discount", error: error.message }, { status: 500 });
    }
}
