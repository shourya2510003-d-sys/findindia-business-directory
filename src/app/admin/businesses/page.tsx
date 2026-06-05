"use client";

import { useEffect, useState } from "react";
import type { Business } from "@/types/business";

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("all");

  async function loadBusinesses() {
    setLoading(true);

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
        setMessage(data.error || "Failed to load businesses");
      }
    } catch {
      setBusinesses([]);
      setMessage("Failed to load businesses");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadBusinesses();
  }, []);

  async function approveBusiness(id: string) {
    setMessage("");
    setActionLoading(id);

    try {
      const token = localStorage.getItem("adminToken") || "";

      const res = await fetch(`/api/admin/businesses/${id}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Approval failed");
        setActionLoading("");
        return;
      }

      setMessage("Business approved successfully");
      await loadBusinesses();
    } catch {
      setMessage("Approval failed");
    }

    setActionLoading("");
  }

  async function rejectBusiness(id: string) {
    const reason = window.prompt(
      "Reject reason:",
      "Incorrect or incomplete details"
    );

    if (reason === null) return;

    setMessage("");
    setActionLoading(id);

    try {
      const token = localStorage.getItem("adminToken") || "";

      const res = await fetch(`/api/admin/businesses/${id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rejectionReason: reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Reject failed");
        setActionLoading("");
        return;
      }

      setMessage("Business rejected successfully");
      await loadBusinesses();
    } catch {
      setMessage("Reject failed");
    }

    setActionLoading("");
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

  return (
    <main style={{ padding: 24 }}>
      <section
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-soft)",
          padding: 24,
          marginBottom: 22,
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "var(--color-heading)",
            fontSize: 30,
            fontWeight: 950,
          }}
        >
          Business Approval Panel
        </h1>

        <p
          style={{
            margin: "8px 0 0",
            color: "var(--color-muted)",
          }}
        >
          Website owner can approve or reject submitted business listings here.
        </p>
      </section>

      {message && (
        <div
          style={{
            marginBottom: 18,
            padding: 14,
            borderRadius: "var(--radius-md)",
            background: "var(--color-accent-light)",
            color: "var(--color-accent)",
            fontWeight: 900,
          }}
          
        ><section
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: 12,
    marginBottom: 20,
  }}
>
  <div style={statCard}>
    <h3>{businesses.length}</h3>
    <p>Total Businesses</p>
  </div>

  <div style={statCard}>
    <h3>
      {businesses.filter((b) => getStatus(b) === "pending").length}
    </h3>
    <p>Pending</p>
  </div>

  <div style={statCard}>
    <h3>
      {businesses.filter((b) => getStatus(b) === "approved").length}
    </h3>
    <p>Approved</p>
  </div>

  <div style={statCard}>
    <h3>
      {businesses.filter((b) => getStatus(b) === "rejected").length}
    </h3>
    <p>Rejected</p>
  </div>
</section>

<section
  style={{
    background: "var(--color-bg-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-xl)",
    padding: 20,
    marginBottom: 20,
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  }}
>
  <input
    type="text"
    placeholder="Search business..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      flex: 1,
      minWidth: 250,
      padding: 12,
      borderRadius: 10,
      border: "1px solid var(--color-border)",
    }}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    style={{
      padding: 12,
      borderRadius: 10,
      border: "1px solid var(--color-border)",
    }}
  >
    <option value="all">All Status</option>
    <option value="pending">Pending</option>
    <option value="approved">Approved</option>
    <option value="rejected">Rejected</option>
  </select>

  <button
    onClick={loadBusinesses}
    style={{
      padding: "12px 18px",
      border: "none",
      borderRadius: 10,
      cursor: "pointer",
      fontWeight: 900,
      background: "var(--color-accent)",
      color: "#fff",
    }}
  >
    Refresh
  </button>
</section>
          {message}
        </div>
      )}

      {loading ? (
        <section
          style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            padding: 24,
            boxShadow: "var(--shadow-soft)",
          }}
        >
          Loading businesses...
        </section>
      ) : filteredBusinesses.length === 0 ? (
        <section
          style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            padding: 24,
            boxShadow: "var(--shadow-soft)",
          }}
        >
          No business listings found.
        </section>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: 18,
          }}
        >
          filteredBusinesses.map((business) => {
            const status = getStatus(business);

            return (
              <article
                key={business.id}
                style={{
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-xl)",
                  padding: 22,
                  boxShadow: "var(--shadow-soft)",
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
                    <span
                      style={{
                        display: "inline-block",
                        background: "var(--color-accent-light)",
                        color: "var(--color-accent)",
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 950,
                        marginBottom: 10,
                      }}
                    >
                      {business.category}
                    </span>

                    <h2
                      style={{
                        margin: 0,
                        color: "var(--color-heading)",
                        fontSize: 21,
                        fontWeight: 950,
                      }}
                    >
                      {business.businessName}
                    </h2>
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
                      fontWeight: 950,
                    }}
                  >
                    {status.toUpperCase()}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 9,
                    marginTop: 16,
                    color: "var(--color-text)",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  <div>
                    <b>Owner:</b> {business.ownerName || "Business Owner"}
                  </div>

                  <div>
                    <b>Address:</b> {business.address}, {business.city},{" "}
                    {business.state} - {business.pincode}
                  </div>

                  <div>
                    <b>Phone:</b> {business.phone}
                  </div>

                  <div>
                    <b>Email:</b> {business.email || "N/A"}
                  </div>

                  <div>
                    <b>WhatsApp:</b> {business.whatsapp || "N/A"}
                  </div>

                  <div>
                    <b>Opening Hours:</b> {business.openingHours || "N/A"}
                  </div>
                  <div>
                  <b>Views:</b> {business.views || 0}
                  </div>

                  <div>
                  <b>Phone Clicks:</b> {business.phoneClicks || 0}
                  </div>

                  <div>
                  <b>WhatsApp Clicks:</b> {business.whatsappClicks || 0}
                  </div>

                  <div>
                  <b>Direction Clicks:</b> {business.directionClicks || 0}
                  </div>

                  <div>
                  <b>Website Clicks:</b> {business.websiteClicks || 0}
                  </div>

                  {business.rejectionReason && (
                    <div style={{ color: "var(--color-error)" }}>
                      <b>Reject Reason:</b> {business.rejectionReason}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 18,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => approveBusiness(business.id)}
                    disabled={actionLoading === business.id}
                    style={{
                      padding: "11px 16px",
                      background:
                        "linear-gradient(135deg, var(--color-success), #22c55e)",
                      color: "var(--color-white)",
                      border: "none",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontWeight: 950,
                    }}
                  >
                    {actionLoading === business.id ? "Please wait..." : "Approve"}
                  </button>

                  <button
                    type="button"
                    onClick={() => rejectBusiness(business.id)}
                    disabled={actionLoading === business.id}
                    style={{
                      padding: "11px 16px",
                      background: "var(--color-error)",
                      color: "var(--color-white)",
                      border: "none",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontWeight: 950,
                    }}
                  >
                    Reject
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
const statCard: React.CSSProperties = {
  background: "var(--color-bg-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 16,
  padding: 18,
  textAlign: "center",
  boxShadow: "var(--shadow-soft)",
};