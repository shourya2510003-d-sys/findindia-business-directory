import { NextRequest, NextResponse } from "next/server";
import {
  createAdminToken,
  validateAdminCredentials,
} from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const isValidAdmin = validateAdminCredentials(email, password);

    if (!isValidAdmin) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    const token = createAdminToken(email);

    return NextResponse.json(
      {
        message: "Admin login successful",
        token,
        admin: {
          email,
          role: "admin",
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Admin login failed" },
      { status: 500 }
    );
  }
}