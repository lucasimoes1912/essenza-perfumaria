import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="font-serif text-7xl font-semibold text-gold">404</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold">Página não encontrada</h1>
      <p className="mt-2 text-stone-warm">
        O que você procura evaporou como a nota de topo de um perfume.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-ink px-8 py-3 text-sm font-semibold text-white transition hover:bg-gold"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
