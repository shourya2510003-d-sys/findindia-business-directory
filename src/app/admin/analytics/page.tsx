"use client";

import { useEffect, useMemo, useState } from "react";
import type { Business } from "@/types/business";

export default function AdminAnalyticsPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBusinesses();
  }, []);

  async function loadBusinesses() {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("adminToken") || "";

      const res = await fetch("/api/admin/businesses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setBusinesses(data.businesses || []);
      } else {
        setBusinesses([]);
        setMessage(data.error || "Failed to load analytics");
      }
    } catch {
      setBusinesses([]);
      setMessage("Failed to load analytics");
    }

    setLoading(false);
  }

  const stats = useMemo(() => {
    const totalViews = businesses.reduce((sum, b) => sum + (b.views || 0), 0);

    const totalCalls = businesses.reduce(
      (sum, b) => sum + (b.phoneClicks || 0),
      0
    );

    const totalWhatsapp = businesses.reduce(
      (sum, b) => sum + (b.whatsappClicks || 0),
      0
    );

    const totalDirections = businesses.reduce(
      (sum, b) => sum + (b.directionClicks || 0),
      0
    );

    const totalWebsiteClicks = businesses.reduce(
      (sum, b) => sum + (b.websiteClicks || 0),
      0
    );

    return {
      totalViews,
      totalCalls,
      totalWhatsapp,
      totalDirections,
      totalWebsiteClicks,
    };
  }, [businesses]);

  const topBusinesses = useMemo(() => {
    return [...businesses]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10);
  }, [businesses]);

  return (
    <main style={{ padding: 24 }}>
      {message && (
        <section
          style={{
            background: "var(--color-error-light)",
            color: "var(--color-error)",
            border: "1px solid rgba(220,38,38,0.2)",
            borderRadius: "var(--radius-md)",
            padding: 14,
            marginBottom: 20,
            fontWeight: 900,
          }}
        >
          {message}
        </section>
      )}

      <section className="adminStatsGrid">
        <div className="adminStatCard">
          <div className="adminStatIcon">👁️</div>
          <h3>{loading ? "..." : stats.totalViews}</h3>
          <p>Total Listing Views</p>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon">📞</div>
          <h3>{loading ? "..." : stats.totalCalls}</h3>
          <p>Phone Clicks</p>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon">💬</div>
          <h3>{loading ? "..." : stats.totalWhatsapp}</h3>
          <p>WhatsApp Clicks</p>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon">🗺️</div>
          <h3>{loading ? "..." : stats.totalDirections}</h3>
          <p>Direction Clicks</p>
        </div>
      </section>

      <section className="adminStatsGrid">
        <div className="adminStatCard">
          <div className="adminStatIcon">🌐</div>
          <h3>{loading ? "..." : stats.totalWebsiteClicks}</h3>
          <p>Website Clicks</p>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon">🏪</div>
          <h3>{loading ? "..." : businesses.length}</h3>
          <p>Total Businesses</p>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon">📊</div>
          <h3>
            {loading
              ? "..."
              : stats.totalViews > 0
              ? Math.round(
                  ((stats.totalCalls +
                    stats.totalWhatsapp +
                    stats.totalDirections +
                    stats.totalWebsiteClicks) /
                    stats.totalViews) *
                    100
                )
              : 0}
            %
          </h3>
          <p>Engagement Rate</p>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon">⭐</div>
          <h3>{loading ? "..." : topBusinesses[0]?.businessName || "N/A"}</h3>
          <p>Top Viewed Listing</p>
        </div>
      </section>

      <section className="adminPanel">
        <h2>Top Performing Business Listings</h2>

        {loading ? (
          <p>Loading analytics...</p>
        ) : topBusinesses.length === 0 ? (
          <p>No analytics data found.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {topBusinesses.map((business) => (
              <div
                key={business.id}
                style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  padding: 16,
                  background: "var(--color-bg-soft)",
                  display: "grid",
                  gap: 8,
                }}
              >
                <strong
                  style={{
                    color: "var(--color-heading)",
                    fontSize: 16,
                  }}
                >
                  {business.businessName}
                </strong>

                <span style={{ color: "var(--color-muted)", fontSize: 14 }}>
                  {business.category} · {business.city}
                </span>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 6,
                  }}
                >
                  <Metric label="Views" value={business.views || 0} />
                  <Metric label="Calls" value={business.phoneClicks || 0} />
                  <Metric label="WhatsApp" value={business.whatsappClicks || 0} />
                  <Metric
                    label="Directions"
                    value={business.directionClicks || 0}
                  />
                  <Metric
                    label="Website"
                    value={business.websiteClicks || 0}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="adminPanel">
        <h2>Google Analytics Status</h2>

        <p
          style={{
            color: "var(--color-muted)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Google Analytics GA4 can track overall website visitors, page views,
          traffic source, user location, device type and engagement. Internal
          analytics on this page tracks exact business-wise listing views, call
          clicks, WhatsApp clicks, direction clicks and website clicks.
        </p>

        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: "var(--radius-md)",
            background: "var(--color-accent-light)",
            color: "var(--color-accent)",
            fontWeight: 900,
          }}
        >
          GA ID: {process.env.NEXT_PUBLIC_GA_ID ? "Connected" : "Not Connected"}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <span
      style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
        borderRadius: 999,
        padding: "7px 11px",
        fontSize: 12,
        fontWeight: 900,
        color: "var(--color-heading)",
      }}
    >
      {label}: {value}
    </span>
  );
}