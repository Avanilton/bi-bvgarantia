import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ultimos6Meses, mesLabel } from "@/lib/utils";

// GET /api/dashboard?condominio=X&dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const condominioParam = searchParams.get("condominio");
  const dataInicio = searchParams.get("dataInicio"); // YYYY-MM-DD
  const dataFim = searchParams.get("dataFim");       // YYYY-MM-DD

  // Converte datas para mesRef "YYYY-MM" para filtrar no SQLite
  const mesInicio = dataInicio ? dataInicio.slice(0, 7) : null;
  const mesFim = dataFim ? dataFim.slice(0, 7) : null;

  const parseCondoFilter = () => {
    if (!condominioParam) return {};
    const numId = Number(condominioParam);
    if (!isNaN(numId) && numId > 0) {
      return { idImovel: numId };
    }
    return { nomeImovel: { contains: condominioParam } };
  };

  const condoWhere = parseCondoFilter();

  // Constrói filtro base
  const buildWhere = (tipo: string) => {
    const where: any = { tipo, ...condoWhere };
    if (mesInicio && mesFim) {
      where.mesRef = { gte: mesInicio, lte: mesFim };
    }
    return where;
  };

  try {
    // ─── Cards principais (SUM) ──────────────────────────────────────────────
    const [inadSum, recSum, jurSum, amiSum] = await Promise.all([
      prisma.kpiDiario.aggregate({ _sum: { valor: true }, where: buildWhere("INADIMPLENCIA") }),
      prisma.kpiDiario.aggregate({ _sum: { valor: true }, where: buildWhere("RECEBIMENTO") }),
      prisma.kpiDiario.aggregate({ _sum: { valor: true }, where: buildWhere("JURIDICOS") }),
      prisma.kpiDiario.aggregate({ _sum: { valor: true }, where: buildWhere("AMIGAVEL") }),
    ]);

    // ─── Gráfico: Recebimento 6 meses ───────────────────────────────────────
    const meses6 = ultimos6Meses();
    const recMesRows = await prisma.kpiDiario.groupBy({
      by: ["mesRef"],
      _sum: { valor: true },
      where: {
        tipo: "RECEBIMENTO",
        ...condoWhere,
        mesRef: { in: meses6 },
      },
    });

    const recMesMap = new Map(recMesRows.map((r) => [r.mesRef, r._sum.valor ?? 0]));
    const recebimento6Meses = meses6.map((m) => ({
      mes: mesLabel(m),
      valor: recMesMap.get(m) ?? 0,
    }));

    // Adiciona % crescimento
    const rec6ComCrescimento = recebimento6Meses.map((item, i) => {
      if (i === 0) return { ...item, crescimento: 0 };
      const prev = recebimento6Meses[i - 1].valor;
      const crescimento = prev > 0 ? Number((((item.valor - prev) / prev) * 100).toFixed(1)) : 0;
      return { ...item, crescimento };
    });

    // ─── Gráfico: Faturamento & Crescimento (mesmos dados de recebimento) ───
    const faturamento6Meses = rec6ComCrescimento; // Reutiliza mesmos dados

    // ─── Gráfico: Receitas Variáveis ─────────────────────────────────────────
    const recVarRows = await prisma.kpiDiario.groupBy({
      by: ["mesRef"],
      _sum: {
        juros: true,
        correcao: true,
        multa: true,
        encargo: true,
        tarifaBoleto: true,
      },
      where: {
        tipo: "RECEITAS_VAR",
        ...condoWhere,
        mesRef: { in: meses6 },
      },
    });

    // Agrega em totais para o gráfico de pizza
    const receitasVar = {
      juros: recVarRows.reduce((a, r) => a + (r._sum.juros ?? 0), 0),
      correcao: recVarRows.reduce((a, r) => a + (r._sum.correcao ?? 0), 0),
      multa: recVarRows.reduce((a, r) => a + (r._sum.multa ?? 0), 0),
      encargo: recVarRows.reduce((a, r) => a + (r._sum.encargo ?? 0), 0),
      tarifaBoleto: recVarRows.reduce((a, r) => a + (r._sum.tarifaBoleto ?? 0), 0),
    };

    // ─── Último snapshot ─────────────────────────────────────────────────────
    const ultimoSnap = await prisma.snapshotMeta.findFirst({
      orderBy: { criadoEm: "desc" },
      select: { criadoEm: true, status: true },
    });

    return NextResponse.json({
      cards: {
        inadimplencia: inadSum._sum.valor ?? 0,
        recebimento: recSum._sum.valor ?? 0,
        juridicos: jurSum._sum.valor ?? 0,
        amigavel: amiSum._sum.valor ?? 0,
      },
      recebimento6Meses: rec6ComCrescimento,
      faturamento6Meses,
      receitasVar,
      ultimoSnapshot: ultimoSnap?.criadoEm ?? null,
      snapStatus: ultimoSnap?.status ?? null,
    });
  } catch (err: any) {
    console.error("Erro ao buscar KPIs:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
