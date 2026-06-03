import { db } from "../lib/firebase";
import { ref, push, get, update, remove, query, orderByChild, equalTo } from "firebase/database";
import type { Review } from "../types";
import { updateBusiness, getBusinessById } from "../models/Business";

const COLLECTION = "reviews";

// ➕ Create Review + Update Business Rating
export async function createReview(data: Omit<Review, "id">): Promise<Review> {
  const newReview = {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const result = await push(ref(db, COLLECTION), newReview);

  // Update business average rating
  await recalculateRating(data.businessId);

  return { id: result.key!, ...newReview };
}

// 📋 Get Reviews by Business
export async function getReviewsByBusiness(businessId: string): Promise<Review[]> {
  const q = query(ref(db, COLLECTION), orderByChild("businessId"), equalTo(businessId));
  const snapshot = await get(q);
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...(data as Review),
  }));
}

// 📋 Get Reviews by User
export async function getReviewsByUser(userId: string): Promise<Review[]> {
  const q = query(ref(db, COLLECTION), orderByChild("userId"), equalTo(userId));
  const snapshot = await get(q);
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...(data as Review),
  }));
}

// ✏️ Update Review
export async function updateReview(id: string, updates: Partial<Review>): Promise<void> {
  await update(ref(db, `${COLLECTION}/${id}`), {
    ...updates,
    updatedAt: Date.now(),
  });
  if (updates.businessId) await recalculateRating(updates.businessId);
}

// 🗑️ Delete Review
export async function deleteReview(id: string, businessId: string): Promise<void> {
  await remove(ref(db, `${COLLECTION}/${id}`));
  await recalculateRating(businessId);
}

// ⭐ Recalculate average rating for a business
async function recalculateRating(businessId: string): Promise<void> {
  const reviews = await getReviewsByBusiness(businessId);
  if (reviews.length === 0) {
    await updateBusiness(businessId, { rating: 0, reviewCount: 0 });
    return;
  }
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await updateBusiness(businessId, {
    rating: Math.round(avg * 10) / 10,
    reviewCount: reviews.length,
  });
}
