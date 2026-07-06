"use client";

import Link from "next/link";
import { store } from "@/lib/config";
import { useCart } from "./CartContext";

export default function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-serif text-2xl font-semibold tracking-tight">
            {store.name}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-gold">
            {store.tagline}
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm sm:gap-8">
          <Link href="/produtos" className="hidden text-stone-warm transition hover:text-ink sm:block">
            Todos
          </Link>
          <Link href="/produtos?categoria=feminino" className="hidden text-stone-warm transition hover:text-ink sm:block">
            Feminino
          </Link>
          <Link href="/produtos?categoria=masculino" className="hidden text-stone-warm transition hover:text-ink sm:block">
            Masculino
          </Link>
          <Link href="/produtos" className="text-stone-warm transition hover:text-ink sm:hidden">
            Catálogo
          </Link>
          <Link
            href="/carrinho"
            className="relative rounded-full border border-line bg-white px-4 py-2 font-medium transition hover:border-gold"
            aria-label={`Carrinho com ${count} itens`}
          >
            Sacola
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
