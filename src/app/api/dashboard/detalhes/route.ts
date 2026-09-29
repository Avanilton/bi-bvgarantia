import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import pool from "@/lib/mysql";

const ID_EMPRESA = Number(process.env.ID_EMPRESA ?? 75);

const TITULOS: Record<string, string> = {
  INADIMPLENCIA: "Detalhes da Inadimplência",
  RECEBIMENTO: "Detalhes do Recebimento",
  JURIDICOS: "Detalhes dos Jurídicos não pagos",
  AMIGAVEL: "Detalhes do Amigável não pagos",
};

// Tipos que filtram por dataVecto; os demais usam dataPgto
const TIPOS_DATAVECTO = new Set(["INADIMPLENCIA", "JURIDICOS", "AMIGAVEL"]);

// GET /api/dashboard/detalhes?tipo=INADIMPLENCIA&condominio=X&dataInicio=...&dataFim=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get("tipo") || "INADIMPLENCIA";
  const condominioParam = searchParams.get("condominio");
  const dataInicio = searchParams.get("dataInicio");
  const dataFim = searchParams.get("dataFim");

  const mesInicio = dataInicio ? dataInicio.slice(0, 7) : null;
  const mesFim = dataFim ? dataFim.slice(0, 7) : null;

  const condoIdNum = condominioParam ? Number(condominioParam) : null;
  const condoSqlFragment =
    condoIdNum && !isNaN(condoIdNum) ? `AND b.idimovel = ${condoIdNum}` : "";

  try {
    // 1. Busca condomínios ativos da TBIMOVEL no MySQL para mapear todos os condomínios
    let todosCondominios: { idimovel: number; nomefantasia: string }[] = [];
    try {
      const [rows] = await pool.query(
        `SELECT idimovel, nomefantasia FROM TBIMOVEL WHERE idEmpresa = ? ORDER BY nomefantasia`,
        [ID_EMPRESA]
      ) as any[];
      todosCondominios = rows || [];
    } catch (e) {
      console.error("Erro MySQL TBIMOVEL em detalhes:", e);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Com filtro de data: busca direto no MySQL com o campo correto por tipo
    // ═══════════════════════════════════════════════════════════════════════════
    if (dataInicio && dataFim) {
      // Determina campo de data conforme o tipo de KPI
      const campoData = TIPOS_DATAVECTO.has(tipo) ? "b.dataVecto" : "b.dataPgto";

      // Monta query específica por tipo
      let sqlQuery = "";
      let sqlParams: any[] = [ID_EMPRESA, dataInicio, dataFim];

      if (tipo === "INADIMPLENCIA") {
        sqlQuery = `
          SELECT b.idimovel, i.nomefantasia,
                 SUM(IFNULL(b.valorparc, 0)) AS valor
          FROM TBBOLETO b
          JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
          WHERE b.idEmpresa = ?
            AND b.pago      = 0
            AND b.cancelado = 0
            AND b.valorparc > 0
            AND ${campoData} >= ?
            AND ${campoData} <= ?
            ${condoSqlFragment}
          GROUP BY b.idimovel, i.nomefantasia
          HAVING valor > 0`;
      } else if (tipo === "RECEBIMENTO") {
        sqlQuery = `
          SELECT b.idimovel, i.nomefantasia,
                 SUM(IFNULL(b.valorPago, 0)) AS valor
          FROM TBBOLETO b
          JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
          WHERE b.idEmpresa = ?
            AND b.cancelado = 0
            AND b.valorPago > 0
            AND ${campoData} IS NOT NULL
            AND ${campoData} >= ?
            AND ${campoData} <= ?
            ${condoSqlFragment}
          GROUP BY b.idimovel, i.nomefantasia
          HAVING valor > 0`;
      } else if (tipo === "JURIDICOS") {
        sqlQuery = `
          SELECT b.idimovel, i.nomefantasia,
                 SUM(IFNULL(b.total, 0)) AS valor
          FROM TBBOLETO b
          JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
          WHERE b.idEmpresa = ?
            AND b.pago      = 0
            AND b.cancelado = 0
            AND b.origem    = 6
            AND b.valorparc > 0
            AND ${campoData} >= ?
            AND ${campoData} <= ?
            ${condoSqlFragment}
          GROUP BY b.idimovel, i.nomefantasia
          HAVING valor > 0`;
      } else if (tipo === "AMIGAVEL") {
        sqlQuery = `
          SELECT b.idimovel, i.nomefantasia,
                 SUM(IFNULL(b.total, 0)) AS valor
          FROM TBBOLETO b
          JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
          WHERE b.idEmpresa = ?
            AND b.pago      = 0
            AND b.cancelado = 0
            AND b.origem    = 5
            AND b.valorparc > 0
            AND ${campoData} >= ?
            AND ${campoData} <= ?
            ${condoSqlFragment}
          GROUP BY b.idimovel, i.nomefantasia
          HAVING valor > 0`;
      }

      if (!sqlQuery) {
        return NextResponse.json({ error: `Tipo desconhecido: ${tipo}` }, { status: 400 });
      }

      const [mysqlRows] = await pool.query(sqlQuery, sqlParams) as any[];
      const rows = (mysqlRows as any[]) || [];

      // Mapa de valores por idimovel
      const mapaValores = new Map<string, number>();
      for (const r of rows) {
        mapaValores.set(String(r.idimovel), Number(r.valor ?? 0));
      }

      // Cruza com lista completa de condomínios
      const comValor: { idImovel: number; nomeImovel: string; valor: number }[] = [];
      const zerados: { idImovel: number; nomeImovel: string; valor: number }[] = [];

      if (todosCondominios.length > 0) {
        for (const c of todosCondominios) {
          // Se há filtro de condomínio específico, só inclui ele
          if (condoIdNum && !isNaN(condoIdNum) && c.idimovel !== condoIdNum) continue;
          const val = mapaValores.get(String(c.idimovel)) || 0;
          if (val > 0) {
            comValor.push({ idImovel: c.idimovel, nomeImovel: c.nomefantasia, valor: val });
          } else {
            zerados.push({ idImovel: c.idimovel, nomeImovel: c.nomefantasia, valor: 0 });
          }
        }
      } else {
        // Fallback: apenas os que têm valor
        for (const r of rows) {
          comValor.push({
            idImovel: Number(r.idimovel),
            nomeImovel: String(r.nomefantasia ?? ""),
            valor: Number(r.valor ?? 0),
          });
        }
      }

      return NextResponse.json({
        tipo,
        titulo: TITULOS[tipo] || `Detalhes de ${tipo}`,
        comValor,
        zerados,
        totalComValor: comValor.length,
        totalZerados: zerados.length,
      });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Sem filtro de data: usa cache do PostgreSQL (snapshot)
    // ═══════════════════════════════════════════════════════════════════════════

    // Filtro base do PostgreSQL
    const where: any = { tipo };

    if (condominioParam) {
      const numId = Number(condominioParam);
      if (!isNaN(numId) && numId > 0) {
        where.idImovel = numId;
      } else {
        where.nomeImovel = { contains: condominioParam };
      }
    }

    if (mesInicio && mesFim) {
      where.mesRef = { gte: mesInicio, lte: mesFim };
    }

    // Agrupa valores gravados no PostgreSQL por condomínio
    const agrupados = await prisma.kpiDiario.groupBy({
      by: ["idImovel", "nomeImovel"],
      _sum: { valor: true },
      where,
    });

    const mapaValores = new Map<string, number>();
    for (const item of agrupados) {
      const key = String(item.idImovel || item.nomeImovel);
      mapaValores.set(key, (mapaValores.get(key) || 0) + (item._sum.valor || 0));
    }

    // Monta listas comValor e zerados
    const comValor: { idImovel: number; nomeImovel: string; valor: number }[] = [];
    const zerados: { idImovel: number; nomeImovel: string; valor: number }[] = [];

    if (todosCondominios.length > 0) {
      for (const c of todosCondominios) {
        const val = mapaValores.get(String(c.idimovel)) || 0;
        if (val > 0) {
          comValor.push({ idImovel: c.idimovel, nomeImovel: c.nomefantasia, valor: val });
        } else {
          zerados.push({ idImovel: c.idimovel, nomeImovel: c.nomefantasia, valor: 0 });
        }
      }
    } else {
      for (const item of agrupados) {
        const val = item._sum.valor || 0;
        if (val > 0) {
          comValor.push({
            idImovel: item.idImovel,
            nomeImovel: item.nomeImovel,
            valor: val,
          });
        }
      }
    }

    let finalComValor = comValor;
    let finalZerados = zerados;

    if (condominioParam && !isNaN(Number(condominioParam))) {
      const num = Number(condominioParam);
      finalComValor = comValor.filter((c) => c.idImovel === num);
      finalZerados = zerados.filter((c) => c.idImovel === num);
    }

    return NextResponse.json({
      tipo,
      titulo: TITULOS[tipo] || `Detalhes de ${tipo}`,
      comValor: finalComValor,
      zerados: finalZerados,
      totalComValor: finalComValor.length,
      totalZerados: finalZerados.length,
    });
  } catch (err: any) {
    console.error("Erro na API /api/dashboard/detalhes:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
