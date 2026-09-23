import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/condominios — retorna lista de condomínios baseada nos dados do snapshot atual
export async function GET() {
  try {
    const condominios = await prisma.kpiDiario.findMany({
      select: {
        idImovel: true,
        nomeImovel: true,
      },
      distinct: ['idImovel'],
      orderBy: {
        nomeImovel: 'asc'
      }
    });

    const rows = condominios.map(c => ({
      IDIMOVEL: c.idImovel,
      NOMEFANTASIA: c.nomeImovel
    }));

    return NextResponse.json({ condominios: rows });
  } catch (err: any) {
    console.error("Erro ao buscar condomínios:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
