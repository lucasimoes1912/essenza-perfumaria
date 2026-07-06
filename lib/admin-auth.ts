import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "essenza_admin";

function expectedToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHmac("sha256", pw).update("essenza-admin-session-v1").digest("hex");
}

export function passwordMatches(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sessionToken(): string {
  const t = expectedToken();
  if (!t) throw new Error("ADMIN_PASSWORD não configurada");
  return t;
}

export async function isAdmin(): Promise<boolean> {
  const t = expectedToken();
  if (!t) return false;
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === t;
}

/** Usar no topo de toda página/action do admin. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
