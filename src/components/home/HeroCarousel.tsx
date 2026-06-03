"use client";

import { SLIDES } from "@/data/homeData";

type HeroCarouselProps = {
  slide: number;
  setSlide: (index: number) => void;
};

export default function HeroCarousel({ slide, setSlide }: HeroCarouselProps) {
  return (
    <div className="car">
      {SLIDES.map((sl, i) => (
        <div
          key={i}
          className="csl"
          style={{ background: sl.bg, opacity: i === slide ? 1 : 0, zIndex: i === slide ? 1 : 0 }}
        >
          <div style={{ maxWidth: 500 }}>
            <div className="ctag">{sl.tag}</div>
            <div className="ctitle">{sl.title}</div>
            <div className="csub">{sl.sub}</div>
            <div className="cbadge">✓ {sl.badge}</div>
          </div>
          <div className="cem">{sl.em}</div>
        </div>
      ))}

      <div className="cdots">
        {SLIDES.map((_, i) => (
          <div key={i} className={`dot ${i === slide ? "on" : ""}`} onClick={() => setSlide(i)} />
        ))}
      </div>
    </div>
  );
}
