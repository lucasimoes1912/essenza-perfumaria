import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { q } from "./db";

export interface Reseller {
  id: number;
  name: string;
  email: string;
  code: string;
  active: boolean;
  createdAt: string;
}

interface ResellerRow {
  id: number;
  name: string;
  email: string;
  code: string;
  password_hash: string;
  active: boolean;
  created_at: string;
}

function toReseller(r: ResellerRow): Reseller {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    code: r.code,
    active: r.active,
    createdAt: r.created_at,
  };
}

export function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(pw: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(pw, salt, 64);
  const orig = Buffer.from(hash, "hex");
  return test.length === orig.length && timingSafeEqual(test, orig);
}

export async function listResellers(): Promise<Reseller[]> {
  const rows = await q<ResellerRow>(
    `SELECT * FROM resellers ORDER BY active DESC, name ASC`
  );
  return rows.map(toReseller);
}

export async function getReseller(id: number): Promise<Reseller | undefined> {
  const rows = await q<ResellerRow>(`SELECT * FROM resellers WHERE id=$1`, [id]);
  return rows[0] ? toReseller(rows[0]) : undefined;
}

export async function getActiveResellerByCode(
  code: string
): Promise<Reseller | undefined> {
  const rows = await q<ResellerRow>(
    `SELECT * FROM resellers WHERE code=$1 AND active=true`,
    [code]
  );
  return rows[0] ? toReseller(rows[0]) : undefined;
}

/** Retorna o revendedor se e-mail+senha conferem e a conta está ativa. */
export async function authenticateReseller(
  email: string,
  password: string
): Promise<Reseller | null> {
  const rows = await q<ResellerRow>(
    `SELECT * FROM resellers WHERE lower(email)=lower($1) AND active=true`,
    [email.trim()]
  );
  const row = rows[0];
  if (!row || !verifyPassword(password, row.password_hash)) return null;
  return toReseller(row);
}

export async function createReseller(data: {
  name: string;
  email: string;
  code: string;
  password: string;
}): Promise<void> {
  await q(
    `INSERT INTO resellers (name, email, code, password_hash)
     VALUES ($1, lower($2), $3, $4)`,
    [data.name, data.email.trim(), data.code, hashPassword(data.password)]
  );
}

export async function updateReseller(
  id: number,
  data: { name: string; email: string; code: string; active: boolean; newPassword?: string }
): Promise<void> {
  await q(
    `UPDATE resellers SET name=$2, email=lower($3), code=$4, active=$5 WHERE id=$1`,
    [id, data.name, data.email.trim(), data.code, data.active]
  );
  if (data.newPassword) {
    await q(`UPDATE resellers SET password_hash=$2 WHERE id=$1`, [
      id,
      hashPassword(data.newPassword),
    ]);
  }
}

export async function deleteReseller(id: number): Promise<void> {
  await q(`DELETE FROM resellers WHERE id=$1`, [id]);
}

export interface ResellerStats {
  totalOrders: number;
  paidOrders: number;
  paidTotal: number;
}

export async function getResellerStats(id: number): Promise<ResellerStats> {
  const [s] = await q<{ total_orders: number; paid_orders: number; paid_total: number }>(
    `SELECT
       count(*)::int                                            AS total_orders,
       count(*) FILTER (WHERE status='approved')::int           AS paid_orders,
       COALESCE(sum(total) FILTER (WHERE status='approved'),0)::int AS paid_total
     FROM orders WHERE reseller_id=$1`,
    [id]
  );
  return {
    totalOrders: s.total_orders,
    paidOrders: s.paid_orders,
    paidTotal: s.paid_total,
  };
}
