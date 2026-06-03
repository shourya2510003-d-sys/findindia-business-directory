"use client";

import { CITIES, QLINKS, VERTS } from "@/data/homeData";

type FooterProps = {
  setLoc: (city: string) => void;
};

export default function Footer({ setLoc }: FooterProps) {
  return (
    <footer className="ftr">
      <div className="fgrid">
        <div>
          <div className="fttl">Top Cities</div>
          <div className="citygrid">
            {CITIES.map(c => (
              <span key={c} className="flnk" onClick={() => setLoc(c)}>{c}</span>
            ))}
          </div>
        </div>

        <div>
          <div className="fttl">Quick Links</div>
          <div style={{ display:"flex",flexDirection:"column",gap:"3px" }}>
            {QLINKS.map(l => <span key={l} className="flnk">{l}</span>)}
          </div>
        </div>

        <div>
          <div className="fttl">JD Verticals</div>
          <div className="verts">
            {VERTS.map(v => <button key={v} className="vtag">{v}</button>)}
          </div>
        </div>
      </div>

      <div className="fbot">
        <div style={{ maxWidth:1180,margin:"0 auto" }}>
          © 2026 JustDial Clone · AI-Powered Business Directory · Demo Purpose Only
        </div>
      </div>
    </footer>
  );
}
