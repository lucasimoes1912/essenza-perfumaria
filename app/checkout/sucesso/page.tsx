import type { Metadata } from "next";
import CheckoutResult from "@/components/CheckoutResult";

export const metadata: Metadata = { title: "Pagamento aprovado" };

export default function SucessoPage() {
  return (
    <CheckoutResult
      status="aprovado"
      title="Pedido confirmado."
      message="O pagamento foi aprovado e o pedido entrou na fila de separação. Você recebe a confirmação e o código de rastreio por e-mail assim que ele for postado."
      clearCart
    />
  );
}
