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
export function ultimos6Meses(mesFim?: string | null): string[] {
  const meses: string[] = [];
  let currentYear, currentMonth;
  
  if (mesFim) {
    const [y, m] = mesFim.split("-");
    currentYear = parseInt(y, 10);
    currentMonth = parseInt(m, 10) - 1; // Mês 0-indexado
  } else {
    const now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth();
  }

  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    meses.push(toMesRef(d));
  }
  return meses;
}

// Retorna todos os meses entre mesInicio e mesFim. 
// Caso algum falte ou o período seja inválido, retorna os últimos 6 meses.
export function obterIntervaloMeses(mesInicio: string | null, mesFim: string | null): string[] {
  if (!mesInicio && !mesFim) {
    return ultimos6Meses();
  }
  
  if (!mesInicio) return ultimos6Meses(mesFim);
  
  if (!mesFim) {
    // Se só tem início, gera 6 meses a partir dele para a frente, ou até o atual
    const [yI, mI] = mesInicio.split("-").map(Number);
    const start = new Date(yI, mI - 1, 1);
    const now = new Date();
    const meses = [];
    while (start <= now && meses.length < 24) {
      meses.push(toMesRef(start));
      start.setMonth(start.getMonth() + 1);
    }
    return meses.length > 0 ? meses : ultimos6Meses();
  }

  const [yI, mI] = mesInicio.split("-").map(Number);
  const [yF, mF] = mesFim.split("-").map(Number);
  
  const start = new Date(yI, mI - 1, 1);
  const end = new Date(yF, mF - 1, 1);
  
  if (start > end) return ultimos6Meses(mesFim); // Se inicio for maior q fim
  
  const meses = [];
  const cur = new Date(start);
  
  while (cur <= end && meses.length < 60) { // Limitado a 5 anos para segurança
    meses.push(toMesRef(cur));
    cur.setMonth(cur.getMonth() + 1);
  }
  
  return meses;
}

// Label amigável de "YYYY-MM" -> "Abr/26"
export function mesLabel(mesRef: string): string {
  const [year, month] = mesRef.split("-");
  return `${MESES[parseInt(month) - 1]}/${year.slice(2)}`;
}

export const ID_EMPRESA = Number(process.env.ID_EMPRESA ?? 75);
