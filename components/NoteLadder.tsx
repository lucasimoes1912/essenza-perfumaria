import type { Product } from "@/lib/types";

type Notes = Product["notes"];

/**
 * A escada olfativa: as três fases pelas quais um perfume passa na pele, na
 * ordem em que aparecem. A ordem carrega informação real — é o tempo — então
 * o eixo vertical é o próprio relógio.
 */
const PHASES = [
  {
    key: "topo",
    label: "Topo",
    time: "0 – 15 min",
    gloss: "A primeira impressão, enquanto o álcool evapora.",
  },
  {
    key: "coracao",
    label: "Coração",
    time: "15 min – 3 h",
    gloss: "O corpo da fragrância, onde ela se define.",
  },
  {
    key: "fundo",
    label: "Fundo",
    time: "3 h em diante",
    gloss: "O rastro que continua na pele.",
  },
] as const;

export function hasNotes(notes: Notes): boolean {
  return (
    notes.topo.length > 0 ||
    notes.coracao.length > 0 ||
    notes.fundo.length > 0
  );
}

/** Uma nota de cada fase, para a linha de metadados dos cards. */
export function noteSummary(notes: Notes): string {
  return [notes.topo[0], notes.coracao[0], notes.fundo[0]]
    .filter(Boolean)
    .join(" · ");
}

export default function NoteLadder({ notes }: { notes: Notes }) {
  return (
    <div>
      <p className="label text-muted">A fragrância na pele</p>
      <ol className="mt-5 border-l border-rule">
        {PHASES.map((phase) => {
          const list = notes[phase.key];
          return (
            <li key={phase.key} className="relative pb-8 pl-6 last:pb-0">
              <span
                className="absolute -left-[3.5px] top-[7px] h-[7px] w-[7px] bg-iris"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="display text-xl">{phase.label}</h3>
                <span className="label text-muted">{phase.time}</span>
              </div>
              <p className="mt-1.5 text-[15px] leading-relaxed">
                {list.length > 0 ? (
                  list.join(", ")
                ) : (
                  <span className="text-muted">não informado</span>
                )}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">
                {phase.gloss}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
