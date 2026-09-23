import { NextResponse } from "next/server";
import pool from "@/lib/mysql";

const ID_EMPRESA = Number(process.env.ID_EMPRESA ?? 75);

// GET /api/condominios — retorna lista de condomínios da TBIMOVEL
export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT idimovel AS IDIMOVEL, nomefantasia AS NOMEFANTASIA
       FROM TBIMOVEL
       WHERE idEmpresa = ?
       ORDER BY nomefantasia`,
      [ID_EMPRESA]
    );
    return NextResponse.json({ condominios: rows });
  } catch (err: any) {
    console.error("Erro ao buscar condomínios:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
