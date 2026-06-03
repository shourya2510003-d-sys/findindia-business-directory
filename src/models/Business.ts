import { db } from "../lib/firebase";
import { ref, push, get, update, remove, query, orderByChild, equalTo } from "firebase/database";
import type { Business } from "../types";

const COLLECTION = "businesses";

// ➕ Create
export async function createBusiness(data: Omit<Business, "id">): Promise<Business> {
  const newBusiness = {
    ...data,
    rating: 0,
    reviewCount: 0,
    isVerified: false,
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const result = await push(ref(db, COLLECTION), newBusiness);
  return { id: result.key!, ...newBusiness };
}

// 📋 Get All
export async function getAllBusinesses(): Promise<Business[]> {
  const snapshot = await get(ref(db, COLLECTION));
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...(data as Business),
  }));
}

// 🔍 Get by ID
export async function getBusinessById(id: string): Promise<Business | null> {
  const snapshot = await get(ref(db, `${COLLECTION}/${id}`));
  if (!snapshot.exists()) return null;
  return { id, ...snapshot.val() };
}

// 🏙️ Get by City
export async function getBusinessesByCity(city: string): Promise<Business[]> {
  const q = query(ref(db, COLLECTION), orderByChild("city"), equalTo(city));
  const snapshot = await get(q);
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...(data as Business),
  }));
}

// 🗂️ Get by Category
export async function getBusinessesByCategory(categoryId: string): Promise<Business[]> {
  const q = query(ref(db, COLLECTION), orderByChild("categoryId"), equalTo(categoryId));
  const snapshot = await get(q);
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...(data as Business),
  }));
}

// 👤 Get by Owner
export async function getBusinessesByOwner(ownerId: string): Promise<Business[]> {
  const q = query(ref(db, COLLECTION), orderByChild("ownerId"), equalTo(ownerId));
  const snapshot = await get(q);
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...(data as Business),
  }));
}

// ✏️ Update
export async function updateBusiness(id: string, updates: Partial<Business>): Promise<void> {
  await update(ref(db, `${COLLECTION}/${id}`), {
    ...updates,
    updatedAt: Date.now(),
  });
}

// 🗑️ Delete
export async function deleteBusiness(id: string): Promise<void> {
  await remove(ref(db, `${COLLECTION}/${id}`));
}
