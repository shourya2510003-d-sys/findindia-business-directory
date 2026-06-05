import crypto from "crypto";
import type { OwnerUser } from "@/types/business";

export type StoredUser = OwnerUser & {
  passwordHash: string;
};

const AUTH_KEY = "findindia_owner_user";

// TypeScript-safe secret
const SECRET =
  process.env.JWT_SECRET ??
  "findindia_development_secret";

const TOKEN_EXPIRY_MS =
  7 * 24 * 60 * 60 * 1000;

/* ----------------------------------
   Password Helpers
----------------------------------- */

export function hashPassword(
  password: string
): string {
  const salt = crypto
    .randomBytes(16)
    .toString("hex");

  const hash = crypto
    .pbkdf2Sync(
      password,
      salt,
      100000,
      64,
      "sha512"
    )
    .toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(
  password: string,
  storedHash: string
): boolean {
  try {
    const [salt, originalHash] =
      storedHash.split(":");

    if (!salt || !originalHash) {
      return false;
    }

    const hash = crypto
      .pbkdf2Sync(
        password,
        salt,
        100000,
        64,
        "sha512"
      )
      .toString("hex");

    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(originalHash, "hex")
    );
  } catch {
    return false;
  }
}

/* ----------------------------------
   Public User
----------------------------------- */

export function publicUser(
  user: StoredUser
): OwnerUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    passwordHash: user.passwordHash,
    role: user.role,
    createdAt: user.createdAt,
  };
}

/* ----------------------------------
   Token Helpers
----------------------------------- */

export function createToken(
  user: OwnerUser
): string {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp:
      Date.now() +
      TOKEN_EXPIRY_MS,
  };

  const data = Buffer.from(
    JSON.stringify(payload)
  ).toString("base64");

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("hex");

  return `${data}.${signature}`;
}

export function verifyToken(
  token: string
): OwnerUser | null {
  try {
    const [data, signature] =
      token.split(".");

    if (!data || !signature) {
      return null;
    }

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          SECRET
        )
        .update(data)
        .digest("hex");

    try {
      if (
        !crypto.timingSafeEqual(
          Buffer.from(
            expectedSignature,
            "hex"
          ),
          Buffer.from(
            signature,
            "hex"
          )
        )
      ) {
        return null;
      }
    } catch {
      return null;
    }

    const decoded = JSON.parse(
      Buffer.from(
        data,
        "base64"
      ).toString("utf8")
    );

    if (
      !decoded.exp ||
      Date.now() > decoded.exp
    ) {
      return null;
    }

    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role:
        decoded.role || "owner",

      // OwnerUser type satisfy karne ke liye
      passwordHash: "",

      createdAt: new Date(
        decoded.iat ||
          Date.now()
      ).toISOString(),
    };
  } catch {
    return null;
  }
}

/* ----------------------------------
   Browser User Helpers
----------------------------------- */

export function getCurrentUser():
  | OwnerUser
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw =
    localStorage.getItem(
      AUTH_KEY
    );

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

  localStorage.removeItem(
    AUTH_KEY
  );

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
    request.headers.get(
      "authorization"
    );

  if (!authHeader) {
    return null;
  }

  if (
    !authHeader.startsWith(
      "Bearer "
    )
  ) {
    return null;
  }

  return authHeader
    .slice(7)
    .trim();
}