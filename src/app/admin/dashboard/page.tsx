"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Business } from "@/types/business";

export default function AdminDashboardPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState(""); 
  const [statusFilter, setStatusFilter] = useState("all");

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
        setMessage(data.error || "Failed to load admin dashboard data");
      }
    } catch {
      setBusinesses([]);
      setMessage("Failed to load admin dashboard data");
    }

    setLoading(false);
  }

  function getStatus(business: Business) {
    if (business.status) return business.status;
    if (business.verified) return "approved";
    return "pending";
  }
const filteredBusinesses = businesses.filter((business) => {
  const status = getStatus(business);

  const matchesSearch =
    business.businessName
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    business.category
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    business.city
      ?.toLowerCase()
      .includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "all" || status === statusFilter;

  return matchesSearch && matchesStatus;
});
  const stats = useMemo(() => {
    const filteredBusinesses = businesses.filter((business) => {
  const status = getStatus(business);

  const matchesSearch =
    business.businessName
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    business.category
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    business.city
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "all" || status === statusFilter;

  return matchesSearch && matchesStatus;
});

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
      total: businesses.length,
      pending: businesses.filter((b) => getStatus(b) === "pending").length,
      approved: businesses.filter((b) => getStatus(b) === "approved").length,
      rejected: businesses.filter((b) => getStatus(b) === "rejected").length,
      totalViews,
      totalCalls,
      totalWhatsapp,
      totalDirections,
      totalWebsiteClicks,
    };
  }, [businesses]);

  return (
    <>
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
          <div className="adminStatIcon">🏪</div>
          <h3>{loading ? "..." : stats.total}</h3>
          <p>Total Businesses</p>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon">⏳</div>
          <h3>{loading ? "..." : stats.pending}</h3>
          <p>Pending Approvals</p>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon">✅</div>
          <h3>{loading ? "..." : stats.approved}</h3>
          <p>Approved Listings</p>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon">❌</div>
          <h3>{loading ? "..." : stats.rejected}</h3>
          <p>Rejected Listings</p>
        </div>
      </section>

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
      </section>

      <section className="adminPanel">
        <h2>Quick Actions</h2>

        <div className="adminQuickGrid">
          <Link href="/admin/businesses" className="adminQuickCard">
            <strong>Manage Business Listings</strong>
            <span>Approve, reject, review and manage submitted businesses.</span>
          </Link>

          <Link href="/admin/analytics" className="adminQuickCard">
            <strong>View Analytics</strong>
            <span>Track views, calls, WhatsApp clicks and directions.</span>
          </Link>

          <Link href="/businesses" className="adminQuickCard">
            <strong>Open Public Listings</strong>
            <span>Check how approved listings appear to users.</span>
          </Link>
        </div>
      </section>
      <section className="adminPanel">
  <h2>Business Filters</h2>

  <div
    style={{
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      marginTop: 16,
    }}
  >
    <input
      type="text"
      placeholder="Search business, category or city..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        flex: 1,
        minWidth: 260,
        padding: 12,
        borderRadius: 12,
        border: "1px solid var(--color-border)",
      }}
    />

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      style={{
        padding: 12,
        borderRadius: 12,
        border: "1px solid var(--color-border)",
      }}
    >
      <option value="all">All Status</option>
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
    </select>
  </div>
</section>

      <section className="adminPanel">
       <h2>
  Business Listings ({filteredBusinesses.length})
</h2>
        {loading ? (
          <p>Loading recent businesses...</p>
        ) : businesses.length === 0 ? (
          <p>No business listings found.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
  {filteredBusinesses.slice(0, 20).map((business) => {
              const status = getStatus(business);

              return (
                <div
                  key={business.id}
                  style={{
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    padding: 14,
                    background: "var(--color-bg-soft)",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong style={{ color: "var(--color-heading)" }}>
                      {business.businessName}
                    </strong>

                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "var(--color-muted)",
                      }}
                    >
                      {business.category} · {business.city}
                      <br />

<span>
  📞 {business.phone}
</span>

<br />

<span>
  👁️ {business.views || 0} views
</span>

<br />

<span>
  📅 {new Date(business.createdAt).toLocaleDateString()}
</span>

{business.website && (
  <>
    <br />
    <a
      href={business.website}
      target="_blank"
      rel="noreferrer"
      style={{
        color: "var(--color-accent)",
        fontWeight: 700,
      }}
    >
      Open Website
    </a>
  </>
)}
                    </p>
                  </div>

                  <span
                    style={{
                      background:
                        status === "approved"
                          ? "var(--color-success-light)"
                          : status === "rejected"
                          ? "var(--color-error-light)"
                          : "var(--color-warning-light)",
                      color:
                        status === "approved"
                          ? "var(--color-success)"
                          : status === "rejected"
                          ? "var(--color-error)"
                          : "var(--color-warning)",
                      padding: "7px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 900,
                      height: "fit-content",
                    }}
                  >
                    {status.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}