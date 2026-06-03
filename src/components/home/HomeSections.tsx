"use client";

import {
  BEAUTY,
  BILLS,
  DAILY,
  ICATS,
  MOVIES,
  QCATS,
  REPAIRS,
  TRAVEL,
  TRENDING,
  WEDDING,
} from "@/data/homeData";
import CategorySection from "./CategorySection";
import ServiceBox from "./ServiceBox";

type HomeSectionsProps = {
  doSearch: (query?: string) => void;
};

export default function HomeSections({ doSearch }: HomeSectionsProps) {
  return (
    <div>
      <div style={{ background: "white", padding: "30px 0" }}>
        <div className="wrap">
          <div className="shdr">
            <div className="sttl">Explore Top Categories</div>
            <span className="sall">View All →</span>
          </div>

          <div className="qgrid">
            {QCATS.map((cat, i) => (
              <div
                key={i}
                className="qcard"
                style={{ background: cat.bg }}
                onClick={() => doSearch(cat.label)}
              >
                <div className="qico">{cat.icon}</div>
                <div className="qlbl" style={{ color: cat.color }}>{cat.label}</div>
                <div className="qdsc">{cat.desc}</div>
                <span className="qtag" style={{ color: cat.color, border: `1px solid ${cat.color}44` }}>
                  {cat.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#F4F4F4", padding: "28px 0" }}>
        <div className="wrap">
          <div className="shdr">
            <div className="sttl">All Categories</div>
            <span className="sall">Browse All →</span>
          </div>

          <div className="igrid">
            {ICATS.map((c, i) => (
              <div key={i} className="icard" onClick={() => doSearch(c.n)}>
                <div className="iem">{c.i}</div>
                <div className="inm">{c.n}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CategorySection title="💒 Wedding Requisites" data={WEDDING} bg="white" doSearch={doSearch} />
      <CategorySection title="💄 Beauty & Spa" data={BEAUTY} bg="#F4F4F4" doSearch={doSearch} />
      <CategorySection title="🔧 Repairs & Services" data={REPAIRS} bg="white" doSearch={doSearch} />
      <CategorySection title="🛒 Daily Needs" data={DAILY} bg="#F4F4F4" doSearch={doSearch} />

      <div style={{ background: "white", padding: "28px 0" }}>
        <div className="wrap">
          <div className="tcols">
            <ServiceBox title="💳 Bills & Recharge" data={BILLS} />
            <ServiceBox title="✈️ Travel Bookings" data={TRAVEL} />
          </div>
        </div>
      </div>

      <div style={{ background: "#F4F4F4", padding: "28px 0" }}>
        <div className="wrap">
          <div className="shdr">
            <div className="sttl">
              Trending Searches Near You
              <span className="nbadge">NEW</span>
            </div>
            <span className="sall">See All →</span>
          </div>

          <div className="tscrl">
            {TRENDING.map((t, i) => (
              <div key={i} className="tcard" onClick={() => doSearch(t.n)}>
                <div className="tico">{t.i}</div>
                <div className="tnm">{t.n}</div>
                <div className="tcnt">🔥 {t.c}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "white", padding: "28px 0" }}>
        <div className="wrap">
          <div className="shdr">
            <div className="sttl">🎬 Latest Movies & Reviews</div>
            <span className="sall">See All →</span>
          </div>

          <div className="mscrl">
            {MOVIES.map((m, i) => (
              <div key={i} className="mcard">
                <div className="mpost" style={{ background: m.bg + "38" }}>
                  {m.e}
                  <div className="mrat">⭐ {m.r}</div>
                  {m.isNew && (
                    <div style={{ position:"absolute",top:8,left:8,background:"var(--p)",color:"white",fontSize:"10px",fontWeight:"800",padding:"2px 7px",borderRadius:"5px" }}>
                      NEW
                    </div>
                  )}
                </div>
                <div className="minfo">
                  <div className="mnm">{m.n}</div>
                  <div className="mgn">{m.g}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
