import { NextRequest, NextResponse } from "next/server";
import { getBusinesses, saveBusinesses } from "@/lib/db";
import type { Business } from "@/types/business";

type AnalyticsEvent =
  | "view"
  | "phone_click"
  | "whatsapp_click"
  | "direction_click"
  | "website_click";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const businessId = String(body.businessId || "").trim();
    const event = String(body.event || "").trim() as AnalyticsEvent;

    if (!businessId || !event) {
      return NextResponse.json(
        { error: "Business ID and event are required" },
        { status: 400 }
      );
    }

    const allowedEvents: AnalyticsEvent[] = [
      "view",
      "phone_click",
      "whatsapp_click",
      "direction_click",
      "website_click",
    ];

    if (!allowedEvents.includes(event)) {
      return NextResponse.json(
        { error: "Invalid analytics event" },
        { status: 400 }
      );
    }

    const businesses = await getBusinesses();

    const updatedBusinesses: Business[] = businesses.map((business) => {
      if (business.id !== businessId) return business;

      return {
        ...business,
        views: event === "view" ? (business.views || 0) + 1 : business.views || 0,
        phoneClicks:
          event === "phone_click"
            ? (business.phoneClicks || 0) + 1
            : business.phoneClicks || 0,
        whatsappClicks:
          event === "whatsapp_click"
            ? (business.whatsappClicks || 0) + 1
            : business.whatsappClicks || 0,
        directionClicks:
          event === "direction_click"
            ? (business.directionClicks || 0) + 1
            : business.directionClicks || 0,
        websiteClicks:
          event === "website_click"
            ? ((business as Business & { websiteClicks?: number }).websiteClicks || 0) + 1
            : (business as Business & { websiteClicks?: number }).websiteClicks || 0,
        updatedAt: new Date().toISOString(),
      };
    });

    await saveBusinesses(updatedBusinesses);

    return NextResponse.json(
      { message: "Analytics tracked successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Analytics tracking failed" },
      { status: 500 }
    );
  }
}