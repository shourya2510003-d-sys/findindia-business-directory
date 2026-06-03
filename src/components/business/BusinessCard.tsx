"use client";

import Image from "next/image";
import Link from "next/link";

type BusinessCardProps = {
  name: string;
  category: string;
  rating: number;
  image: string;
};

export default function BusinessCard({
  name,
  category,
  rating,
  image,
}: BusinessCardProps) {
  return (
    <div className="businessCard">
      <div className="businessImage">
        <Image
          src={image || "/images/placeholder.jpg"}
          alt={name}
          fill
          sizes="(max-width:768px) 100vw, 400px"
          className="businessImg"
        />

        <span className="businessBadge">
          Featured
        </span>
      </div>

      <div className="businessBody">
        <div className="businessTop">
          <span className="businessCategory">
            {category}
          </span>

          <span className="businessRating">
            ⭐ {rating}
          </span>
        </div>

        <h3>{name}</h3>

        <p>
          Trusted local business with quality
          services and verified customer reviews.
        </p>

        <div className="businessActions">
          <button
            className="callBtn"
            onClick={() =>
              window.location.href = "tel:+919999999999"
            }
          >
            Call Now
          </button>

          <Link
            href={`/businesses?search=${encodeURIComponent(
              name
            )}`}
            className="viewBtn"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}