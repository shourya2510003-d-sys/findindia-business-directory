// ─── User ─────────────────────────────────────────────────
export interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "user" | "business_owner" | "admin";
  createdAt?: number;
  updatedAt?: number;
}

// ─── Category ─────────────────────────────────────────────
export interface Category {
  id?: string;
  name: string;
  icon?: string;
  slug?: string;
  createdAt?: number;
  updatedAt?: number;
}

// ─── Business ─────────────────────────────────────────────
export interface Business {
  id?: string;
  name: string;
  description?: string;
  categoryId: string;
  categoryName?: string;
  ownerId?: string;
  phone: string;
  email?: string;
  website?: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  image?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  isActive?: boolean;
  tags?: string[];
  openingHours?: string;
  createdAt?: number;
  updatedAt?: number;
}

// ─── Review ───────────────────────────────────────────────
export interface Review {
  id?: string;
  businessId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment?: string;
  createdAt?: number;
  updatedAt?: number;
}

// ─── Search Filters ───────────────────────────────────────
export interface SearchFilters {
  query?: string;
  city?: string;
  categoryId?: string;
  minRating?: number;
  isVerified?: boolean;
}
