/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/users/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import User, { UserDocument } from "@/backend/models/User"; // Import UserDocument
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
    // Include oldPassword in the body type for comparison
    const body: Partial<IUser> & { password?: string; oldPassword?: string } =
      await request.json();

    const { email, role, oldPassword, password, ...updatePayload } = body; // Destructure oldPassword and new password

    const user = (await User.findById(authenticatedUser.id).select(
      "+password"
    )) as UserDocument | null;

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
    if (updatePayload.profilePicture !== undefined)
      user.profilePicture = updatePayload.profilePicture;

    // Handle password update
    if (password) {
      // If a new password is provided
      if (!oldPassword) {
        return NextResponse.json(
          {
            success: false,
            message: "Current password is required to update password.",
          },
          { status: 400 }
        );
      }

      // Compare oldPassword with the stored hashed password
      const isMatch = await bcrypt.compare(oldPassword, user.password || ""); // user.password might be undefined if not selected
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: "Current password does not match." },
          { status: 401 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          {
            success: false,
            message: "New password must be at least 6 characters long.",
          },
          { status: 400 }
        );
      }
      user.password = await bcrypt.hash(password, 10); // Hash the new password
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
        // Ensure new addresses get an ID (if not already assigned by frontend)
        if (!addr._id) {
          addr._id = new mongoose.Types.ObjectId();
        }
      }
      // If no address is marked as default, make the first one default (if any exist)
      if (!defaultFound && updatePayload.addresses.length > 0) {
        updatePayload.addresses[0].isDefault = true;
      }
      user.addresses = updatePayload.addresses as any; 
    }

    // Save the updated user document
    const updatedUser = await user.save();

    // Convert to plain object and remove password before sending response
    const userObject = updatedUser.toObject();
    delete userObject.password;

    return NextResponse.json(
      { success: true, data: userObject },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Email already in use by another account." },
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
        message: "Failed to update user profile.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
