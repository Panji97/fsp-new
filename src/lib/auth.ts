import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "fsp_admin_auth";
const AGE = 60 * 60 * 12; // 12 jam

function secret(): string {
  return (
    process.env.FSP_SESSION_SECRET ||
    "fsp-ganti-secret-ini-di-production-min-32-karakter"
  );
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export async function createAdminSession(username: string) {
  const exp = Date.now() + AGE * 1000;
  const payload = `${username}.${exp}`;
  const token = Buffer.from(`${payload}.${sign(payload)}`).toString("base64url");
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function destroyAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getAdminUser(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [username, expStr, sig] = decoded.split(".");
    if (!username || !expStr || !sig) return null;
    if (Number(expStr) < Date.now()) return null;
    const expected = sign(`${username}.${expStr}`);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return username;
  } catch {
    return null;
  }
}

export function checkCredentials(username: string, password: string): boolean {
  const u = process.env.FSP_ADMIN_USER || "admin";
  const p = process.env.FSP_ADMIN_PASSWORD || "admin123";
  return username === u && password === p;
}
