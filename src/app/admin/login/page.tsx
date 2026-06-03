"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@findindia.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Admin login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.admin));

      router.push("/admin/dashboard");
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(255, 107, 0, 0.14), transparent 35%), linear-gradient(135deg, var(--color-bg-main), var(--color-bg-soft))",
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 460,
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-heavy)",
          padding: 32,
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              margin: 0,
              color: "var(--color-heading)",
              fontSize: 32,
              fontWeight: 950,
            }}
          >
            Admin Login
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "var(--color-muted)",
              fontSize: 14,
            }}
          >
            Only website owner can access the admin portal.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "var(--color-error-light)",
              color: "var(--color-error)",
              padding: 12,
              borderRadius: 12,
              marginBottom: 16,
              fontWeight: 800,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontWeight: 900,
                marginBottom: 7,
                color: "var(--color-secondary)",
              }}
            >
              Admin Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                fontWeight: 900,
                marginBottom: 7,
                color: "var(--color-secondary)",
              }}
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              borderRadius: 12,
              padding: "14px 18px",
              background:
                "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
              color: "var(--color-white)",
              fontWeight: 950,
              cursor: "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login to Admin Portal"}
          </button>
        </form>

        <Link
          href="/"
          style={{
            display: "block",
            marginTop: 18,
            textAlign: "center",
            color: "var(--color-accent)",
            fontWeight: 900,
            textDecoration: "none",
          }}
        >
          Back to Website
        </Link>
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  padding: "13px 14px",
  outline: "none",
  color: "var(--color-heading)",
};