import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const categories = [
  "Restaurant",
  "Hotel",
  "Doctor",
  "Packers & Movers",
  "Repair & Service",
  "Real Estate",
  "Education",
  "Beauty & Spa",
  "B2B Supplier",
  "Other",
];

export async function GET() {
  return NextResponse.json(
    {
      categories: categories.map((name) => ({
        id: name.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and"),
        name,
      })),
    },
    { status: 200 }
  );
}