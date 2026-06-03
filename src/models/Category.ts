import { db } from "../lib/firebase";
import { ref, push, get, update, remove } from "firebase/database";

export interface Category {
  id?: string;
  name: string;
  icon?: string;
  createdAt?: number;
  updatedAt?: number;
}

const COLLECTION = "categories";

// ➕ Create
export async function createCategory(data: { name: string; icon?: string }): Promise<Category> {
  const newCategory = {
    name: data.name,
    icon: data.icon ?? "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const result = await push(ref(db, COLLECTION), newCategory);
  return { id: result.key!, ...newCategory };
}

// 📋 Get All
export async function getAllCategories(): Promise<Category[]> {
  const snapshot = await get(ref(db, COLLECTION));
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...(data as Category),
  }));
}

// 🔍 Get by ID
export async function getCategoryById(id: string): Promise<Category | null> {
  const snapshot = await get(ref(db, `${COLLECTION}/${id}`));
  if (!snapshot.exists()) return null;
  return { id, ...snapshot.val() };
}

// ✏️ Update
export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  await update(ref(db, `${COLLECTION}/${id}`), {
    ...updates,
    updatedAt: Date.now(),
  });
}

// 🗑️ Delete
export async function deleteCategory(id: string): Promise<void> {
  await remove(ref(db, `${COLLECTION}/${id}`));
}