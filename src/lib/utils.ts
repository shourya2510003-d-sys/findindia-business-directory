// ─── Format Date ──────────────────────────────────────────
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Format Phone ─────────────────────────────────────────
export function formatPhone(phone: string): string {
  return phone.replace(/(\d{5})(\d{5})/, "$1 $2");
}

// ─── Generate Slug ────────────────────────────────────────
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── Truncate Text ────────────────────────────────────────
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// ─── Star Rating Display ──────────────────────────────────
export function getStarRating(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

// ─── Search Filter (client-side) ──────────────────────────
export function filterBusinesses<T extends { name: string; city?: string; description?: string }>(
  businesses: T[],
  query: string,
  city?: string
): T[] {
  const q = query.toLowerCase();
  return businesses.filter((b) => {
    const matchesQuery =
      b.name.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q);
    const matchesCity = city ? b.city?.toLowerCase() === city.toLowerCase() : true;
    return matchesQuery && matchesCity;
  });
}

// ─── Class Names Utility (like clsx) ──────────────────────
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
