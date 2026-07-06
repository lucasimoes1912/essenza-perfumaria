import type { Metadata } from "next";
import CheckoutResult from "@/components/CheckoutResult";

export const metadata: Metadata = { title: "Pagamento não concluído" };

export default function ErroPage() {
  return (
    <CheckoutResult
      icon="😕"
      title="Pagamento não concluído"
      message="Algo deu errado ou o pagamento foi cancelado. Seus itens continuam na sacola — você pode tentar novamente quando quiser."
    />
  );
}
