import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getProduct } from "@/lib/products";
import { store } from "@/lib/config";

interface CheckoutBody {
  items: { slug: string; qty: number }[];
}

export async function POST(req: Request) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Pagamento ainda não configurado. Defina a variável MP_ACCESS_TOKEN no Railway (Painel do Mercado Pago > Suas integrações > Credenciais).",
      },
      { status: 503 }
    );
  }

  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  // Preços SEMPRE resolvidos no servidor a partir do catálogo — nunca
  // confiar em valores vindos do cliente.
  const items = [];
  for (const { slug, qty } of body.items) {
    const product = getProduct(slug);
    const quantity = Math.floor(Number(qty));
    if (!product || !Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { error: `Item inválido no carrinho: ${slug}` },
        { status: 400 }
      );
    }
    items.push({
      id: product.slug,
      title: `${product.name} — ${product.concentration} ${product.ml}ml`,
      quantity,
      currency_id: "BRL",
      unit_price: product.price / 100,
    });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const mp = new MercadoPagoConfig({ accessToken: token });
    const preference = await new Preference(mp).create({
      body: {
        items,
        statement_descriptor: store.name.toUpperCase(),
        back_urls: {
          success: `${siteUrl}/checkout/sucesso`,
          failure: `${siteUrl}/checkout/erro`,
          pending: `${siteUrl}/checkout/pendente`,
        },
        auto_return: "approved",
        notification_url: `${siteUrl}/api/webhook`,
      },
    });

    return NextResponse.json({ initPoint: preference.init_point });
  } catch (e) {
    console.error("Erro ao criar preferência Mercado Pago:", e);
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento. Tente novamente." },
      { status: 502 }
    );
  }
}
