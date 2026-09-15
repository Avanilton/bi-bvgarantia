import { NextResponse } from "next/server";
import pool from "@/lib/mysql";

const ID_EMPRESA = Number(process.env.ID_EMPRESA ?? 75);

// GET /api/debug — diagnóstico do banco MySQL
export async function GET() {
  try {
    // 1. Conta total de boletos
    const [total] = await pool.query(
      `SELECT COUNT(*) as total FROM TBBOLETO WHERE IDEMPRESA = ?`, [ID_EMPRESA]
    ) as any[];

    // 2. Verifica tipo das colunas PAGO e CANCELADO
    const [cols] = await pool.query(
      `SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'TBBOLETO'
       AND COLUMN_NAME IN ('PAGO','CANCELADO','TOTAL','DATAVECTO','DATAPGTO','IDEMPRESA')`
    ) as any[];

    // 3. Amostra de 5 boletos sem filtro de empresa
    const [sample] = await pool.query(
      `SELECT IDBOLETO, IDEMPRESA, PAGO, CANCELADO, TOTAL, DATAVECTO, DATAPGTO, ORIGEM
       FROM TBBOLETO LIMIT 5`
    ) as any[];

    // 4. Amostra de 5 boletos da empresa 75
    const [sample75] = await pool.query(
      `SELECT IDBOLETO, IDEMPRESA, PAGO, CANCELADO, TOTAL, DATAVECTO, DATAPGTO, ORIGEM
       FROM TBBOLETO WHERE IDEMPRESA = ? LIMIT 5`, [ID_EMPRESA]
    ) as any[];

    // 5. Quantos boletos não pagos existem (sem filtro de data)
    const [naoPagos] = await pool.query(
      `SELECT COUNT(*) as total, SUM(TOTAL) as soma FROM TBBOLETO 
       WHERE IDEMPRESA = ? AND PAGO = 0 AND CANCELADO = 0`, [ID_EMPRESA]
    ) as any[];

    // 6. Quantos boletos PAGO=false (comparação bit)
    const [naoPagosBit] = await pool.query(
      `SELECT COUNT(*) as total FROM TBBOLETO 
       WHERE IDEMPRESA = ? AND PAGO = b'0' AND CANCELADO = b'0'`, [ID_EMPRESA]
    ) as any[];

    // 7. Valores distintos de PAGO
    const [pagoDistinct] = await pool.query(
      `SELECT DISTINCT PAGO, CANCELADO, COUNT(*) as qtd 
       FROM TBBOLETO WHERE IDEMPRESA = ? 
       GROUP BY PAGO, CANCELADO LIMIT 10`, [ID_EMPRESA]
    ) as any[];

    // 8. Imoveis disponíveis
    const [imoveis] = await pool.query(
      `SELECT IDIMOVEL, NOMEFANTASIA FROM TBIMOVEL WHERE IDEMPRESA = ? LIMIT 10`, [ID_EMPRESA]
    ) as any[];

    return NextResponse.json({
      totalBoletos: (total as any[])[0]?.total,
      colunas: cols,
      amostraGeral: sample,
      amostraEmpresa75: sample75,
      naoPagosEmpresa75: (naoPagos as any[])[0],
      naoPagosBit: (naoPagosBit as any[])[0]?.total,
      pagoDistinct: pagoDistinct,
      imoveis: imoveis,
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
