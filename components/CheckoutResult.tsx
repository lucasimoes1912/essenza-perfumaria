"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";

type Status = "aprovado" | "pendente" | "recusado";

const TONE: Record<Status, string> = {
  aprovado: "text-moss",
  pendente: "text-muted",
  recusado: "text-rust",
};

export default function CheckoutResult({
  status,
  title,
  message,
  clearCart = false,
}: {
  status: Status;
  title: string;
  message: string;
  clearCart?: boolean;
}) {
  const { clear } = useCart();

  useEffect(() => {
    if (clearCart) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
      <div className="max-w-xl">
        <p className={`label border-b border-rule pb-3 ${TONE[status]}`}>
          Pagamento {status}
        </p>
        <h1 className="display mt-8 text-[clamp(2.25rem,5vw,3.5rem)]">
          {title}
        </h1>
        <p className="mt-6 leading-relaxed text-muted">{message}</p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/produtos" className="btn">
            Continuar comprando
          </Link>
          <Link href="/" className="btn-ghost">
            Início
          </Link>
        </div>
      </div>
    </div>
  );
}
