"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    setChecking(false);
  }, [isLoginPage, router]);

  function logoutAdmin() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--color-bg-soft)",
          color: "var(--color-heading)",
          fontWeight: 900,
        }}
      >
        Checking admin access...
      </main>
    );
  }

  return (
    <div className="adminShell">
      <aside className="adminSidebar">
        <div className="adminLogo">
          Find<span>India</span>
        </div>

        <div className="adminLabel">WEBSITE OWNER</div>

        <nav className="adminNav">
          <Link href="/admin/dashboard" className="adminNavItem">
            📊 Dashboard
          </Link>

          <Link href="/admin/businesses" className="adminNavItem">
            🏪 Businesses
          </Link>

          <Link href="/admin/analytics" className="adminNavItem">
            📈 Analytics
          </Link>

          <Link href="/admin/owners" className="adminNavItem">
            👥 Owners
          </Link>

          <Link href="/admin/settings" className="adminNavItem">
            ⚙️ Settings
          </Link>

          <Link href="/" className="adminNavItem">
            🏠 Website
          </Link>

          <button
            type="button"
            onClick={logoutAdmin}
            className="adminNavItem"
            style={{
              border: "none",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      <main className="adminMain">
        <header className="adminTopbar">
          <div>
            <h1>Admin Portal</h1>
            <p>Only website owner has access to this control panel.</p>
          </div>

          <Link href="/businesses" className="adminTopBtn">
            View Public Website
          </Link>
        </header>

        {children}
      </main>
    </div>
  );
}