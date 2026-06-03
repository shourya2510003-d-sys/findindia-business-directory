"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Businesses",
    href: "/businesses",
  },
  {
    label: "List Business",
    href: "/register",
  },
  {
    label: "Admin",
    href: "/admin/dashboard",
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOwnerLoggedIn, setIsOwnerLoggedIn] =
    useState(false);

  useEffect(() => {
    checkLogin();

    const handleStorage = () => {
      checkLogin();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  function checkLogin() {
    const token =
      localStorage.getItem("ownerToken");

    setIsOwnerLoggedIn(Boolean(token));
  }

  function logout() {
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("ownerUser");

    setIsOwnerLoggedIn(false);

    router.push("/login");
    router.refresh();
  }

  return (
    <header className="hdr">
      <div className="hdr-in">
        <Link href="/" className="logo">
          Find<span>India</span>
        </Link>

        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nva"
              style={{
                color:
                  pathname === item.href
                    ? "var(--color-accent)"
                    : undefined,
              }}
            >
              {item.label}
            </Link>
          ))}

          {isOwnerLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="nva"
                style={{
                  color:
                    pathname === "/dashboard"
                      ? "var(--color-accent)"
                      : undefined,
                }}
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={logout}
                className="nva"
                style={{
                  border: "none",
                  background: "transparent",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="nva"
              style={{
                color:
                  pathname === "/login"
                    ? "var(--color-accent)"
                    : undefined,
              }}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}