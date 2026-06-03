"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import styles from "@/components/owner/AuthBusiness.module.css";
import type { Business, PublicOwnerUser } from "@/types/business";

const emptyForm = {
  businessName: "",
  category: "",
  description: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  whatsapp: "",
  email: "",
  website: "",
  openingHours: "9 AM - 9 PM",
  services: "",
  latitude: "",
  longitude: "",
};

type BusinessForm = typeof emptyForm;

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<PublicOwnerUser | null>(null);
  const [token, setToken] = useState("");
  const [form, setForm] = useState<BusinessForm>(emptyForm);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("ownerToken") || "";
    const savedUser = localStorage.getItem("ownerUser");

    if (!savedToken || !savedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser) as PublicOwnerUser;

      setToken(savedToken);
      setUser(parsedUser);

      setForm((prev) => ({
        ...prev,
        phone: parsedUser.phone || "",
        whatsapp: parsedUser.phone || "",
        email: parsedUser.email || "",
      }));

      loadMyBusinesses(savedToken);
    } catch {
      localStorage.removeItem("ownerToken");
      localStorage.removeItem("ownerUser");
      router.push("/login");
    }
  }, [router]);

  async function loadMyBusinesses(authToken = token) {
    try {
      const res = await fetch("/api/businesses?mine=true", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setBusinesses(data.businesses || []);
      }
    } catch {
      setBusinesses([]);
    }
  }

  function update(name: keyof BusinessForm, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  }

  function logout() {
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("ownerUser");
    router.push("/login");
  }

  async function addBusiness(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          businessName: form.businessName.trim(),
          category: form.category.trim(),
          description: form.description.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          phone: form.phone.trim(),
          whatsapp: form.whatsapp.trim(),
          email: form.email.trim(),
          website: form.website.trim(),
          openingHours: form.openingHours.trim(),
          services: form.services.trim(),
          latitude: form.latitude.trim(),
          longitude: form.longitude.trim(),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Business listing failed");
        return;
      }

      setSuccess(
  "Business submitted successfully. Admin approval ke baad public page par visible hoga."
);
      setForm((prev) => ({
        ...emptyForm,
        phone: prev.phone || "",
        whatsapp: prev.whatsapp || "",
        email: prev.email || "",
      }));

      loadMyBusinesses();
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.topbar}>
          <div>
            <h1>Owner Dashboard</h1>
            <p className={styles.muted}>
              Welcome {user?.name || "Business Owner"}. Yahan se business list aur manage karo.
            </p>
          </div>

          <div className={styles.topActions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.ghost}`}
              onClick={() => router.push("/businesses")}
            >
              View Public Listings
            </button>

            <button type="button" className={styles.btn} onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <section className={styles.panel}>
          <h2>List New Business</h2>

          {error && <div className={`${styles.alert} ${styles.error}`}>{error}</div>}
          {success && <div className={`${styles.alert} ${styles.success}`}>{success}</div>}

          <form onSubmit={addBusiness}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Business Name *</label>
                <input
                  value={form.businessName || ""}
                  onChange={(e) => update("businessName", e.target.value)}
                  placeholder="Sharma Packers & Movers"
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Category *</label>
                <select
                  value={form.category || ""}
                  onChange={(e) => update("category", e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Packers & Movers">Packers & Movers</option>
                  <option value="Repair & Service">Repair & Service</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Education">Education</option>
                  <option value="Beauty & Spa">Beauty & Spa</option>
                  <option value="B2B Supplier">B2B Supplier</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label>Description</label>
              <textarea
                value={form.description || ""}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Apne business ke baare me short description likho..."
              />
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Phone *</label>
                <input
                  value={form.phone || ""}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="9876543210"
                  required
                />
              </div>

              <div className={styles.field}>
                <label>WhatsApp</label>
                <input
                  value={form.whatsapp || ""}
                  onChange={(e) => update("whatsapp", e.target.value)}
                  placeholder="9876543210"
                />
              </div>

              <div className={styles.field}>
                <label>Email</label>
                <input
                  type="email"
                  value={form.email || ""}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="business@example.com"
                />
              </div>

              <div className={styles.field}>
                <label>Website</label>
                <input
                  value={form.website || ""}
                  onChange={(e) => update("website", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Full Address *</label>
              <textarea
                value={form.address || ""}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Shop no, street, landmark..."
                required
              />
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label>City *</label>
                <input
                  value={form.city || ""}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="Delhi"
                  required
                />
              </div>

              <div className={styles.field}>
                <label>State *</label>
                <input
                  value={form.state || ""}
                  onChange={(e) => update("state", e.target.value)}
                  placeholder="Delhi"
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Pincode *</label>
                <input
                  value={form.pincode || ""}
                  onChange={(e) => update("pincode", e.target.value)}
                  placeholder="110001"
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Opening Hours</label>
                <input
                  value={form.openingHours || ""}
                  onChange={(e) => update("openingHours", e.target.value)}
                  placeholder="9 AM - 9 PM"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Services / Keywords</label>
              <input
                value={form.services || ""}
                onChange={(e) => update("services", e.target.value)}
                placeholder="Home shifting, office shifting, packing, transport"
              />
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Latitude optional</label>
                <input
                  value={form.latitude || ""}
                  onChange={(e) => update("latitude", e.target.value)}
                  placeholder="28.6139"
                />
              </div>

              <div className={styles.field}>
                <label>Longitude optional</label>
                <input
                  value={form.longitude || ""}
                  onChange={(e) => update("longitude", e.target.value)}
                  placeholder="77.2090"
                />
              </div>
            </div>

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Saving..." : "Submit Business Listing"}
            </button>
          </form>
        </section>

        <section className={styles.panel}>
          <h2>My Business Listings</h2>

          {businesses.length === 0 ? (
            <div className={styles.empty}>Abhi koi business listed nahi hai.</div>
          ) : (
            <div className={styles.businessGrid}>
              {businesses.map((b) => (
                <article key={b.id} className={styles.businessCard}>
                  <span className={styles.tag}>{b.category}</span>

                  <h3>{b.businessName}</h3>

                  <div className={styles.info}>
                    <div>
                      📍 {b.address}, {b.city}, {b.state} - {b.pincode}
                    </div>

                    <div>
                      📞 {b.phone || "N/A"} · WhatsApp: {b.whatsapp || "N/A"}
                    </div>

                    <div>✉️ {b.email || "N/A"}</div>

                    {b.website && <div>🌐 {b.website}</div>}

                    <div>🕒 {b.openingHours || "N/A"}</div>

                    <div>
                      <span className={styles.status}>
                        {b.status === "approved"
                        ? "Approved / Verified"
                        : b.status === "rejected"
                        ? `Rejected${b.rejectionReason ? ` - ${b.rejectionReason}` : ""}`
                        : "Pending Admin Approval"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.services}>
                    {Array.isArray(b.services) && b.services.length > 0 ? (
                      b.services.map((service) => (
                        <span key={service} className={styles.chip}>
                          {service}
                        </span>
                      ))
                    ) : (
                      <span className={styles.chip}>No services added</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}