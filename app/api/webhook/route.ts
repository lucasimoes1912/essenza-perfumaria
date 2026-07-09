import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { updateOrderPayment } from "@/lib/orders";
import { decrementStock } from "@/lib/catalog";

/**
 * Webhook de notificações do Mercado Pago.
 * Quando chega um evento de pagamento, consulta os detalhes na API do MP
 * (fonte confiável — nunca o corpo da requisição) e atualiza o pedido
 * correspondente via external_reference.
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  let body: { type?: string; topic?: string; data?: { id?: string | number } } = {};
  try {
    body = await req.json();
  } catch {
    /* corpo vazio ou não-JSON */
  }

  const type =
    body.type ?? body.topic ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
  const paymentId =
    body.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id");

  const token = process.env.MP_ACCESS_TOKEN;
  if (type === "payment" && paymentId && token) {
    try {
      const mp = new MercadoPagoConfig({ accessToken: token });
      const payment = await new Payment(mp).get({ id: String(paymentId) });
      const orderId = Number(payment.external_reference);
      if (Number.isInteger(orderId) && orderId > 0 && payment.id) {
        const status = payment.status ?? "pending";
        const result = await updateOrderPayment(orderId, {
          status,
          paymentId: String(payment.id),
          payerEmail: payment.payer?.email ?? null,
        });
        // Desconta estoque só na PRIMEIRA vez que o pedido vira "approved"
        if (result && status === "approved" && result.oldStatus !== "approved") {
          await decrementStock(
            result.items.map((i) => ({ slug: i.slug, qty: i.qty }))
          );
        }
        console.log(`[MP webhook] pedido #${orderId} → ${status}`);
      }
    } catch (e) {
      // Loga mas responde 200 para o MP não reenviar em loop infinito;
      // eventos válidos são reprocessáveis pelo painel do MP.
      console.error("[MP webhook] erro ao processar:", e);
    }
  }

  return NextResponse.json({ received: true });
}
