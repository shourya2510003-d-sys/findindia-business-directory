import crypto from "crypto";
import type { OwnerUser } from "@/types/business";

export type StoredUser = OwnerUser & {
  password?: string;
  passwordHash?: string;
};

const AUTH_KEY = "findindia_owner_user";
const JWT_SECRET =
  process.env.JWT_SECRET || "findindia_development_secret";

/* ----------------------------------
   Password Helpers
----------------------------------- */

export function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

export function verifyPassword(
  password: string,
  hashedPassword: string
): boolean {
  return hashPassword(password) === hashedPassword;
}

/* ----------------------------------
   Public User
----------------------------------- */

export function publicUser(user: StoredUser): OwnerUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

/* ----------------------------------
   Token Helpers
----------------------------------- */

export function createToken(user: OwnerUser): string {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    ts: Date.now(),
  };

  const data = Buffer.from(
    JSON.stringify(payload)
  ).toString("base64");

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(data)
    .digest("hex");

  return `${data}.${signature}`;
}

export function verifyToken(
  token: string
): OwnerUser | null {
  try {
    const [data, signature] = token.split(".");

    if (!data || !signature) {
      return null;
    }

    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(data)
      .digest("hex");

    if (expectedSignature !== signature) {
      return null;
    }

    const decoded = JSON.parse(
      Buffer.from(data, "base64").toString("utf8")
    );

    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role || "owner",
      createdAt: decoded.ts
        ? new Date(decoded.ts).toISOString()
        : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/* ----------------------------------
   Browser User Helpers
----------------------------------- */

export function getCurrentUser(): OwnerUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(AUTH_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(
  user: OwnerUser
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify(user)
  );

  window.dispatchEvent(
    new Event("auth-change")
  );
}

export function logoutUser(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_KEY);

  window.dispatchEvent(
    new Event("auth-change")
  );
}

export function onAuthChange(
  callback: (
    user: OwnerUser | null
  ) => void
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => {
    callback(getCurrentUser());
  };

  window.addEventListener(
    "auth-change",
    handler
  );

  window.addEventListener(
    "storage",
    handler
  );

  callback(getCurrentUser());

  return () => {
    window.removeEventListener(
      "auth-change",
      handler
    );

    window.removeEventListener(
      "storage",
      handler
    );
  };
}

export function getUserProfile() {
  return getCurrentUser();
}

/* ----------------------------------
   API Helpers
----------------------------------- */

export function getBearerToken(
  request: Request
): string | null {
  const authHeader =
    request.headers.get("authorization");

  if (!authHeader) {
    return null;
  }

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice(7).trim();
}