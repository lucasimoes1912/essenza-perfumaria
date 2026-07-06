import Link from "next/link";
import { store } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-serif text-xl font-semibold">
            {store.name}{" "}
            <span className="text-sm font-normal uppercase tracking-[0.2em] text-gold">
              {store.tagline}
            </span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-stone-warm">
            {store.description}
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-semibold uppercase tracking-wide text-stone-warm">
            Navegação
          </p>
          <ul className="space-y-2">
            <li><Link href="/produtos" className="hover:text-gold">Todos os perfumes</Link></li>
            <li><Link href="/produtos?categoria=feminino" className="hover:text-gold">Feminino</Link></li>
            <li><Link href="/produtos?categoria=masculino" className="hover:text-gold">Masculino</Link></li>
            <li><Link href="/produtos?categoria=unissex" className="hover:text-gold">Unissex</Link></li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-semibold uppercase tracking-wide text-stone-warm">
            Contato
          </p>
          <ul className="space-y-2 text-stone-warm">
            <li>{store.email}</li>
            <li>{store.instagram}</li>
            <li>Pagamento seguro via Mercado Pago</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-stone-warm">
        © {new Date().getFullYear()} {store.name} {store.tagline}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
