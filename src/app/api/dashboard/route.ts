import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ultimos6Meses, mesLabel, toMesRef, obterIntervaloMeses } from "@/lib/utils";

// GET /api/dashboard?condominio=X&dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const condominioParam = searchParams.get("condominio");
  const dataInicio = searchParams.get("dataInicio"); // YYYY-MM-DD
  const dataFim = searchParams.get("dataFim");       // YYYY-MM-DD

  // Converte datas para mesRef "YYYY-MM" para filtrar no cache (snapshot)
  // Cada tipo já tem seu mesRef calculado a partir do campo correto no snapshot:
  //   INADIMPLENCIA / JURIDICOS / AMIGAVEL  → mesRef = datavecto
  //   RECEBIMENTO / RECEITAS_VAR            → mesRef = datapgto
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

  const buildWhere = (tipo: string) => {
    const where: any = { tipo, ...condoWhere };
    if (mesInicio || mesFim) {
      where.mesRef = {};
      if (mesInicio) where.mesRef.gte = mesInicio;
      if (mesFim) where.mesRef.lte = mesFim;
    }
    return where;
  };

  try {
    // Para o card de Recebimento sem filtro de data: mostrar apenas o mês atual
    const recWhere = buildWhere("RECEBIMENTO");
    if (!mesInicio && !mesFim) {
      recWhere.mesRef = toMesRef(new Date());
    }

    // ─── Cards principais (SUM) ──────────────────────────────────────────────
    const [inadSum, recSum, jurSum, amiSum, inadO5Sum, inadO6Sum] = await Promise.all([
      prisma.kpiDiario.aggregate({ _sum: { valor: true }, where: buildWhere("INADIMPLENCIA") }),
      prisma.kpiDiario.aggregate({ _sum: { valor: true }, where: recWhere }),
      prisma.kpiDiario.aggregate({ _sum: { valor: true }, where: buildWhere("JURIDICOS") }),
      prisma.kpiDiario.aggregate({ _sum: { valor: true }, where: buildWhere("AMIGAVEL") }),
      prisma.kpiDiario.aggregate({ _sum: { valor: true }, where: buildWhere("INAD_ORIGEM_5") }),
      prisma.kpiDiario.aggregate({ _sum: { valor: true }, where: buildWhere("INAD_ORIGEM_6") }),
    ]);

    // ─── Gráfico: Recebimento & Faturamento (por meses do intervalo) ───────
    const mesesFiltrados = obterIntervaloMeses(mesInicio, mesFim);
    const recMesRows = await prisma.kpiDiario.groupBy({
      by: ["mesRef"],
      _sum: { valor: true },
      where: {
        tipo: "RECEBIMENTO",
        ...condoWhere,
        mesRef: { in: mesesFiltrados },
      },
    });

    const recMesMap = new Map(recMesRows.map((r) => [r.mesRef, r._sum.valor ?? 0]));
    const recebimentoMesesLista = mesesFiltrados.map((m) => ({
      mes: mesLabel(m),
      valor: recMesMap.get(m) ?? 0,
    }));

    // Adiciona % crescimento
    const recComCrescimento = recebimentoMesesLista.map((item, i) => {
      if (i === 0) return { ...item, crescimento: 0 };
      const prev = recebimentoMesesLista[i - 1].valor;
      const crescimento = prev > 0 ? Number((((item.valor - prev) / prev) * 100).toFixed(1)) : 0;
      return { ...item, crescimento };
    });

    // ─── Gráfico: Faturamento & Crescimento (mesmos dados de recebimento) ───
    const faturamentoMesesLista = recComCrescimento;

    // ─── Gráfico: Receitas Variáveis ─────────────────────────────────────────
    const recVarWhere = buildWhere("RECEITAS_VAR");
    if (!mesInicio && !mesFim) {
      recVarWhere.mesRef = toMesRef(new Date());
    }

    const recVarRows = await prisma.kpiDiario.aggregate({
      _sum: {
        juros: true,
        correcao: true,
        multa: true,
        encargo: true,
        tarifaBoleto: true,
      },
      where: recVarWhere,
    });

    // Agrega em totais para o gráfico de pizza
    const receitasVar = {
      juros: recVarRows._sum.juros ?? 0,
      correcao: recVarRows._sum.correcao ?? 0,
      multa: recVarRows._sum.multa ?? 0,
      encargo: recVarRows._sum.encargo ?? 0,
      tarifaBoleto: recVarRows._sum.tarifaBoleto ?? 0,
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
        inadOrigem5: inadO5Sum._sum.valor ?? 0,
        inadOrigem6: inadO6Sum._sum.valor ?? 0,
      },
      recebimento6Meses: recComCrescimento,
      faturamento6Meses: faturamentoMesesLista,
      receitasVar,
      ultimoSnapshot: ultimoSnap?.criadoEm ?? null,
      snapStatus: ultimoSnap?.status ?? null,
    });
  } catch (err: any) {
    console.error("Erro ao buscar KPIs:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
