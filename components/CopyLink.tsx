"use client";

import { useState } from "react";

export default function CopyLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <code className="flex-1 overflow-x-auto whitespace-nowrap rounded-lg bg-sand px-3 py-2.5 text-sm">
        {link}
      </code>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {
            /* clipboard indisponível (http antigo) — usuário copia manualmente */
          }
        }}
        className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gold"
      >
        {copied ? "✓ Copiado!" : "Copiar link"}
      </button>
    </div>
  );
}
