import type { Metadata } from "next";
import CheckoutResult from "@/components/CheckoutResult";

export const metadata: Metadata = { title: "Pagamento em análise" };

export default function PendentePage() {
  return (
    <CheckoutResult
      status="pendente"
      title="O pagamento está em análise."
      message="Isso é normal em boleto e Pix agendado. Assim que o Mercado Pago confirmar, o pedido entra na fila de envio e avisamos por e-mail."
      clearCart
    />
  );
}
