import type { Metadata } from "next";
import CheckoutResult from "@/components/CheckoutResult";

export const metadata: Metadata = { title: "Pagamento em análise" };

export default function PendentePage() {
  return (
    <CheckoutResult
      icon="⏳"
      title="Pagamento em processamento"
      message="Seu pagamento está sendo analisado (comum em boleto e Pix agendado). Assim que for confirmado, seu pedido entra na fila de envio."
      clearCart
    />
  );
}
