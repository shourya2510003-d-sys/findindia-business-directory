"use client";

import type { SearchResults } from "@/types/business";

const P = "#ff6b00";

type SearchResultsPanelProps = {
  q: string;
  loc: string;
  results: SearchResults | null;
  close: () => void;
};

export default function SearchResultsPanel({
  q,
  loc,
  results,
  close,
}: SearchResultsPanelProps) {
  const items = Array.isArray(results?.items) ? results.items : [];

  if (!results) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        zIndex: 999,
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 860,
          background: "white",
          borderRadius: 20,
          padding: 22,
          boxShadow: "0 20px 70px rgba(0,0,0,0.22)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: "#111827" }}>
              Search Results
            </h2>

            <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
              {q || "All services"} in {loc || "India"}
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: 10,
              padding: "9px 12px",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            ✕
          </button>
        </div>

        {results.err ? (
          <div
            style={{
              background: "#fee2e2",
              color: "#dc2626",
              padding: 14,
              borderRadius: 12,
              fontWeight: 800,
            }}
          >
            Search failed. Please try again.
          </div>
        ) : items.length === 0 ? (
          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: 20,
              color: "#6b7280",
            }}
          >
            No results found.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((item, index) => (
              <article
                key={`${item.name}-${index}`}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 16,
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, color: "#111827" }}>
                      {item.name}
                    </h3>

                    <p style={{ margin: "6px 0", color: "#6b7280" }}>
                      {item.category}
                    </p>
                  </div>

                  {item.verified && (
                    <span
                      style={{
                        background: "#dcfce7",
                        color: "#16a34a",
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 900,
                        height: "fit-content",
                      }}
                    >
                      ✓ Verified
                    </span>
                  )}
                </div>

                <p style={{ margin: "8px 0", color: "#374151" }}>
                  📍 {item.address}
                </p>

                <p style={{ margin: "8px 0", color: "#374151" }}>
                  📞 {item.phone} · 🕒 {item.timings}
                </p>

                <p style={{ margin: "8px 0", color: "#374151" }}>
                  ⭐ {item.rating} · {item.reviews || 0} reviews ·{" "}
                  {item.distance}
                </p>

                <button
                  type="button"
                  style={{
                    marginTop: 8,
                    border: "none",
                    background: P,
                    color: "white",
                    borderRadius: 10,
                    padding: "10px 14px",
                    cursor: "pointer",
                    fontWeight: 900,
                  }}
                >
                  Contact Now
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}