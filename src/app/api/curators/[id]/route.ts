/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { ITeamMember } from "@/types"; // Ensure correct path to your ITeamMember
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import TeamMember from "@/backend/models/TeamMember"; // Import your TeamMember model
import { authenticateAndAuthorize } from "@/backend/lib/auth"; // Assuming you have this middleware

export async function GET(request: NextRequest, context: any) {
  await dbConnect();
  const { id } = await context.params; 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid Team Member ID format." },
      { status: 400 }
    );
  }

  try {
    const teamMemberFromDb = await TeamMember.findById(id);
    if (!teamMemberFromDb) {
      return NextResponse.json(
        { success: false, message: "Team Member not found." },
        { status: 404 }
      );
    }

    const plainTeamMember = teamMemberFromDb.toObject({
      getters: true,
      virtuals: true,
    });
    const teamMember: ITeamMember = {
      ...plainTeamMember,
      _id: plainTeamMember._id.toString(), // Ensure _id is string
      createdAt: plainTeamMember.createdAt
        ? new Date(plainTeamMember.createdAt).toISOString()
        : undefined,
      updatedAt: plainTeamMember.updatedAt
        ? new Date(plainTeamMember.updatedAt).toISOString()
        : undefined,
    };

    return NextResponse.json(
      { success: true, data: teamMember },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching team member by ID:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch team member.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: any) {
  const authResult = await authenticateAndAuthorize(request, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();
  const { id } = await context.params; 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid Team Member ID format." },
      { status: 400 }
    );
  }

  try {
    const body: Partial<ITeamMember> = await request.json(); // Use Partial for updates

    // Build the update object dynamically to only include provided fields
    const updateFields: Partial<ITeamMember> = {};

    if (body.name !== undefined) updateFields.name = body.name;
    if (body.title !== undefined) updateFields.title = body.title;
    if (body.description !== undefined)
      updateFields.description = body.description;
    if (body.experience !== undefined)
      updateFields.experience = body.experience;
    if (body.imageUrl !== undefined) updateFields.imageUrl = body.imageUrl;

    // Handle nested contact object update
    if (body.contact !== undefined) {
      if (typeof body.contact !== "object" || body.contact === null) {
        return NextResponse.json(
          { success: false, message: "Invalid contact information format." },
          { status: 400 }
        );
      }
      // Assuming contact object will be sent as a whole or merged by Mongoose
      updateFields.contact = {
        ...(updateFields.contact || {}),
        ...body.contact,
      };

      // Handle nested social object update within contact
      if (body.contact.social !== undefined) {
        if (
          typeof body.contact.social !== "object" ||
          body.contact.social === null
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid social media information format.",
            },
            { status: 400 }
          );
        }
        // Ensure contact.social is correctly merged or set
        updateFields.contact = {
          ...(updateFields.contact || {}),
          social: {
            ...(updateFields.contact?.social || {}),
            ...body.contact.social,
          },
        };
      }
    }

    // Mongoose automatically updates `updatedAt` with `timestamps: true`

    const updatedTeamMember = await TeamMember.findByIdAndUpdate(
      id,
      updateFields, // Use the dynamically built update object
      { new: true, runValidators: true } // `new: true` returns the updated document
    );

    if (!updatedTeamMember) {
      return NextResponse.json(
        { success: false, message: "Team Member not found for update." },
        { status: 404 }
      );
    }

    // Convert updated Mongoose document to ITeamMember for consistent response
    const plainUpdatedTeamMember = updatedTeamMember.toObject({
      getters: true,
      virtuals: true,
    });
    const finalUpdatedTeamMember: ITeamMember = {
      ...plainUpdatedTeamMember,
      _id: plainUpdatedTeamMember._id.toString(),
      createdAt: plainUpdatedTeamMember.createdAt
        ? new Date(plainUpdatedTeamMember.createdAt).toISOString()
        : undefined,
      updatedAt: plainUpdatedTeamMember.updatedAt
        ? new Date(plainUpdatedTeamMember.updatedAt).toISOString()
        : undefined,
    };

    return NextResponse.json(
      { success: true, data: finalUpdatedTeamMember },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating team member:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update team member.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const authResult = await authenticateAndAuthorize(request, "admin");
  if (authResult.response) {
    return authResult.response;
  }

  await dbConnect();
  const { id } = await context.params; 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid Team Member ID format." },
      { status: 400 }
    );
  }

  try {
    const deletedTeamMember = await TeamMember.findByIdAndDelete(id);
    if (!deletedTeamMember) {
      return NextResponse.json(
        { success: false, message: "Team Member not found for deletion." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete team member.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
