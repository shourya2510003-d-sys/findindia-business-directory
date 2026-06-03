import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getBusinesses, saveBusinesses } from "@/lib/db";
import type { Business } from "@/types/business";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = requireAdmin(req);

    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const businesses = await getBusinesses();

    const found = businesses.some((business) => business.id === id);

    if (!found) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const updatedBusinesses: Business[] = businesses.map((business) => {
      if (business.id !== id) return business;

      return {
        ...business,
        verified: true,
        status: "approved",
        rejectionReason: "",
        updatedAt: new Date().toISOString(),
      };
    });

    await saveBusinesses(updatedBusinesses);

    return NextResponse.json(
      { message: "Business approved successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Approval failed" },
      { status: 500 }
    );
  }
}