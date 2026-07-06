"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";

export default function CheckoutResult({
  icon,
  title,
  message,
  clearCart = false,
}: {
  icon: string;
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
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-6xl">{icon}</p>
      <h1 className="mt-6 font-serif text-3xl font-semibold sm:text-4xl">{title}</h1>
      <p className="mt-3 text-stone-warm">{message}</p>
      <div className="mt-10 flex justify-center gap-3">
        <Link
          href="/produtos"
          className="rounded-full bg-ink px-8 py-3 text-sm font-semibold text-white transition hover:bg-gold"
        >
          Continuar comprando
        </Link>
        <Link
          href="/"
          className="rounded-full border border-line px-8 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold"
        >
          Início
        </Link>
      </div>
    </div>
  );
}
