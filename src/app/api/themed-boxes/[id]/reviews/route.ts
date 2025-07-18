// src/app/api/themed-boxes/[id]/reviews/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import ThemedBox from "@/backend/models/ThemedBox"; // Import ThemedBox model
import Review from "@/backend/models/Review"; // Import Review model
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import mongoose from "mongoose";

// GET handler to fetch reviews for a specific themed box
export async function GET(request: NextRequest, context: any) {
  await dbConnect();
  const { id } = context.params; // Themed Box ID

  const themedBoxId = id;

  if (!mongoose.Types.ObjectId.isValid(themedBoxId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Themed Box ID format." },
      { status: 400 }
    );
  }

  try {
    const themedBoxExists = await ThemedBox.findById(themedBoxId);
    if (!themedBoxExists) {
      return NextResponse.json(
        { success: false, message: "Themed Box not found." },
        { status: 404 }
      );
    }

    // Find reviews for the specific themed box ID
    const reviews = await Review.find({
      themedBoxId: new mongoose.Types.ObjectId(themedBoxId),
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching themed box reviews:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch themed box reviews.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST handler to add a new review for a specific themed box
export async function POST(request: NextRequest, context: any) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) {
    return authResult.response;
  }
  const authenticatedUser = authResult.user!;

  await dbConnect();
  const { id } = context.params; // Themed Box ID
  const themedBoxId = id;

  if (!mongoose.Types.ObjectId.isValid(themedBoxId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Themed Box ID format." },
      { status: 400 }
    );
  }

  try {
    const themedBoxExists = await ThemedBox.findById(themedBoxId);
    if (!themedBoxExists) {
      return NextResponse.json(
        { success: false, message: "Themed Box not found." },
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

    // Check if user has already reviewed this themed box (based on unique index in model)
    const existingReview = await Review.findOne({
      themedBoxId: new mongoose.Types.ObjectId(themedBoxId),
      userId: new mongoose.Types.ObjectId(authenticatedUser.id),
    });
    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already reviewed this themed box.",
        },
        { status: 409 } // Conflict
      );
    }

    const review = await Review.create({
      themedBoxId: new mongoose.Types.ObjectId(themedBoxId),
      userId: new mongoose.Types.ObjectId(authenticatedUser.id),
      userName: authenticatedUser.name || authenticatedUser.email,
      rating,
      comment,
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    console.error("Error adding themed box review:", error);
    if (error.code === 11000) {
      // Duplicate key error from unique index
      return NextResponse.json(
        {
          success: false,
          message: "You have already reviewed this themed box.",
        },
        { status: 409 }
      );
    }
    if (error.name === "ValidationError") {
      // Mongoose validation error (e.g., from custom validator)
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add themed box review.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
