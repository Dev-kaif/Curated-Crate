import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { AuthenticatedUser } from "@/types";
import { JWT_SECRET } from "./config";

if (!JWT_SECRET) {
  throw new Error(
    "Please define the NEXTAUTH_SECRET environment variable inside .env.local"
  );
}

export async function authenticateAndAuthorize(
  request: NextRequest,
  requiredRole: "admin" | "user" | null = null
): Promise<{ user?: AuthenticatedUser; response?: NextResponse }> {
  const token = await getToken({ req: request, secret: JWT_SECRET });

  if (!token) {
    return {
      response: NextResponse.json(
        { success: false, message: "Not authenticated. Please log in." },
        { status: 401 }
      ),
    };
  }

  const user: AuthenticatedUser = {
    id: token.sub as string,
    email: token.email as string,
    name: token.name as string | undefined,
    role: (token.role || "user") as "user" | "admin",
  };

  // Check Role (Authorization)
  if (requiredRole && user.role !== requiredRole) {
    return {
      response: NextResponse.json(
        {
          success: false,
          message: `Forbidden. Requires "${requiredRole}" role.`,
        },
        { status: 403 }
      ),
    };
  }

  return { user };
}
