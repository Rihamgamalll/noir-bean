import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";

const COOKIE = "noir_session";
const TTL = 60 * 60 * 24 * 14;

type Session = { userId: string; role: "CUSTOMER" | "ADMIN"; exp: number };
const secret = () => process.env.AUTH_SECRET || "development-only-change-me";
const b64 = (v: string) => Buffer.from(v, "utf8").toString("base64url");

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":"); if (!salt || !hash) return false;
  const actual = scryptSync(password, salt, 64); const expected = Buffer.from(hash, "hex");
  return expected.length === actual.length && timingSafeEqual(new Uint8Array(expected), new Uint8Array(actual));
}
export function createSession(value: Omit<Session, "exp">) {
  const payload = b64(JSON.stringify({ ...value, exp: Math.floor(Date.now()/1000)+TTL }));
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}
export function readSession(token?: string | null): Session | null {
  if (!token) return null; const [payload, sig] = token.split("."); if (!payload || !sig) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  if (expected.length !== sig.length || !timingSafeEqual(new Uint8Array(Buffer.from(expected)), new Uint8Array(Buffer.from(sig)))) return null;
  try { const value = JSON.parse(Buffer.from(payload,"base64url").toString()) as Session; return value.exp > Date.now()/1000 ? value : null; } catch { return null; }
}
export const sessionCookie = { name: COOKIE, maxAge: TTL, httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" };
export function uuid() { return randomUUID(); }
