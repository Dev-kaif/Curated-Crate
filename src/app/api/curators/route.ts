import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/backend/lib/mongodb';
import Curator from '@/backend/models/Curator';
import { authenticateAndAuthorize } from '@/backend/lib/auth';

// Handler for creating a new curator (Admin only)
export async function POST(req: NextRequest) {
  // CORRECTED: Using the exact authorization logic from your auth.ts file
  const authResult = await authenticateAndAuthorize(req, 'admin');
  if (authResult.response) {
    return authResult.response; // Return the unauthorized/forbidden response if it exists
  }
  // If we reach here, authResult.user is available and the user is an admin.

  await dbConnect();
  try {
    const body = await req.json();
    const newCurator = await Curator.create(body);
    return NextResponse.json(newCurator, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating curator', error }, { status: 500 });
  }
}

// Handler for fetching all curators (Publicly accessible)
export async function GET() {
  await dbConnect();
  try {
    const curators = await Curator.find({ isActive: true });
    return NextResponse.json(curators);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching curators', error }, { status: 500 });
  }
}
