import { NextRequest, NextResponse } from "next/server";
import { getBusinesses } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const q = String(searchParams.get("q") || "").toLowerCase().trim();
    const loc = String(searchParams.get("loc") || "").toLowerCase().trim();

    const businesses = await getBusinesses();

    const approvedBusinesses = businesses.filter(
      (business) =>
        business.status === "approved" || business.verified === true
    );

    const filtered = approvedBusinesses.filter((business) => {
      const text = [
        business.businessName,
        business.category,
        business.description,
        business.city,
        business.state,
        business.address,
        ...(business.services || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = q ? text.includes(q) : true;

      const matchesLocation = loc
        ? `${business.city} ${business.state} ${business.address}`
            .toLowerCase()
            .includes(loc)
        : true;

      return matchesQuery && matchesLocation;
    });

    const items = filtered.map((business) => ({
      name: business.businessName,
      category: business.category,
      rating: 4.5,
      reviews: business.views || 0,
      address: `${business.address}, ${business.city}, ${business.state}`,
      phone: business.phone,
      timings: business.openingHours || "9 AM - 9 PM",
      distance: "Nearby",
      verified: business.verified,
    }));

    return NextResponse.json(
      {
        sq: q,
        loc,
        err: false,
        items,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        sq: "",
        loc: "",
        err: true,
        items: [],
      },
      { status: 200 }
    );
  }
}