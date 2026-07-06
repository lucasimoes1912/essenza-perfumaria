import { q } from "./db";
import type { Order } from "./types";

interface OrderRow {
  id: number;
  status: string;
  total: number;
  items: Order["items"];
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  payer_email: string | null;
  created_at: string;
  updated_at: string;
}

function toOrder(r: OrderRow): Order {
  return {
    id: r.id,
    status: r.status,
    total: r.total,
    items: r.items,
    mpPreferenceId: r.mp_preference_id,
    mpPaymentId: r.mp_payment_id,
    payerEmail: r.payer_email,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function createOrder(
  items: Order["items"],
  total: number
): Promise<number> {
  const rows = await q<{ id: number }>(
    `INSERT INTO orders (status, total, items) VALUES ('aberto', $1, $2)
     RETURNING id`,
    [total, JSON.stringify(items)]
  );
  return rows[0].id;
}

export async function setOrderPreference(
  orderId: number,
  preferenceId: string
): Promise<void> {
  await q(`UPDATE orders SET mp_preference_id=$2, updated_at=now() WHERE id=$1`, [
    orderId,
    preferenceId,
  ]);
}

export async function updateOrderPayment(
  orderId: number,
  data: { status: string; paymentId: string; payerEmail?: string | null }
): Promise<void> {
  await q(
    `UPDATE orders SET status=$2, mp_payment_id=$3,
       payer_email=COALESCE($4, payer_email), updated_at=now()
     WHERE id=$1`,
    [orderId, data.status, data.paymentId, data.payerEmail ?? null]
  );
}

export async function listOrders(limit = 100): Promise<Order[]> {
  const rows = await q<OrderRow>(
    `SELECT * FROM orders ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return rows.map(toOrder);
}
