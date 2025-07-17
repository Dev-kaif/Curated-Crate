/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Product from "@/backend/models/Product";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import Review from "@/backend/models/Review";
// import { IProduct } from "@/types";
// import { IReview } from '@/types';

import mongoose from "mongoose";

export async function GET(request: NextRequest, context: any) {
  
  await dbConnect();
  const { id } = await context.params; 

  const productId = id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Product ID format." },
      { status: 400 }
    );
  }

  try {
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    // Find reviews for the specific product ID
    const reviews = await Review.find({
      productId: new mongoose.Types.ObjectId(productId),
    }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reviews.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, context: any) {

  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) {
    return authResult.response;
  }
  const authenticatedUser = authResult.user!;

  await dbConnect();
  const { id } = await context.params; 
  const productId = id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Product ID format." },
      { status: 400 }
    );
  }

  try {
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    const body: { rating: number; comment?: string } = await request.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }
    // If you want to strictly require comments:
    // if (!comment || comment.trim().length === 0) {
    //   return NextResponse.json({ success: false, message: 'Comment cannot be empty.' }, { status: 400 });
    // }

    // Check if user has already reviewed this product (based on unique index in model)
    const existingReview = await Review.findOne({
      productId: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(authenticatedUser.id),
    });
    if (existingReview) {
      return NextResponse.json(
        { success: false, message: "You have already reviewed this product." },
        { status: 409 }
      );
    }

    const review = await Review.create({
      productId: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(authenticatedUser.id),
      userName: authenticatedUser.name || authenticatedUser.email,
      rating,
      comment,
    });
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    console.error("Error adding review:", error);
    if (error.code === 11000) {
      // Duplicate key error from unique index
      return NextResponse.json(
        { success: false, message: "You have already reviewed this product." },
        { status: 409 }
      );
    }
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add review.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
