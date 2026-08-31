import type { Metadata } from "next";
import CheckoutResult from "@/components/CheckoutResult";

export const metadata: Metadata = { title: "Pagamento não concluído" };

export default function ErroPage() {
  return (
    <CheckoutResult
      status="recusado"
      title="O pagamento não foi concluído."
      message="O Mercado Pago cancelou ou recusou a cobrança. Seus itens continuam na sacola — dá para tentar de novo com outro meio de pagamento."
    />
  );
}
