"use client";

import BusinessCard from "../business/BusinessCard";
import Link from "next/link";

const businesses = [
  {
    id: 1,
    name: "ABC Restaurant",
    category: "Restaurant",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  },
  {
    id: 2,
    name: "Grand Hotel",
    category: "Hotel",
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  },
  {
    id: 3,
    name: "Star Salon",
    category: "Salon",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
  },
  {
    id: 4,
    name: "Fitness Hub",
    category: "Gym",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
  },
];

export default function FeaturedBusinesses() {
  return (
    <section
      style={{
        padding: "70px 20px",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "35px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "clamp(28px,4vw,40px)",
                fontWeight: 800,
                marginBottom: "8px",
                color: "#111827",
              }}
            >
              Featured Businesses
            </h2>

            <p
              style={{
                color: "#64748b",
                margin: 0,
              }}
            >
              Discover top-rated businesses trusted by customers
            </p>
          </div>

          <Link
            href="/businesses"
            style={{
              textDecoration: "none",
              background: "#ff5a5f",
              color: "#fff",
              padding: "12px 22px",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            View All
          </Link>
        </div>

        <div className="featured-grid">
          {businesses.map((business) => (
            <BusinessCard
              key={business.id}
              name={business.name}
              category={business.category}
              rating={business.rating}
              image={business.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}