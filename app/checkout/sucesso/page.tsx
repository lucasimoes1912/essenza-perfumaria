import type { Metadata } from "next";
import CheckoutResult from "@/components/CheckoutResult";

export const metadata: Metadata = { title: "Pagamento aprovado" };

export default function SucessoPage() {
  return (
    <CheckoutResult
      icon="🎉"
      title="Pagamento aprovado!"
      message="Obrigado pela sua compra! Você receberá a confirmação e o código de rastreio por e-mail assim que o pedido for postado."
      clearCart
    />
  );
}
