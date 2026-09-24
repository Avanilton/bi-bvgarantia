// validar_recebimento.js
// Testa a nova query de Recebimento (mes cheio, valorpgto > 0)
// e compara com o valor esperado: R$ 45.532.785,90

process.env.MYSQL_HOST     = "sistemasnovacorp.com.br";
process.env.MYSQL_PORT     = "5643";
process.env.MYSQL_DATABASE = "novacorpconect";
process.env.MYSQL_USER     = "Intelligence";
process.env.MYSQL_PASSWORD = "@bv2026@";

const mysql = require("mysql2/promise");

const ID_EMPRESA    = 75;
const VALOR_ESPERADO = 45532785.90;

function rc(v)  { return Math.round((parseFloat(v)||0)*100)/100; }
function fmt(v) {
  const s = rc(v).toFixed(2).replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g,".");
  return `R$ ${s}`;
}
const SEP = "=".repeat(72);

async function main() {
  console.log(`\n${SEP}`);
  console.log("  VALIDACAO: Card RECEBIMENTO");
  console.log(`  Valor esperado: ${fmt(VALOR_ESPERADO)}`);
  console.log(`${SEP}\n`);

  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    timezone: "+00:00",
    connectTimeout: 30000,
  });
  console.log("Conectado!\n");

  // ── 1. Descobre colunas disponíveis no TBBOLETO ───────────────────────────
  console.log("Verificando colunas de TBBOLETO...");
  const [cols] = await conn.query(`SHOW COLUMNS FROM TBBOLETO LIKE '%pgto%'`);
  const [colsValor] = await conn.query(`SHOW COLUMNS FROM TBBOLETO LIKE '%valor%'`);
  console.log("  Colunas *pgto*:");
  cols.forEach(c => console.log(`    ${c.Field} (${c.Type})`));
  console.log("  Colunas *valor*:");
  colsValor.forEach(c => console.log(`    ${c.Field} (${c.Type})`));

  // ── 2. Query ATUAL do BI (D-1) ────────────────────────────────────────────
  console.log("\n--- Query ATUAL (D-1, como está no route.ts) ---");
  const [recAtual] = await conn.query(`
    SELECT COUNT(*) AS qtd,
           SUM(IFNULL(b.total, 0))   AS valor_total,
           SUM(IFNULL(b.valorparc,0)) AS valor_parc
    FROM TBBOLETO b
    WHERE b.idEmpresa = ?
      AND b.pago      = 1
      AND b.cancelado = 0
      AND b.dataPgto  IS NOT NULL
      AND b.dataPgto  >= DATE_FORMAT(NOW(), '%Y-%m-01')
      AND b.dataPgto  <= DATE_SUB(CURDATE(), INTERVAL 1 DAY)
  `, [ID_EMPRESA]);
  const ra = recAtual[0];
  console.log(`  Qtd boletos:    ${ra.qtd}`);
  console.log(`  Soma b.total:   ${fmt(ra.valor_total)}`);
  console.log(`  Soma valorparc: ${fmt(ra.valor_parc)}`);
  console.log(`  Diff vs esperado (total):   ${fmt(rc(ra.valor_total   - VALOR_ESPERADO))}`);
  console.log(`  Diff vs esperado (valorparc):${fmt(rc(ra.valor_parc   - VALOR_ESPERADO))}`);

  // ── 3. Nova query (mês cheio, sem D-1) ───────────────────────────────────
  console.log("\n--- Query NOVA (mes cheio, sem D-1, cancelado=0) ---");
  const [recNovo] = await conn.query(`
    SELECT COUNT(*) AS qtd,
           SUM(IFNULL(b.total, 0))    AS valor_total,
           SUM(IFNULL(b.valorparc,0)) AS valor_parc
    FROM TBBOLETO b
    WHERE b.idEmpresa = ?
      AND b.cancelado = 0
      AND b.dataPgto  IS NOT NULL
      AND b.dataPgto  >= DATE_FORMAT(NOW(), '%Y-%m-01')
      AND b.dataPgto  <= CURDATE()
  `, [ID_EMPRESA]);
  const rn = recNovo[0];
  console.log(`  Qtd boletos:    ${rn.qtd}`);
  console.log(`  Soma b.total:   ${fmt(rn.valor_total)}`);
  console.log(`  Soma valorparc: ${fmt(rn.valor_parc)}`);
  console.log(`  Diff vs esperado (total):    ${fmt(rc(rn.valor_total  - VALOR_ESPERADO))}`);
  console.log(`  Diff vs esperado (valorparc): ${fmt(rc(rn.valor_parc  - VALOR_ESPERADO))}`);

  // ── 4. Com filtro valorpgto > 0 (se existir a coluna) ────────────────────
  const temValorpgto = cols.some(c => c.Field.toLowerCase() === "valorpgto") ||
                       colsValor.some(c => c.Field.toLowerCase() === "valorpgto");

  if (temValorpgto) {
    console.log("\n--- Query com valorpgto > 0 (mes cheio) ---");
    const [recVpgto] = await conn.query(`
      SELECT COUNT(*) AS qtd,
             SUM(IFNULL(b.total, 0))    AS valor_total,
             SUM(IFNULL(b.valorparc,0)) AS valor_parc,
             SUM(IFNULL(b.valorpgto,0)) AS valor_pgto
      FROM TBBOLETO b
      WHERE b.idEmpresa = ?
        AND b.cancelado = 0
        AND b.dataPgto  IS NOT NULL
        AND b.valorpgto > 0
        AND b.dataPgto  >= DATE_FORMAT(NOW(), '%Y-%m-01')
        AND b.dataPgto  <= CURDATE()
    `, [ID_EMPRESA]);
    const rv = recVpgto[0];
    console.log(`  Qtd boletos:    ${rv.qtd}`);
    console.log(`  Soma b.total:   ${fmt(rv.valor_total)}`);
    console.log(`  Soma valorparc: ${fmt(rv.valor_parc)}`);
    console.log(`  Soma valorpgto: ${fmt(rv.valor_pgto)}`);
    console.log(`  Diff vs esperado (total):    ${fmt(rc(rv.valor_total - VALOR_ESPERADO))}`);
    console.log(`  Diff vs esperado (valorparc): ${fmt(rc(rv.valor_parc - VALOR_ESPERADO))}`);
    console.log(`  Diff vs esperado (valorpgto): ${fmt(rc(rv.valor_pgto - VALOR_ESPERADO))}`);
  } else {
    console.log("\n  [INFO] Coluna 'valorpgto' nao encontrada em TBBOLETO.");
    console.log("  Tentando alternativas...\n");
    // Tenta com pago=1 (substituto do valorpgto > 0)
    const [recPago] = await conn.query(`
      SELECT COUNT(*) AS qtd,
             SUM(IFNULL(b.total, 0))    AS valor_total,
             SUM(IFNULL(b.valorparc,0)) AS valor_parc
      FROM TBBOLETO b
      WHERE b.idEmpresa = ?
        AND b.pago      = 1
        AND b.cancelado = 0
        AND b.dataPgto  IS NOT NULL
        AND b.dataPgto  >= DATE_FORMAT(NOW(), '%Y-%m-01')
        AND b.dataPgto  <= CURDATE()
    `, [ID_EMPRESA]);
    const rp = recPago[0];
    console.log("--- pago=1, cancelado=0, mes cheio (CURDATE) ---");
    console.log(`  Qtd boletos:    ${rp.qtd}`);
    console.log(`  Soma b.total:   ${fmt(rp.valor_total)}`);
    console.log(`  Soma valorparc: ${fmt(rp.valor_parc)}`);
    console.log(`  Diff vs esperado (total):    ${fmt(rc(rp.valor_total - VALOR_ESPERADO))}`);
    console.log(`  Diff vs esperado (valorparc): ${fmt(rc(rp.valor_parc - VALOR_ESPERADO))}`);
  }

  // ── 5. Detalhe por dia do mês atual ──────────────────────────────────────
  console.log("\n--- Recebimento por dia do mes atual (pago=1, cancelado=0) ---");
  const [porDia] = await conn.query(`
    SELECT DATE(b.dataPgto)           AS dia,
           COUNT(*)                   AS qtd,
           SUM(IFNULL(b.total,0))     AS total,
           SUM(IFNULL(b.valorparc,0)) AS valorparc
    FROM TBBOLETO b
    WHERE b.idEmpresa = ?
      AND b.pago      = 1
      AND b.cancelado = 0
      AND b.dataPgto  >= DATE_FORMAT(NOW(), '%Y-%m-01')
      AND b.dataPgto  <= CURDATE()
    GROUP BY dia
    ORDER BY dia
  `, [ID_EMPRESA]);
  let acumTotal = 0, acumVp = 0;
  console.log(`  ${"Dia".padEnd(12)} | ${"Qtd".padStart(5)} | ${"Total".padStart(16)} | ${"Valorparc".padStart(16)} | ${"Acum.Total".padStart(18)}`);
  console.log(`  ${"─".repeat(78)}`);
  for (const r of porDia) {
    acumTotal = rc(acumTotal + rc(r.total));
    acumVp    = rc(acumVp    + rc(r.valorparc));
    console.log(`  ${String(r.dia).substring(0,10).padEnd(12)} | ${String(r.qtd).padStart(5)} | ${fmt(r.total).padStart(16)} | ${fmt(r.valorparc).padStart(16)} | ${fmt(acumTotal).padStart(18)}`);
  }
  console.log(`  ${"─".repeat(78)}`);
  console.log(`  ${"TOTAL".padEnd(12)} |       | ${fmt(acumTotal).padStart(16)} | ${fmt(acumVp).padStart(16)} |`);

  console.log(`\n  Valor esperado: ${fmt(VALOR_ESPERADO)}`);
  console.log(`  Diff (total vs esperado):    ${fmt(rc(acumTotal - VALOR_ESPERADO))}`);
  console.log(`  Diff (valorparc vs esperado): ${fmt(rc(acumVp - VALOR_ESPERADO))}`);

  await conn.end();
  console.log(`\n${SEP}\n`);
}

main().catch(e => { console.error("Erro:", e.message); process.exit(1); });
