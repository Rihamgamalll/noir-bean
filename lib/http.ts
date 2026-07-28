import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSession, sessionCookie } from "@/lib/security";
export const fail = (message: string, status=400) => NextResponse.json({ error: message }, { status });
export function currentSession() { return readSession(cookies().get(sessionCookie.name)?.value); }
export function requireAdmin(request?: Request) {
  const session = currentSession();
  const legacy = request?.headers.get("x-admin-password");
  return session?.role === "ADMIN" || (!!process.env.ADMIN_PASSWORD && legacy === process.env.ADMIN_PASSWORD);
}
