import {
  getAllBusinesses,
  getBusinessesByCity,
  getBusinessesByCategory,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from "../models/Business";
import { getAllCategories, getCategoryById } from "../models/Category";
import type { Business, SearchFilters } from "../types";

// ─── Search businesses with filters ───────────────────────
export async function searchBusinesses(filters: SearchFilters): Promise<Business[]> {
  let businesses: Business[] = [];

  if (filters.categoryId) {
    businesses = await getBusinessesByCategory(filters.categoryId);
  } else if (filters.city) {
    businesses = await getBusinessesByCity(filters.city);
  } else {
    businesses = await getAllBusinesses();
  }

  // Client-side filtering
  if (filters.query) {
    const q = filters.query.toLowerCase();
    businesses = businesses.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q)
    );
  }

  if (filters.city && !filters.categoryId) {
    businesses = businesses.filter(
      (b) => b.city?.toLowerCase() === filters.city!.toLowerCase()
    );
  }

  if (filters.minRating) {
    businesses = businesses.filter((b) => (b.rating ?? 0) >= filters.minRating!);
  }

  if (filters.isVerified !== undefined) {
    businesses = businesses.filter((b) => b.isVerified === filters.isVerified);
  }

  // Sort by rating (highest first)
  return businesses.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}

// ─── Get business with category info ──────────────────────
export async function getBusinessWithCategory(id: string) {
  const business = await getBusinessById(id);
  if (!business) return null;

  const category = business.categoryId
    ? await getCategoryById(business.categoryId)
    : null;

  return { ...business, category };
}

// ─── Get businesses with categories ───────────────────────
export async function getBusinessesWithCategories(): Promise<Business[]> {
  const [businesses, categories] = await Promise.all([
    getAllBusinesses(),
    getAllCategories(),
  ]);

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return businesses.map((b) => ({
    ...b,
    categoryName: b.categoryId ? categoryMap[b.categoryId] : undefined,
  }));
}

export { createBusiness, updateBusiness, deleteBusiness, getBusinessById };
