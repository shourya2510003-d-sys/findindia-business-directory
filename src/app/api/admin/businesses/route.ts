import { NextRequest, NextResponse } from "next/server";
import { getBusinesses } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const admin = requireAdmin(req);

    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 401 }
      );
    }

    const businesses = await getBusinesses();

    return NextResponse.json(
      {
        businesses,
        total: businesses.length,
        pending: businesses.filter((b) => b.status === "pending" || !b.status)
          .length,
        approved: businesses.filter((b) => b.status === "approved" || b.verified)
          .length,
        rejected: businesses.filter((b) => b.status === "rejected").length,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to load admin businesses" },
      { status: 500 }
    );
  }
}