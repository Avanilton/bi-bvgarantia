// Formata valor monetário BRL
export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Formata percentual
export function formatPct(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

// Mês de referência por extenso
export const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

// Retorna data de ontem (D-1) no formato YYYY-MM-DD
export function getDm1(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

// Retorna string "YYYY-MM" para um Date
export function toMesRef(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

// Gera os últimos N meses como strings "YYYY-MM"
export function ultimos6Meses(): string[] {
  const meses: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    meses.push(toMesRef(d));
  }
  return meses;
}

// Label amigável de "YYYY-MM" -> "Abr/26"
export function mesLabel(mesRef: string): string {
  const [year, month] = mesRef.split("-");
  return `${MESES[parseInt(month) - 1]}/${year.slice(2)}`;
}

export const ID_EMPRESA = Number(process.env.ID_EMPRESA ?? 75);
