"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import styles from "@/components/owner/AuthBusiness.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("ownerToken");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("ownerToken", data.token);
      localStorage.setItem(
        "ownerUser",
        JSON.stringify(data.user)
      );

      router.replace("/dashboard");
    } catch {
      setError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={`${styles.card} ${styles.split}`}>
          <section className={styles.hero}>
            <h1>Business Owner Login</h1>

            <p>
              Apne dashboard me login karke business
              manage karo, details update karo aur
              customers tak apni visibility badhao.
            </p>

            <div className={styles.points}>
              <div className={styles.point}>
                ✅ Business details manage karo
              </div>

              <div className={styles.point}>
                📍 Address, city aur map location add karo
              </div>

              <div className={styles.point}>
                📞 Phone, WhatsApp aur email visible
              </div>
            </div>
          </section>

          <form
            className={styles.form}
            onSubmit={handleLogin}
          >
            <h2>Login</h2>

            <p className={styles.muted}>
              Registered owner email aur password enter
              karo.
            </p>

            {error && (
              <div
                className={`${styles.alert} ${styles.error}`}
              >
                {error}
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="owner@example.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.btn}
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login to Dashboard"}
            </button>

            <p
              className={styles.muted}
              style={{ marginTop: 18 }}
            >
              Account nahi hai?{" "}
              <Link
                className={styles.link}
                href="/register"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}