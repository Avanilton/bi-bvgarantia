import { NextResponse } from "next/server";
import pool from "@/lib/mysql";
import { prisma } from "@/lib/prisma";

const ID_EMPRESA = Number(process.env.ID_EMPRESA ?? 75);

export async function POST() {
  const inicio = Date.now();

  const snap = await prisma.snapshotMeta.create({
    data: { tipoSnap: "MANUAL", status: "PROCESSANDO" },
  });

  try {
    // Nota: colunas no MySQL usam camelCase (mapeamento Hibernate JPA)
    // idEmpresa, idimovel, pago, cancelado, total, dataVecto, dataPgto, origem, tarifaBancaria, etc.
    // TBIMOVEL: idEmpresa, idimovel, nomefantasia
    // TBBOLETO: idboleto, idEmpresa, idimovel, idcliente, pago, cancelado, total, dataVecto, dataPgto, origem, juros, correcao, multa, encargo, tarifaBancaria

    // 1. INADIMPLÊNCIA: vencidos antes de hoje, não pagos e não cancelados
    const [inadRows] = await pool.query(
      `SELECT b.idimovel, i.nomefantasia,
              DATE_FORMAT(b.dataVecto, '%Y-%m')   AS mesRef,
              SUM(IFNULL(b.valorparc, 0))         AS valor,
              SUM(IFNULL(b.juros, 0))             AS juros,
              SUM(IFNULL(b.correcao, 0))          AS correcao,
              SUM(IFNULL(b.multa, 0))             AS multa,
              SUM(IFNULL(b.encargo, 0))           AS encargo,
              SUM(IFNULL(b.tarifaBancaria, 0))    AS tarifaBoleto
       FROM TBBOLETO b
       JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
       WHERE b.idEmpresa  = ?
         AND b.pago       = 0
         AND b.cancelado  = 0
         AND b.valorparc  > 0
         AND b.dataVecto  < CURDATE()
       GROUP BY b.idimovel, i.nomefantasia, mesRef
       HAVING valor > 0`,
      [ID_EMPRESA]
    ) as any[];

    // 2. RECEBIMENTO (D-1): pagos no mês atual, até ontem (D-1)
    const [recRows] = await pool.query(
      `SELECT b.idimovel, i.nomefantasia,
              DATE_FORMAT(b.dataPgto, '%Y-%m')    AS mesRef,
              SUM(IFNULL(b.valorPago, 0))         AS valor,
              SUM(IFNULL(b.juros, 0))             AS juros,
              SUM(IFNULL(b.correcao, 0))          AS correcao,
              SUM(IFNULL(b.multa, 0))             AS multa,
              SUM(IFNULL(b.encargo, 0))           AS encargo,
              SUM(IFNULL(b.tarifaBancaria, 0))    AS tarifaBoleto
       FROM TBBOLETO b
       JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
       WHERE b.idEmpresa  = ?
         AND b.cancelado  = 0
         AND b.valorPago  > 0
         AND b.dataPgto   IS NOT NULL
         AND b.dataPgto   >= DATE_SUB(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 5 MONTH)
         AND b.dataPgto   <= CURDATE()
       GROUP BY b.idimovel, i.nomefantasia, mesRef
       HAVING valor > 0`,
      [ID_EMPRESA]
    ) as any[];

    // 3. JURÍDICOS NÃO PAGOS: origem = 6
    const [jurRows] = await pool.query(
      `SELECT b.idimovel, i.nomefantasia,
              DATE_FORMAT(b.dataVecto, '%Y-%m')   AS mesRef,
              SUM(IFNULL(b.total, 0))             AS valor,
              SUM(IFNULL(b.juros, 0))             AS juros,
              SUM(IFNULL(b.correcao, 0))          AS correcao,
              SUM(IFNULL(b.multa, 0))             AS multa,
              SUM(IFNULL(b.encargo, 0))           AS encargo,
              SUM(IFNULL(b.tarifaBancaria, 0))    AS tarifaBoleto
       FROM TBBOLETO b
       JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
       WHERE b.idEmpresa  = ?
         AND b.pago       = 0
         AND b.cancelado  = 0
         AND b.origem     = 6
         AND b.valorparc  > 0
         AND b.dataVecto  < CURDATE()
       GROUP BY b.idimovel, i.nomefantasia, mesRef
       HAVING valor > 0`,
      [ID_EMPRESA]
    ) as any[];

    // 4. AMIGÁVEL NÃO PAGOS: origem = 5
    const [amiRows] = await pool.query(
      `SELECT b.idimovel, i.nomefantasia,
              DATE_FORMAT(b.dataVecto, '%Y-%m')   AS mesRef,
              SUM(IFNULL(b.total, 0))             AS valor,
              SUM(IFNULL(b.juros, 0))             AS juros,
              SUM(IFNULL(b.correcao, 0))          AS correcao,
              SUM(IFNULL(b.multa, 0))             AS multa,
              SUM(IFNULL(b.encargo, 0))           AS encargo,
              SUM(IFNULL(b.tarifaBancaria, 0))    AS tarifaBoleto
       FROM TBBOLETO b
       JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
       WHERE b.idEmpresa  = ?
         AND b.pago       = 0
         AND b.cancelado  = 0
         AND b.origem     = 5
         AND b.valorparc  > 0
         AND b.dataVecto  < CURDATE()
       GROUP BY b.idimovel, i.nomefantasia, mesRef
       HAVING valor > 0`,
      [ID_EMPRESA]
    ) as any[];

    // 5. RECEITAS VARIÁVEIS: somas por mês de pagamento
    const [recVarRows] = await pool.query(
      `SELECT b.idimovel, i.nomefantasia,
              DATE_FORMAT(b.dataPgto, '%Y-%m')    AS mesRef,
              SUM(IFNULL(b.correcao, 0))          AS correcao,
              SUM(IFNULL(b.encargo, 0))           AS encargo,
              SUM(IFNULL(b.juros, 0))             AS juros,
              SUM(IFNULL(b.multa, 0))             AS multa,
              SUM(IFNULL(b.tarifaBancaria, 0))    AS tarifaBoleto,
              (SUM(IFNULL(b.correcao, 0)) + SUM(IFNULL(b.encargo, 0))
               + SUM(IFNULL(b.juros, 0)) + SUM(IFNULL(b.multa, 0))
               + SUM(IFNULL(b.tarifaBancaria, 0))) AS valor
       FROM TBBOLETO b
       JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
       WHERE b.idEmpresa  = ?
         AND b.pago       = 1
         AND b.cancelado  = 0
         AND b.dataPgto   IS NOT NULL
         AND b.dataPgto   < CURDATE()
       GROUP BY b.idimovel, i.nomefantasia, mesRef
       HAVING valor > 0`,
      [ID_EMPRESA]
    ) as any[];

    // ─── Grava no SQLite ──────────────────────────────────────────────────────
    await prisma.kpiDiario.deleteMany({});

    const norm = (rows: any) => Array.isArray(rows) ? rows : [];

    const toInsert = (rows: any[], tipo: string) =>
      norm(rows).map((r: any) => ({
        snapshotId: snap.id,
        idImovel:    Number(r.idimovel   ?? r.IDIMOVEL   ?? 0),
        nomeImovel:  String(r.nomefantasia ?? r.NOMEFANTASIA ?? ""),
        tipo,
        mesRef:      String(r.mesRef ?? ""),
        valor:       Number(r.valor       ?? 0),
        juros:       Number(r.juros       ?? 0),
        correcao:    Number(r.correcao    ?? 0),
        multa:       Number(r.multa       ?? 0),
        encargo:     Number(r.encargo     ?? 0),
        tarifaBoleto:Number(r.tarifaBoleto?? 0),
      }));

    const allInserts = [
      ...toInsert(inadRows, "INADIMPLENCIA"),
      ...toInsert(recRows,  "RECEBIMENTO"),
      ...toInsert(jurRows,  "JURIDICOS"),
      ...toInsert(amiRows,  "AMIGAVEL"),
      ...toInsert(recVarRows,"RECEITAS_VAR"),
    ];

    if (allInserts.length > 0) {
      await prisma.kpiDiario.createMany({ data: allInserts });
    }

    const msg = `Inseridos: inadimpl=${norm(inadRows).length}, receb=${norm(recRows).length}, jur=${norm(jurRows).length}, ami=${norm(amiRows).length}, recVar=${norm(recVarRows).length} | Total: ${allInserts.length} registros`;

    await prisma.snapshotMeta.update({
      where: { id: snap.id },
      data: { status: "OK", duracaoMs: Date.now() - inicio, mensagem: msg },
    });

    return NextResponse.json({ ok: true, snapshotId: snap.id, duracaoMs: Date.now() - inicio, msg });
  } catch (err: any) {
    console.error("Erro snapshot:", err.message);
    await prisma.snapshotMeta.update({
      where: { id: snap.id },
      data: { status: "ERRO", mensagem: err.message },
    });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const snaps = await prisma.snapshotMeta.findMany({
    orderBy: { criadoEm: "desc" },
    take: 10,
  });
  return NextResponse.json({ snapshots: snaps });
}
