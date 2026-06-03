export type AdminUser = {
  email: string;
  role: "admin";
};

const ADMIN_SECRET = process.env.ADMIN_SECRET || "default-admin-secret";

function encode(value: string) {
  return Buffer.from(value, "utf-8").toString("base64");
}

function decode(value: string) {
  return Buffer.from(value, "base64").toString("utf-8");
}

export function validateAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@findindia.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  return email === adminEmail && password === adminPassword;
}

export function createAdminToken(email: string) {
  const payload = {
    email,
    role: "admin",
    secret: ADMIN_SECRET,
    createdAt: Date.now(),
  };

  return encode(JSON.stringify(payload));
}

export function verifyAdminToken(token: string): AdminUser | null {
  try {
    const decoded = decode(token);
    const data = JSON.parse(decoded);

    if (
      data?.role !== "admin" ||
      data?.secret !== ADMIN_SECRET ||
      !data?.email
    ) {
      return null;
    }

    return {
      email: data.email,
      role: "admin",
    };
  } catch {
    return null;
  }
}

export function getAdminBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) return null;
  if (!authHeader.startsWith("Bearer ")) return null;

  return authHeader.replace("Bearer ", "").trim();
}

export function requireAdmin(request: Request) {
  const token = getAdminBearerToken(request);

  if (!token) return null;

  return verifyAdminToken(token);
}