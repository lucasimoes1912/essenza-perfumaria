"use client";

import Link from "next/link";
import { store } from "@/lib/config";
import { useCart } from "./CartContext";

export default function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="bg-gradient-to-r from-gold to-accent-blue bg-clip-text font-serif text-2xl font-extrabold tracking-tight text-transparent"
        >
          {store.name}
        </Link>

        <nav className="flex items-center gap-5 text-sm sm:gap-8">
          <Link href="/" className="hidden font-semibold text-ink transition hover:text-gold sm:block">
            Home
          </Link>
          <Link href="/produtos" className="hidden font-semibold text-ink transition hover:text-gold sm:block">
            Catálogo
          </Link>
          <Link href="/#sobre-section" className="hidden font-semibold text-ink transition hover:text-gold sm:block">
            Sobre
          </Link>
          <Link
            href="/carrinho"
            className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full border border-line bg-sand transition hover:border-gold"
            aria-label={`Carrinho com ${count} itens`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h2l2.6 13.4a2 2 0 0 0 2 1.6h9a2 2 0 0 0 2-1.6L22 8H6" />
              <circle cx="9" cy="21" r="1" />
              <circle cx="18" cy="21" r="1" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
