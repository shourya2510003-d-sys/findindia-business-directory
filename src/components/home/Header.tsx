"use client";

import { CITIES, P, PL } from "@/data/homeData";

type HeaderProps = {
  loc: string;
  setLoc: (city: string) => void;
  q: string;
  setQ: (value: string) => void;
  showLoc: boolean;
  setShowLoc: (value: boolean | ((prev: boolean) => boolean)) => void;
  doSearch: (query?: string) => void;
};

export default function Header({ loc, setLoc, q, setQ, showLoc, setShowLoc, doSearch }: HeaderProps) {
  return (
    <header className="hdr">
      <div className="hdr-in">
        <div className="logo">Just<span>Dial</span></div>

        <div style={{ position: "relative" }}>
          <button className="locbtn" onClick={() => setShowLoc(v => !v)}>
            📍 {loc} ▾
          </button>

          {showLoc && (
            <div className="locdrop">
              <div style={{ maxHeight: "220px", overflowY: "auto" }}>
                {CITIES.map(c => (
                  <div
                    key={c}
                    className="lcity"
                    style={{
                      color: c === loc ? P : "#333",
                      fontWeight: c === loc ? 600 : 400,
                      background: c === loc ? PL : "transparent",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = c === loc ? PL : "#F5F5F5"}
                    onMouseLeave={e => e.currentTarget.style.background = c === loc ? PL : "transparent"}
                    onClick={() => {
                      setLoc(c);
                      setShowLoc(false);
                    }}
                  >
                    📍 {c}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sbar">
          <input
            className="sinp"
            placeholder={`Search restaurants, hotels, doctors in ${loc}...`}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === "Enter" && doSearch()}
          />
          <button className="sbtn" onClick={() => doSearch()}>🔍 Search</button>
        </div>

        <nav className="nav">
          {["Restaurants", "Hotels", "Doctors", "JD B2B"].map(n => (
            <span key={n} className="nva" onClick={() => doSearch(n)}>{n}</span>
          ))}
          <span className="nva">Login</span>
        </nav>
      </div>
    </header>
  );
}
