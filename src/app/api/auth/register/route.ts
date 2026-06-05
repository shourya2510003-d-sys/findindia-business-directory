import { NextResponse } from "next/server";
import crypto from "crypto";

import { createToken, hashPassword, publicUser } from "@/lib/auth";
import { getUsers, saveUsers } from "@/lib/db";

import type { OwnerUser } from "@/types/business";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const password = String(body.password ?? "");

    const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return NextResponse.json(
    {
      error: "Invalid email address",
    },
    { status: 400 }
  );
}

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
  return NextResponse.json(
    {
      error:
        "Password must be at least 8 characters",
    },
    { status: 400 }
  );
}

    const users = getUsers();

    const existingUser = users.find(
      (user) => user.email.toLowerCase() === email
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    const user: OwnerUser = {
      id: crypto.randomUUID(),

      name,
      email,
      phone,

      passwordHash: hashPassword(password),

      role: "owner",

      createdAt: now,
    };

    users.push(user);

    saveUsers(users);

    return NextResponse.json(
      {
        user: publicUser(user),
        token: createToken(publicUser(user)),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register API Error:", error);

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
