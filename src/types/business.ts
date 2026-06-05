export type UserRole = "owner" | "admin";

export type BusinessStatus =
  | "pending"
  | "approved"
  | "rejected";

export type OwnerUser = {
  id: string;

  name: string;
  email: string;

  phone?: string;

  passwordHash: string;

  role: UserRole;

  createdAt: string;
};

export type PublicOwnerUser = {
  id: string;

  name: string;
  email: string;

  phone?: string;

  role: UserRole;
};

export type Business = {
  id: string;

  slug: string;

  ownerId: string;
  ownerName?: string;

  businessName: string;
  category: string;
  description?: string;

  address: string;
  city: string;
  state: string;
  pincode: string;

  phone: string;
  whatsapp?: string;

  email?: string;
  website?: string;

  openingHours?: string;

  services: string[];

  imageUrl?: string;
  logoUrl?: string;

  gallery?: string[];

  latitude?: number;
  longitude?: number;

  verified: boolean;

  status: BusinessStatus;
  rejectionReason?: string;

  views: number;
  phoneClicks: number;
  whatsappClicks: number;
  directionClicks: number;
  websiteClicks: number;

  rating?: number;
  reviewCount?: number;

  featured?: boolean;
  featuredUntil?: string;

  searchKeywords?: string[];

  createdAt: string;
  updatedAt: string;
};

export type SearchResultItem = {
  id?: string;

  name: string;
  category: string;

  rating: number;

  reviews?: number;

  address: string;

  phone?: string;

  timings?: string;

  distance?: string;

  verified?: boolean;

  imageUrl?: string;
};

export type SearchResults = {
  sq?: string;
  loc?: string;

  err?: boolean;

  items: SearchResultItem[];
};