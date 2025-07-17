/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/users/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import User from "@/backend/models/User";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import { IAddress, IUser } from "@/types";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();

  try {
    const user = await User.findById(authenticatedUser.id).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user profile.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!;

  await dbConnect();

  try {
    const body: Partial<IUser> & { password?: string } = await request.json();

    // Omit email and role from direct updates
    const { email, role, ...updatePayload } = body;

    const user = await User.findById(authenticatedUser.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Handle general profile updates
    if (updatePayload.name !== undefined) user.name = updatePayload.name;
    if (updatePayload.firstName !== undefined)
      user.firstName = updatePayload.firstName;
    if (updatePayload.lastName !== undefined)
      user.lastName = updatePayload.lastName;
    if (updatePayload.phone !== undefined) user.phone = updatePayload.phone;

    // Handle password update
    if (updatePayload.password) {
      if (updatePayload.password.length < 6) {
        return NextResponse.json(
          {
            success: false,
            message: "Password must be at least 6 characters long.",
          },
          { status: 400 }
        );
      }
      user.password = await bcrypt.hash(updatePayload.password, 10);
    }

    // Handle address updates
    if (updatePayload.addresses) {
      // Ensure only one address is default
      let defaultFound = false;
      for (const addr of updatePayload.addresses) {
        if (addr.isDefault) {
          if (defaultFound) {
            addr.isDefault = false; // Enforce only one default
          }
          defaultFound = true;
        }
        // Ensure new addresses get an ID
        if (!addr._id) {
          addr._id = new mongoose.Types.ObjectId();
        }
      }
      // If no address is marked as default, make the first one default
      if (!defaultFound && updatePayload.addresses.length > 0) {
        updatePayload.addresses[0].isDefault = true;
      }
      user.addresses = updatePayload.addresses as any;
    }

    const updatedUser = await user.save();

    const userObject = updatedUser.toObject();
    delete userObject.password;

    return NextResponse.json(
      { success: true, data: userObject },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user profile.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
