"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Business } from "@/types/business";
import { trackGoogleEvent } from "@/components/analytics/GoogleAnalytics";

export default function PublicBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinesses();
  }, []);

  async function loadBusinesses() {
    try {
      const res = await fetch("/api/businesses");
      const data = await res.json();

      if (res.ok) {
        setBusinesses(data.businesses || []);
      } else {
        setBusinesses([]);
      }
    } catch {
      setBusinesses([]);
    }

    setLoading(false);
  }

  async function trackEvent(
    business: Business,
    event:
      | "view"
      | "phone_click"
      | "whatsapp_click"
      | "direction_click"
      | "website_click"
  ) {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessId: business.id,
        event,
      }),
    }).catch(() => {});

    trackGoogleEvent(event, {
      business_id: business.id,
      business_name: business.businessName,
      category: business.category,
      city: business.city,
    });
  }

  function openMap(business: Business) {
    trackEvent(business, "direction_click");

    const query =
      business.latitude && business.longitude
        ? `${business.latitude},${business.longitude}`
        : `${business.address}, ${business.city}, ${business.state}, ${business.pincode}`;

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query
      )}`,
      "_blank"
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg-soft)" }}>
      <header
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
          color: "var(--color-white)",
          padding: "20px 24px",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 950 }}>
              Business Listings
            </h1>
            <p style={{ marginTop: 6, opacity: 0.92 }}>
              Verified businesses listed on your directory
            </p>
          </div>

          <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/" style={linkStyle}>
              Home
            </Link>
            <Link href="/register" style={linkStyle}>
              List Your Business
            </Link>
            <Link href="/login" style={linkStyle}>
              Owner Login
            </Link>
          </nav>
        </div>
      </header>

      <section style={{ maxWidth: 1320, margin: "0 auto", padding: 28 }}>
        {loading ? (
          <div style={emptyStyle}>Loading approved businesses...</div>
        ) : businesses.length === 0 ? (
          <div style={emptyStyle}>No approved business listings available yet.</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
              gap: 22,
            }}
          >
            {businesses.map((business) => (
              <article
                key={business.id}
                onMouseEnter={() => trackEvent(business, "view")}
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 24,
                  padding: 24,
                  boxShadow: "var(--shadow-medium)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <span style={categoryBadge}>{business.category}</span>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: 22,
                        color: "var(--color-heading)",
                        fontWeight: 950,
                      }}
                    >
                      {business.businessName}
                    </h2>
                  </div>

                  <span style={verifiedBadge}>✓ Verified</span>
                </div>

                {business.description && (
                  <p
                    style={{
                      marginTop: 14,
                      marginBottom: 0,
                      color: "var(--color-text)",
                      lineHeight: 1.6,
                      fontSize: 14,
                    }}
                  >
                    {business.description}
                  </p>
                )}

                <div
                  style={{
                    marginTop: 18,
                    display: "grid",
                    gap: 10,
                    color: "var(--color-text)",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  <div>
                    📍 {business.address}, {business.city}, {business.state} -{" "}
                    {business.pincode}
                  </div>

                  <div>📞 {business.phone}</div>

                  {business.whatsapp && (
                    <div>💬 WhatsApp: {business.whatsapp}</div>
                  )}

                  {business.email && <div>✉️ {business.email}</div>}

                  {business.website && <div>🌐 {business.website}</div>}

                  <div>🕒 {business.openingHours || "9 AM - 9 PM"}</div>
                </div>

                {Array.isArray(business.services) &&
                  business.services.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginTop: 16,
                      }}
                    >
                      {business.services.map((service) => (
                        <span key={service} style={chipStyle}>
                          {service}
                        </span>
                      ))}
                    </div>
                  )}

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    marginTop: 22,
                  }}
                >
                  <a
                    href={`tel:${business.phone}`}
                    style={primaryBtn}
                    onClick={() => trackEvent(business, "phone_click")}
                  >
                    📞 Call Now
                  </a>

                  {business.whatsapp && (
                    <a
                      href={`https://wa.me/91${business.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      style={outlineBtn}
                      onClick={() => trackEvent(business, "whatsapp_click")}
                    >
                      WhatsApp
                    </a>
                  )}

                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noreferrer"
                      style={outlineBtn}
                      onClick={() => trackEvent(business, "website_click")}
                    >
                      Website
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => openMap(business)}
                    style={outlineBtn}
                  >
                    Get Directions
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const linkStyle: React.CSSProperties = {
  color: "var(--color-white)",
  textDecoration: "none",
  fontWeight: 900,
  padding: "10px 14px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.14)",
};

const emptyStyle: React.CSSProperties = {
  background: "var(--color-bg-card)",
  borderRadius: 18,
  padding: 24,
  border: "1px solid var(--color-border)",
  color: "var(--color-text)",
  boxShadow: "var(--shadow-soft)",
};

const categoryBadge: React.CSSProperties = {
  background: "var(--color-accent-light)",
  color: "var(--color-accent)",
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 950,
  display: "inline-block",
  marginBottom: 12,
};

const verifiedBadge: React.CSSProperties = {
  background: "var(--color-success)",
  color: "var(--color-white)",
  padding: "7px 12px",
  borderRadius: 10,
  fontSize: 12,
  fontWeight: 950,
};

const chipStyle: React.CSSProperties = {
  background: "var(--color-bg-soft)",
  color: "var(--color-secondary)",
  border: "1px solid var(--color-border)",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 850,
};

const primaryBtn: React.CSSProperties = {
  background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
  color: "var(--color-white)",
  border: "none",
  borderRadius: 12,
  padding: "12px 18px",
  fontWeight: 950,
  textDecoration: "none",
  cursor: "pointer",
};

const outlineBtn: React.CSSProperties = {
  background: "var(--color-bg-card)",
  color: "var(--color-accent)",
  border: "1.5px solid var(--color-accent)",
  borderRadius: 12,
  padding: "12px 18px",
  fontWeight: 950,
  textDecoration: "none",
  cursor: "pointer",
};