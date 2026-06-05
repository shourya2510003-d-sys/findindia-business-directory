import { NextRequest, NextResponse } from "next/server";

import {
  createToken,
  publicUser,
  verifyPassword,
} from "@/lib/auth";

import { getUsers } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
        },
        {
          status: 400,
        }
      );
    }

    const users = getUsers();

    const user = users.find(
      (item) =>
        item.email &&
        item.email.toLowerCase() === email
    );

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

   const savedPasswordHash =
  user.passwordHash ?? "";
    if (!savedPasswordHash) {
      return NextResponse.json(
        {
          error:
            "Password record not found. Please register again.",
        },
        {
          status: 401,
        }
      );
    }

    const isPasswordCorrect = verifyPassword(
      password,
      savedPasswordHash
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    const safeUser = publicUser(user);

    const token = createToken(safeUser);

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: safeUser,
        token,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    return NextResponse.json(
      {
        error: "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}