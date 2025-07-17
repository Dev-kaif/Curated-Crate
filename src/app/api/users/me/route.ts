/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/users/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import User from "@/backend/models/User";
import { authenticateAndAuthorize } from "@/backend/lib/auth";
import { IUser } from "@/types"; // Ensure IAddress and IUser are correctly imported

export async function GET(request: NextRequest) {
  const authResult = await authenticateAndAuthorize(request);
  if (authResult.response) return authResult.response;
  const authenticatedUser = authResult.user!; // The authenticated user object from middleware

  await dbConnect();

  try {
    // Fetch the user by their authenticated ID, excluding the password field
    const user = await User.findById(authenticatedUser.id).select("-password");

    // If no user is found, return a 404 response
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Return the user data
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
  const authenticatedUser = authResult.user!; // The authenticated user object from middleware

  await dbConnect();

  try {
    // Define the expected shape of the request body for updates
    const body: Partial<Omit<IUser, "role">> & { password?: string } = await request.json(); 
      
    const {
      email,
      name,
      firstName,
      lastName,
      phone,
      profilePicture,
      addresses,
      password,
    } = body;

    // Create an object to hold only the fields that are actually provided in the request
    const updateData: Partial<IUser & { password?: string }> = {};

    // Conditionally add fields to updateData if they are provided in the request body
    if (email !== undefined) updateData.email = email;
    if (name !== undefined) updateData.name = name;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (profilePicture !== undefined)
      updateData.profilePicture = profilePicture;
    if (password !== undefined) {
      if (password.length < 6) {
        return NextResponse.json(
          {
            success: false,
            message: "Password must be at least 6 characters long.",
          },
          { status: 400 }
        );
      }
      updateData.password = password; // Placeholder: Replace with hashed password
    }

    // Handle addresses array updates with default logic
    if (addresses !== undefined) {
      let hasDefault = false;
      // Validate each address and enforce only one default address
      for (let i = 0; i < addresses.length; i++) {
        const addr = addresses[i];
        if (!addr.street || !addr.city || !addr.zipCode || !addr.country) {
          return NextResponse.json(
            {
              success: false,
              message: `Incomplete address details provided for address at index ${i}.`,
            },
            { status: 400 }
          );
        }
        if (addr.isDefault) {
          if (hasDefault) {
            addresses[i].isDefault = false;
          } else {
            hasDefault = true;
          }
        }
      }
      updateData.addresses = addresses;
    }

    // If no fields are provided for update, return a 400 response
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid update data provided." },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      authenticatedUser.id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true, select: "-password" }
    );

    // If no user is found for update, return a 404 response
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found for update." },
        { status: 404 }
      );
    }

    // Return the updated user data
    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    if (error.code === 11000) {
      // Handle duplicate key error (e.g., if email already exists)
      return NextResponse.json(
        { success: false, message: "Email already in use by another account." },
        { status: 409 }
      );
    }
    if (error.name === "ValidationError") {
      // Handle Mongoose validation errors
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
