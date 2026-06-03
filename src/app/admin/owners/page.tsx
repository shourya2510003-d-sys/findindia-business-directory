"use client";

import { useEffect, useMemo, useState } from "react";

type OwnerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "owner" | "admin";
  createdAt: string;
  totalBusinesses: number;
  approvedBusinesses: number;
  pendingBusinesses: number;
  rejectedBusinesses: number;
};

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState<OwnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadOwners();
  }, []);

  async function loadOwners() {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("adminToken") || "";

      const res = await fetch("/api/admin/owners", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setOwners(data.owners || []);
      } else {
        setOwners([]);
        setMessage(data.error || "Failed to load owners");
      }
    } catch {
      setOwners([]);
      setMessage("Failed to load owners");
    }

    setLoading(false);
  }

  const stats = useMemo(() => {
    return {
      totalOwners: owners.length,
      totalBusinesses: owners.reduce(
        (sum, owner) => sum + owner.totalBusinesses,
        0
      ),
      approvedBusinesses: owners.reduce(
        (sum, owner) => sum + owner.approvedBusinesses,
        0
      ),
      pendingBusinesses: owners.reduce(
        (sum, owner) => sum + owner.pendingBusinesses,
        0
      ),
    };
  }, [owners]);

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
          <div className="adminStatIcon">👥</div>
          <h3>{loading ? "..." : stats.totalOwners}</h3>
          <p>Total Owners</p>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon">🏪</div>
          <h3>{loading ? "..." : stats.totalBusinesses}</h3>
          <p>Total Owner Businesses</p>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon">✅</div>
          <h3>{loading ? "..." : stats.approvedBusinesses}</h3>
          <p>Approved Businesses</p>
        </div>

        <div className="adminStatCard">
          <div className="adminStatIcon">⏳</div>
          <h3>{loading ? "..." : stats.pendingBusinesses}</h3>
          <p>Pending Businesses</p>
        </div>
      </section>

      <section className="adminPanel">
        <h2>Business Owners</h2>

        {loading ? (
          <p>Loading owners...</p>
        ) : owners.length === 0 ? (
          <p>No business owners found.</p>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {owners.map((owner) => (
              <article
                key={owner.id}
                style={{
                  background: "var(--color-bg-soft)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: 18,
                  display: "grid",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        color: "var(--color-heading)",
                        fontSize: 20,
                        fontWeight: 950,
                      }}
                    >
                      {owner.name}
                    </h3>

                    <p
                      style={{
                        margin: "6px 0 0",
                        color: "var(--color-muted)",
                        fontSize: 14,
                      }}
                    >
                      {owner.email} · {owner.phone || "No phone"}
                    </p>
                  </div>

                  <span
                    style={{
                      background: "var(--color-accent-light)",
                      color: "var(--color-accent)",
                      borderRadius: 999,
                      padding: "7px 12px",
                      fontSize: 12,
                      fontWeight: 950,
                      height: "fit-content",
                    }}
                  >
                    {owner.role.toUpperCase()}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <Metric label="Total" value={owner.totalBusinesses} />
                  <Metric label="Approved" value={owner.approvedBusinesses} />
                  <Metric label="Pending" value={owner.pendingBusinesses} />
                  <Metric label="Rejected" value={owner.rejectedBusinesses} />
                </div>
              </article>
            ))}
          </div>
        )}
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