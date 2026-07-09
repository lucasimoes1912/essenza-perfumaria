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
  reseller_id: number | null;
  reseller_name?: string | null;
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
    resellerId: r.reseller_id,
    resellerName: r.reseller_name ?? null,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function createOrder(
  items: Order["items"],
  total: number,
  resellerId: number | null = null
): Promise<number> {
  const rows = await q<{ id: number }>(
    `INSERT INTO orders (status, total, items, reseller_id)
     VALUES ('aberto', $1, $2, $3) RETURNING id`,
    [total, JSON.stringify(items), resellerId]
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

/**
 * Atualiza o pagamento e retorna o status ANTERIOR + itens do pedido,
 * para o webhook descontar estoque apenas na transição para "approved"
 * (o Mercado Pago pode notificar o mesmo pagamento várias vezes).
 */
export async function updateOrderPayment(
  orderId: number,
  data: { status: string; paymentId: string; payerEmail?: string | null }
): Promise<{ oldStatus: string; items: Order["items"] } | null> {
  const rows = await q<{ old_status: string; items: Order["items"] }>(
    `UPDATE orders SET status=$2, mp_payment_id=$3,
       payer_email=COALESCE($4, payer_email), updated_at=now()
     FROM (SELECT id, status AS old_status FROM orders WHERE id=$1 FOR UPDATE) prev
     WHERE orders.id = prev.id
     RETURNING prev.old_status, orders.items`,
    [orderId, data.status, data.paymentId, data.payerEmail ?? null]
  );
  return rows[0]
    ? { oldStatus: rows[0].old_status, items: rows[0].items }
    : null;
}

export async function listOrders(limit = 100): Promise<Order[]> {
  const rows = await q<OrderRow>(
    `SELECT o.*, r.name AS reseller_name
     FROM orders o
     LEFT JOIN resellers r ON r.id = o.reseller_id
     ORDER BY o.created_at DESC LIMIT $1`,
    [limit]
  );
  return rows.map(toOrder);
}

export async function listOrdersByReseller(
  resellerId: number,
  limit = 100
): Promise<Order[]> {
  const rows = await q<OrderRow>(
    `SELECT * FROM orders WHERE reseller_id=$1
     ORDER BY created_at DESC LIMIT $2`,
    [resellerId, limit]
  );
  return rows.map(toOrder);
}
