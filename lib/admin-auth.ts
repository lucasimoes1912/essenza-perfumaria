import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "essenza_admin";
/** Sessão de admin expira em 12 horas — depois disso, novo login. */
export const ADMIN_SESSION_SECONDS = 60 * 60 * 12;

function secret(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD não configurada");
  return pw;
}

function sign(expiresAtMs: number): string {
  return createHmac("sha256", secret())
    .update(`essenza-admin-session-v2:${expiresAtMs}`)
    .digest("hex");
}

export function passwordMatches(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Token com expiração embutida e assinada: "<expiraEmMs>.<hmac>". */
export function sessionToken(): string {
  const expiresAtMs = Date.now() + ADMIN_SESSION_SECONDS * 1000;
  return `${expiresAtMs}.${sign(expiresAtMs)}`;
}

function tokenIsValid(value: string | undefined): boolean {
  if (!value) return false;
  const dot = value.indexOf(".");
  if (dot <= 0) return false; // formato antigo (sem expiração) é rejeitado
  const expiresAtMs = Number(value.slice(0, dot));
  const mac = value.slice(dot + 1);
  if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) return false;
  let expected: string;
  try {
    expected = sign(expiresAtMs);
  } catch {
    return false;
  }
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  try {
    const jar = await cookies();
    return tokenIsValid(jar.get(ADMIN_COOKIE)?.value);
  } catch {
    return false;
  }
}

/** Usar no topo de toda página/action do admin. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
