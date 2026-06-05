import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { getBearerToken, verifyToken } from "@/lib/auth";
import { getBusinesses, saveBusinesses } from "@/lib/db";
import type { Business } from "@/types/business";

function splitServices(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildSearchKeywords(
  businessName: string,
  category: string,
  city: string,
  state: string,
  services: string[]
): string[] {
  return [
    businessName,
    category,
    city,
    state,
    ...services,
  ]
    .map((item) => item.toLowerCase().trim())
    .filter(Boolean);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const mine = searchParams.get("mine");
    const admin = searchParams.get("admin");

    const businesses = await getBusinesses();

    // Owner Dashboard
    if (mine === "true") {
      const token = getBearerToken(req);

      if (!token) {
        return NextResponse.json(
          { error: "Login required" },
          { status: 401 }
        );
      }

      const user = verifyToken(token);

      if (!user) {
        return NextResponse.json(
          { error: "Invalid or expired session" },
          { status: 401 }
        );
      }

      const myBusinesses = businesses.filter(
        (business: Business) =>
          business.ownerId === user.id
      );

      return NextResponse.json(
        { businesses: myBusinesses },
        { status: 200 }
      );
    }

    // Admin Dashboard
    if (admin === "true") {
      const token = getBearerToken(req);

      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      const user = verifyToken(token);

      if (!user || user.role !== "admin") {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { businesses },
        { status: 200 }
      );
    }

    // Public Listings
    const approvedBusinesses = businesses.filter(
      (business: Business) =>
        business.status === "approved"
    );

    return NextResponse.json(
      { businesses: approvedBusinesses },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET businesses error:", error);

    return NextResponse.json(
      { error: "Failed to load businesses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return NextResponse.json(
        { error: "Login required" },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const businessName = String(
      body.businessName || ""
    )
      .trim()
      .replace(/\s+/g, " ");

    const category = String(
      body.category || ""
    ).trim();

    const description = String(
      body.description || ""
    ).trim();

    const address = String(
      body.address || ""
    ).trim();

    const city = String(
      body.city || ""
    ).trim();

    const state = String(
      body.state || ""
    ).trim();

    const pincode = String(
      body.pincode || ""
    ).trim();

    const phone = String(
      body.phone || ""
    ).trim();

    const whatsapp = String(
      body.whatsapp || phone
    ).trim();

    const email = String(
      body.email || user.email || ""
    ).trim();

    const website = String(
      body.website || ""
    ).trim();

    const openingHours = String(
      body.openingHours || "9 AM - 9 PM"
    ).trim();

    if (
      !businessName ||
      !category ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !phone
    ) {
      return NextResponse.json(
        {
          error:
            "Please fill all required fields",
        },
        { status: 400 }
      );
    }

    if (
      businessName.length < 3 ||
      businessName.length > 120
    ) {
      return NextResponse.json(
        {
          error:
            "Business name must be between 3 and 120 characters",
        },
        { status: 400 }
      );
    }

    if (description.length > 2000) {
      return NextResponse.json(
        {
          error:
            "Description cannot exceed 2000 characters",
        },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Invalid mobile number" },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: "Invalid pincode" },
        { status: 400 }
      );
    }

    if (website) {
      try {
        const parsedUrl = new URL(
          website.startsWith("http")
            ? website
            : `https://${website}`
        );

        if (
          !["http:", "https:"].includes(
            parsedUrl.protocol
          )
        ) {
          throw new Error();
        }
      } catch {
        return NextResponse.json(
          { error: "Invalid website URL" },
          { status: 400 }
        );
      }
    }

    const services = splitServices(
      body.services
    );

    if (services.length > 20) {
      return NextResponse.json(
        {
          error:
            "Maximum 20 services allowed",
        },
        { status: 400 }
      );
    }

    const latitude =
      body.latitude !== undefined &&
      body.latitude !== null &&
      body.latitude !== ""
        ? Number(body.latitude)
        : undefined;

    const longitude =
      body.longitude !== undefined &&
      body.longitude !== null &&
      body.longitude !== ""
        ? Number(body.longitude)
        : undefined;

    if (
      latitude !== undefined &&
      Number.isNaN(latitude)
    ) {
      return NextResponse.json(
        { error: "Invalid latitude" },
        { status: 400 }
      );
    }

    if (
      longitude !== undefined &&
      Number.isNaN(longitude)
    ) {
      return NextResponse.json(
        { error: "Invalid longitude" },
        { status: 400 }
      );
    }

    const businesses = await getBusinesses();

    const duplicate = businesses.find(
      (business: Business) =>
        business.businessName.toLowerCase() ===
          businessName.toLowerCase() &&
        business.phone === phone
    );

    if (duplicate) {
      return NextResponse.json(
        {
          error: "Business already exists",
        },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    const slug = generateSlug(
      businessName
    );

    const searchKeywords =
      buildSearchKeywords(
        businessName,
        category,
        city,
        state,
        services
      );

    const newBusiness: Business = {
      id: crypto.randomUUID(),

      slug,

      ownerId: user.id,
      ownerName:
        user.name || "Business Owner",

      businessName,
      category,
      description,

      address,
      city,
      state,
      pincode,

      phone,
      whatsapp,

      email,
      website,

      openingHours,

      services,

      imageUrl: undefined,
      logoUrl: undefined,
      gallery: [],

      latitude,
      longitude,

      verified: false,
      status: "pending",

      views: 0,
      phoneClicks: 0,
      whatsappClicks: 0,
      directionClicks: 0,
      websiteClicks: 0,

      rating: 0,
      reviewCount: 0,

      featured: false,

      searchKeywords,

      createdAt: now,
      updatedAt: now,
    };

    businesses.unshift(newBusiness);

    await saveBusinesses(businesses);

    return NextResponse.json(
      {
        success: true,
        message:
          "Business submitted successfully and is awaiting admin approval.",
        business: newBusiness,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create business error:",
      error
    );

    return NextResponse.json(
      { error: "Business listing failed" },
      { status: 500 }
    );
  }
}