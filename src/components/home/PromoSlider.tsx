"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600",
    title: "Discover Top Restaurants",
    subtitle: "Find the best restaurants near you",
    link: "/businesses?search=restaurant",
  },
  {
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1600",
    title: "Find Trusted Doctors",
    subtitle: "Book appointments with verified doctors",
    link: "/businesses?search=doctor",
  },
  {
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600",
    title: "Best Hotel Deals",
    subtitle: "Discover hotels and stay offers",
    link: "/businesses?search=hotel",
  },
  {
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600",
    title: "Find Your Dream Home",
    subtitle: "Explore real estate businesses",
    link: "/businesses?search=real-estate",
  },
];

export default function PromoSlider() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent(
      current === 0
        ? slides.length - 1
        : current - 1
    );
  };

  const nextSlide = () => {
    setCurrent(
      current === slides.length - 1
        ? 0
        : current + 1
    );
  };

  return (
    <section className="promoSlider">
      <div
        className="promoSlide"
        style={{
          backgroundImage: `url(${slides[current].image})`,
        }}
      >
        <div className="promoOverlay">
          <h2>{slides[current].title}</h2>

          <p>{slides[current].subtitle}</p>

          <button
            onClick={() =>
              router.push(slides[current].link)
            }
          >
            Explore Now
          </button>
          <div
            style={{
              display: "flex",
              gap: "6px",
              marginTop: "16px",
              alignItems: "center",
            }}
          >
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Slide ${index + 1}`}
                style={{
                  width:
                    current === index
                      ? "18px"
                      : "6px",
                  height: "6px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all .3s ease",
                  background:
                    current === index
                      ? "#ffffff"
                      : "rgba(255,255,255,.45)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}