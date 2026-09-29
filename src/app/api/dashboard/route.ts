import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import pool from "@/lib/mysql";
import { ultimos6Meses, mesLabel, toMesRef } from "@/lib/utils";

const ID_EMPRESA = Number(process.env.ID_EMPRESA ?? 75);

// GET /api/dashboard?condominio=X&dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const condominioParam = searchParams.get("condominio");
  const dataInicio = searchParams.get("dataInicio"); // YYYY-MM-DD
  const dataFim = searchParams.get("dataFim");       // YYYY-MM-DD

  // Converte datas para mesRef "YYYY-MM" para filtrar no cache PostgreSQL
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
  const condoIdNum = condominioParam ? Number(condominioParam) : null;

  // ─── Helper: filtro de condomínio para SQL MySQL ────────────────────────────
  const condoSqlFragment = condoIdNum && !isNaN(condoIdNum)
    ? `AND b.idimovel = ${condoIdNum}`
    : "";

  try {
    // ═══════════════════════════════════════════════════════════════════════════
    // Quando há filtro de data: busca direto no MySQL com campos corretos
    // ═══════════════════════════════════════════════════════════════════════════
    if (dataInicio && dataFim) {

      // ── 1. INADIMPLÊNCIA — usa dataVecto ──────────────────────────────────
      const [inadRowsMySQL] = await pool.query(
        `SELECT SUM(IFNULL(b.valorparc, 0)) AS valor
         FROM TBBOLETO b
         WHERE b.idEmpresa = ?
           AND b.pago      = 0
           AND b.cancelado = 0
           AND b.valorparc > 0
           AND b.dataVecto >= ?
           AND b.dataVecto <= ?
           ${condoSqlFragment}`,
        [ID_EMPRESA, dataInicio, dataFim]
      ) as any[];
      const inadTotal = Number((inadRowsMySQL as any[])[0]?.valor ?? 0);

      // ── 2. RECEBIMENTO — usa dataPgto ────────────────────────────────────
      const [recRowsMySQL] = await pool.query(
        `SELECT SUM(IFNULL(b.valorPago, 0)) AS valor
         FROM TBBOLETO b
         WHERE b.idEmpresa = ?
           AND b.cancelado = 0
           AND b.valorPago > 0
           AND b.dataPgto IS NOT NULL
           AND b.dataPgto >= ?
           AND b.dataPgto <= ?
           ${condoSqlFragment}`,
        [ID_EMPRESA, dataInicio, dataFim]
      ) as any[];
      const recTotal = Number((recRowsMySQL as any[])[0]?.valor ?? 0);

      // ── 3. JURÍDICOS NÃO PAGOS — usa dataVecto ───────────────────────────
      const [jurRowsMySQL] = await pool.query(
        `SELECT SUM(IFNULL(b.total, 0)) AS valor
         FROM TBBOLETO b
         WHERE b.idEmpresa = ?
           AND b.pago      = 0
           AND b.cancelado = 0
           AND b.origem    = 6
           AND b.valorparc > 0
           AND b.dataVecto >= ?
           AND b.dataVecto <= ?
           ${condoSqlFragment}`,
        [ID_EMPRESA, dataInicio, dataFim]
      ) as any[];
      const jurTotal = Number((jurRowsMySQL as any[])[0]?.valor ?? 0);

      // ── 4. AMIGÁVEL NÃO PAGOS — usa dataVecto ────────────────────────────
      const [amiRowsMySQL] = await pool.query(
        `SELECT SUM(IFNULL(b.total, 0)) AS valor
         FROM TBBOLETO b
         WHERE b.idEmpresa = ?
           AND b.pago      = 0
           AND b.cancelado = 0
           AND b.origem    = 5
           AND b.valorparc > 0
           AND b.dataVecto >= ?
           AND b.dataVecto <= ?
           ${condoSqlFragment}`,
        [ID_EMPRESA, dataInicio, dataFim]
      ) as any[];
      const amiTotal = Number((amiRowsMySQL as any[])[0]?.valor ?? 0);

      // ── 5. RECEBIMENTO 6 MESES — usa dataPgto ───────────────────────────
      const meses6 = ultimos6Meses(mesFim);
      const [recMesRowsMySQL] = await pool.query(
        `SELECT DATE_FORMAT(b.dataPgto, '%Y-%m') AS mesRef,
                SUM(IFNULL(b.valorPago, 0))      AS valor
         FROM TBBOLETO b
         WHERE b.idEmpresa = ?
           AND b.cancelado = 0
           AND b.valorPago > 0
           AND b.dataPgto IS NOT NULL
           AND DATE_FORMAT(b.dataPgto, '%Y-%m') IN (${meses6.map(() => "?").join(",")})
           ${condoSqlFragment}
         GROUP BY mesRef`,
        [ID_EMPRESA, ...meses6]
      ) as any[];

      const recMesMap = new Map<string, number>();
      for (const r of (recMesRowsMySQL as any[])) {
        recMesMap.set(String(r.mesRef), Number(r.valor ?? 0));
      }

      const recebimento6Meses = meses6.map((m) => ({
        mes: mesLabel(m),
        valor: recMesMap.get(m) ?? 0,
      }));

      const rec6ComCrescimento = recebimento6Meses.map((item, i) => {
        if (i === 0) return { ...item, crescimento: 0 };
        const prev = recebimento6Meses[i - 1].valor;
        const crescimento = prev > 0 ? Number((((item.valor - prev) / prev) * 100).toFixed(1)) : 0;
        return { ...item, crescimento };
      });

      // ── 6. RECEITAS VARIÁVEIS — usa dataPgto ─────────────────────────────
      const [recVarRowsMySQL] = await pool.query(
        `SELECT SUM(IFNULL(b.juros, 0))          AS juros,
                SUM(IFNULL(b.correcao, 0))        AS correcao,
                SUM(IFNULL(b.multa, 0))           AS multa,
                SUM(IFNULL(b.encargo, 0))         AS encargo,
                SUM(IFNULL(b.tarifaBancaria, 0))  AS tarifaBoleto
         FROM TBBOLETO b
         WHERE b.idEmpresa = ?
           AND b.pago      = 1
           AND b.cancelado = 0
           AND b.dataPgto IS NOT NULL
           AND b.dataPgto >= ?
           AND b.dataPgto <= ?
           ${condoSqlFragment}`,
        [ID_EMPRESA, dataInicio, dataFim]
      ) as any[];
      const rv = (recVarRowsMySQL as any[])[0] ?? {};

      // ── Último snapshot ───────────────────────────────────────────────────
      const ultimoSnap = await prisma.snapshotMeta.findFirst({
        orderBy: { criadoEm: "desc" },
        select: { criadoEm: true, status: true },
      });

      return NextResponse.json({
        cards: {
          inadimplencia: inadTotal,
          recebimento: recTotal,
          juridicos: jurTotal,
          amigavel: amiTotal,
        },
        recebimento6Meses: rec6ComCrescimento,
        faturamento6Meses: rec6ComCrescimento,
        receitasVar: {
          juros: Number(rv.juros ?? 0),
          correcao: Number(rv.correcao ?? 0),
          multa: Number(rv.multa ?? 0),
          encargo: Number(rv.encargo ?? 0),
          tarifaBoleto: Number(rv.tarifaBoleto ?? 0),
        },
        ultimoSnapshot: ultimoSnap?.criadoEm ?? null,
        snapStatus: ultimoSnap?.status ?? null,
      });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Sem filtro de data: usa o cache do PostgreSQL (snapshot)
    // ═══════════════════════════════════════════════════════════════════════════

    // Constrói filtro base para cache
    const buildWhere = (tipo: string) => {
      const where: any = { tipo, ...condoWhere };
      if (mesInicio && mesFim) {
        where.mesRef = { gte: mesInicio, lte: mesFim };
      }
      return where;
    };

    // Para o card de Recebimento sem filtro: mostrar apenas o mês atual
    const recWhere = buildWhere("RECEBIMENTO");
    if (!mesInicio && !mesFim) {
      recWhere.mesRef = toMesRef(new Date());
    }

    // ─── Cards principais (SUM) ──────────────────────────────────────────────
    const [inadSum, recSum, jurSum, amiSum] = await Promise.all([
      prisma.kpiDiario.aggregate({ _sum: { valor: true }, where: buildWhere("INADIMPLENCIA") }),
      prisma.kpiDiario.aggregate({ _sum: { valor: true }, where: recWhere }),
      prisma.kpiDiario.aggregate({ _sum: { valor: true }, where: buildWhere("JURIDICOS") }),
      prisma.kpiDiario.aggregate({ _sum: { valor: true }, where: buildWhere("AMIGAVEL") }),
    ]);

    // ─── Gráfico: Recebimento 6 meses ───────────────────────────────────────
    const meses6 = ultimos6Meses(mesFim);
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

    const rec6ComCrescimento = recebimento6Meses.map((item, i) => {
      if (i === 0) return { ...item, crescimento: 0 };
      const prev = recebimento6Meses[i - 1].valor;
      const crescimento = prev > 0 ? Number((((item.valor - prev) / prev) * 100).toFixed(1)) : 0;
      return { ...item, crescimento };
    });

    // ─── Gráfico: Faturamento & Crescimento ─────────────────────────────────
    const faturamento6Meses = rec6ComCrescimento;

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
      where: buildWhere("RECEITAS_VAR"),
    });

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
