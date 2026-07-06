import { NextResponse } from "next/server";

/**
 * Webhook de notificações do Mercado Pago.
 * Por enquanto apenas registra o evento nos logs do Railway — evolua aqui
 * quando houver banco de dados (marcar pedido como pago, enviar e-mail etc.).
 */
export async function POST(req: Request) {
  try {
    const event = await req.json();
    console.log("[MP webhook]", JSON.stringify(event));
  } catch {
    // corpo vazio ou não-JSON: ignora
  }
  return NextResponse.json({ received: true });
}
