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

// GET /api/dashboard/detalhes?tipo=INADIMPLENCIA&condominio=X&dataInicio=...
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get("tipo") || "INADIMPLENCIA";
  const condominioParam = searchParams.get("condominio");
  const dataInicio = searchParams.get("dataInicio");
  const dataFim = searchParams.get("dataFim");

  const mesInicio = dataInicio ? dataInicio.slice(0, 7) : null;
  const mesFim = dataFim ? dataFim.slice(0, 7) : null;

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

    // Filtro base do SQLite
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

    // 2. Agrupa valores gravados no SQLite por condomínio
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

    // 3. Monta listas comValor e zerados
    const comValor: { idImovel: number; nomeImovel: string; valor: number }[] = [];
    const zerados: { idImovel: number; nomeImovel: string; valor: number }[] = [];

    // Se temos lista do MySQL, cruzamos com ela
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
      // Fallback usando apenas dados do SQLite
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

    // Se houve filtro de condomínio específico nonde zerados só deve aparecer se bater
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
