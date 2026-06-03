import { NextRequest, NextResponse } from "next/server";
import { getUsers, getBusinesses } from "@/lib/db";
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

    const users = await getUsers();
    const businesses = await getBusinesses();

    const owners = users.map((user) => {
      const ownerBusinesses = businesses.filter(
        (business) => business.ownerId === user.id
      );

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role || "owner",
        createdAt: user.createdAt || "",
        totalBusinesses: ownerBusinesses.length,
        approvedBusinesses: ownerBusinesses.filter(
          (business) => business.status === "approved" || business.verified
        ).length,
        pendingBusinesses: ownerBusinesses.filter(
          (business) => business.status === "pending" || !business.status
        ).length,
        rejectedBusinesses: ownerBusinesses.filter(
          (business) => business.status === "rejected"
        ).length,
      };
    });

    return NextResponse.json({ owners }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to load owners" },
      { status: 500 }
    );
  }
}