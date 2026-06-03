import fs from "fs";
import path from "path";
import type { Business, OwnerUser } from "@/types/business";

const dataDir = path.join(process.cwd(), "data");
const usersFile = path.join(dataDir, "users.json");
const businessesFile = path.join(dataDir, "businesses.json");

function ensureFiles() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, "[]", "utf-8");
  if (!fs.existsSync(businessesFile)) fs.writeFileSync(businessesFile, "[]", "utf-8");
}

function readJson<T>(filePath: string): T[] {
  ensureFiles();
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeJson<T>(filePath: string, data: T[]) {
  ensureFiles();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function getUsers() {
  return readJson<OwnerUser>(usersFile);
}

export function saveUsers(users: OwnerUser[]) {
  writeJson(usersFile, users);
}

export function getBusinesses() {
  return readJson<Business>(businessesFile);
}

export function saveBusinesses(businesses: Business[]) {
  writeJson(businessesFile, businesses);
}
