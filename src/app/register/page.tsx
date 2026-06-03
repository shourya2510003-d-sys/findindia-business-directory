"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import styles from "@/components/owner/AuthBusiness.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("ownerToken");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  function update(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleRegister(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError(
        "Please enter a valid 10 digit phone number"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Registration failed"
        );
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "ownerToken",
        data.token
      );

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
            <h1>
              Register Your Owner Account
            </h1>

            <p>
              Owner account banao aur apne
              business ko directory par list karo.
            </p>

            <div className={styles.points}>
              <div className={styles.point}>
                🧾 Owner profile create
              </div>

              <div className={styles.point}>
                🏪 Multiple business listings
                support
              </div>

              <div className={styles.point}>
                🔐 Password securely stored
              </div>
            </div>
          </section>

          <form
            className={styles.form}
            onSubmit={handleRegister}
          >
            <h2>Create Account</h2>

            <p className={styles.muted}>
              Business owner ki basic details
              fill karo.
            </p>

            {error && (
              <div
                className={`${styles.alert} ${styles.error}`}
              >
                {error}
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="name">
                Owner Name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) =>
                  update(
                    "name",
                    e.target.value
                  )
                }
                placeholder="Anubhav Sharma"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  update(
                    "email",
                    e.target.value
                  )
                }
                placeholder="owner@example.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) =>
                  update(
                    "phone",
                    e.target.value
                  )
                }
                placeholder="9876543210"
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
                autoComplete="new-password"
                value={form.password}
                onChange={(e) =>
                  update(
                    "password",
                    e.target.value
                  )
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
                ? "Creating..."
                : "Register & Go to Dashboard"}
            </button>

            <p
              className={styles.muted}
              style={{ marginTop: 18 }}
            >
              Already registered?{" "}
              <Link
                className={styles.link}
                href="/login"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}