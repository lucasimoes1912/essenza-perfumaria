/** UFs agrupadas por região — sementes da tabela de frete (sem imports). */
export const REGIONS: { name: string; ufs: string[]; defaultPrice: number }[] = [
  { name: "Sudeste", ufs: ["SP", "RJ", "MG", "ES"], defaultPrice: 1590 },
  { name: "Sul", ufs: ["PR", "SC", "RS"], defaultPrice: 1890 },
  { name: "Centro-Oeste", ufs: ["DF", "GO", "MT", "MS"], defaultPrice: 2190 },
  {
    name: "Nordeste",
    ufs: ["BA", "SE", "AL", "PE", "PB", "RN", "CE", "PI", "MA"],
    defaultPrice: 2490,
  },
  {
    name: "Norte",
    ufs: ["TO", "PA", "AP", "AM", "RR", "RO", "AC"],
    defaultPrice: 2890,
  },
];

export const ALL_UFS = REGIONS.flatMap((r) => r.ufs);
