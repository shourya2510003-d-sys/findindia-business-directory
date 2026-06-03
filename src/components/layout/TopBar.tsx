"use client";

import Link from "next/link";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          India's Trusted Local Business Directory
        </div>

        <div className="topbar-right">
          <Link href="/register">Free Listing</Link>
          <Link href="/login">Owner Login</Link>
          <Link href="/admin/login">Admin</Link>
        </div>
      </div>
    </div>
  );
}