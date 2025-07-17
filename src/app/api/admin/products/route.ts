// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import Product from "@/backend/models/Product";

export async function GET(req: NextRequest) {
  // Ensure the user is an authenticated admin
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const searchQuery = searchParams.get("search");
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (searchQuery) {
      filter.name = { $regex: searchQuery, $options: 'i' };
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    // Translate status filter into a database query
    if (status && status !== 'all') {
        switch (status) {
            case 'Active':
                filter.stock = { $gt: 10 };
                filter.isActive = true;
                break;
            case 'Low Stock':
                filter.stock = { $gt: 0, $lte: 10 };
                filter.isActive = true;
                break;
            case 'Out of Stock':
                filter.stock = 0;
                filter.isActive = true;
                break;
            case 'Inactive':
                filter.isActive = false;
                break;
        }
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
      },
    });
  } catch (error: any) {
    console.error("Error fetching products for admin:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}


// Handler for creating a new product (Admin only)
export async function POST(req: NextRequest) {
  const authResult = await authenticateAndAuthorize(req, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();
  try {
    const body = await req.json();
    const newProduct = await Product.create(body);
    // Return a standardized success response
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    // Return a standardized error response
    return NextResponse.json(
      { success: false, message: "Error creating product", error: error.message },
      { status: 500 }
    );
  }
}

