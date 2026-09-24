// conferencia_coqueiros.js
// Compara PDF de inadimplência (idimovel=970) com o banco de dados Novacorp
// Uso: node conferencia_coqueiros.js

process.env.MYSQL_HOST     = "sistemasnovacorp.com.br";
process.env.MYSQL_PORT     = "5643";
process.env.MYSQL_DATABASE = "novacorpconect";
process.env.MYSQL_USER     = "Intelligence";
process.env.MYSQL_PASSWORD = "@bv2026@";

const fs    = require("fs");
const pdf   = require("pdf-parse");
const mysql = require("mysql2/promise");

const PDF_PATH  = "C:/Users/Administrador/Downloads/coqueiros.pdf";
const ID_EMPRESA = 75;
const ID_IMOVEL  = 970;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function parseBRL(str) {
  if (!str) return null;
  // "1.234,56" → 1234.56
  const s = str.replace(/\./g, "").replace(",", ".");
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function fmtBRL(v) {
  if (v == null) return "—";
  return "R$ " + Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function roundCents(v) {
  return Math.round((v || 0) * 100) / 100;
}

// ─────────────────────────────────────────────
// 1. Lê e parseia o PDF
// ─────────────────────────────────────────────
async function extrairDadosPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  const raw  = data.text;

  console.log("\n======== TEXTO BRUTO DO PDF ========");
  console.log(raw);
  console.log("======== FIM DO TEXTO BRUTO ========\n");

  // Tenta extrair linhas com padrão: data, descrição, valor
  // Padrões comuns em relatórios de inadimplência:
  //   "09/2026   Condomínio   R$ 343,24"
  //   "2026-09   nome         343,24"
  const linhas = raw.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  // Retorna texto bruto para análise manual também
  return { raw, linhas };
}

// ─────────────────────────────────────────────
// 2. Busca dados do banco para idimovel=970
// ─────────────────────────────────────────────
async function buscarDadosBanco(conn) {
  // Busca TODOS os boletos não pagos/não cancelados do imóvel 970
  // sem restrição de data para ver o quadro completo
  const [rows] = await conn.query(
    `SELECT idboleto, idcliente, pago, cancelado, origem,
            total, valorparc,
            dataVecto, dataPgto,
            juros, correcao, multa, encargo, tarifaBancaria,
            DATE_FORMAT(dataVecto, '%Y-%m') AS mesRef
     FROM TBBOLETO
     WHERE idEmpresa = ?
       AND idimovel  = ?
     ORDER BY dataVecto DESC
     LIMIT 200`,
    [ID_EMPRESA, ID_IMOVEL]
  );
  return rows;
}

async function buscarInadimplenciaBanco(conn) {
  // Exatamente a query do BI
  const [rows] = await conn.query(
    `SELECT b.idboleto, b.idcliente,
            b.pago, b.cancelado, b.origem,
            b.total, b.valorparc,
            b.dataVecto, b.dataPgto,
            b.juros, b.correcao, b.multa, b.encargo, b.tarifaBancaria,
            DATE_FORMAT(b.dataVecto, '%Y-%m') AS mesRef,
            SUM(IFNULL(b.valorparc, 0)) OVER (PARTITION BY DATE_FORMAT(b.dataVecto,'%Y-%m')) AS somaValorMes
     FROM TBBOLETO b
     WHERE b.idEmpresa = ?
       AND b.idimovel  = ?
       AND b.pago      = 0
       AND b.cancelado = 0
       AND b.dataVecto < CURDATE()
     ORDER BY b.dataVecto DESC`,
    [ID_EMPRESA, ID_IMOVEL]
  );
  return rows;
}

async function buscarSumarioBanco(conn) {
  // A query exata que o BI usa (agregada por mês, como aparece no card)
  const [rows] = await conn.query(
    `SELECT DATE_FORMAT(b.dataVecto, '%Y-%m') AS mesRef,
            SUM(IFNULL(b.valorparc, 0))       AS valor,
            SUM(IFNULL(b.juros, 0))           AS juros,
            SUM(IFNULL(b.correcao, 0))        AS correcao,
            SUM(IFNULL(b.multa, 0))           AS multa,
            SUM(IFNULL(b.encargo, 0))         AS encargo,
            SUM(IFNULL(b.tarifaBancaria, 0))  AS tarifaBoleto,
            COUNT(*)                          AS qtdBoletos
     FROM TBBOLETO b
     WHERE b.idEmpresa = ?
       AND b.idimovel  = ?
       AND b.pago      = 0
       AND b.cancelado = 0
       AND b.dataVecto < CURDATE()
     GROUP BY mesRef
     HAVING valor > 0
     ORDER BY mesRef DESC`,
    [ID_EMPRESA, ID_IMOVEL]
  );
  return rows;
}

// ─────────────────────────────────────────────
// 3. Main
// ─────────────────────────────────────────────
async function main() {
  console.log(`\n${"=".repeat(70)}`);
  console.log("  CONFERÊNCIA: PDF Coqueiros (idimovel=970) × Banco Novacorp");
  console.log(`${"=".repeat(70)}\n`);

  // PDF
  console.log("📄 Lendo PDF...");
  const { raw, linhas } = await extrairDadosPDF(PDF_PATH);

  // Banco
  console.log("🗄️  Conectando ao banco...");
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    timezone: "+00:00",
  });

  const [todosBoletos, inadBoletos, sumarioBanco] = await Promise.all([
    buscarDadosBanco(conn),
    buscarInadimplenciaBanco(conn),
    buscarSumarioBanco(conn),
  ]);

  await conn.end();

  // ── Exibe resumo do banco ──
  console.log("\n📊 SUMÁRIO INADIMPLÊNCIA (BI) — idimovel=970:");
  console.log("   (query exata do route.ts, agrupada por mês)\n");
  let totalBanco = 0;
  sumarioBanco.forEach(r => {
    const v = roundCents(r.valor);
    totalBanco += v;
    console.log(`  ${r.mesRef}  →  ${fmtBRL(v).padStart(12)}   (${r.qtdBoletos} boleto(s))`);
  });
  console.log(`  ${"─".repeat(40)}`);
  console.log(`  TOTAL BANCO:   ${fmtBRL(totalBanco).padStart(12)}`);

  // ── Exibe boletos individuais da inadimplência ──
  console.log("\n\n📋 BOLETOS INDIVIDUAIS NA INADIMPLÊNCIA (banco):\n");
  console.log("  idboleto  | mesRef  | valorparc  | total      | pago | canc | origem | dataVecto");
  console.log("  " + "─".repeat(85));
  inadBoletos.forEach(b => {
    const vp = fmtBRL(b.valorparc).padStart(11);
    const vt = fmtBRL(b.total).padStart(11);
    console.log(
      `  ${String(b.idboleto).padEnd(9)} | ${b.mesRef} | ${vp} | ${vt} | ${b.pago}    | ${b.cancelado}    | ${String(b.origem).padEnd(6)} | ${String(b.dataVecto).substring(0,10)}`
    );
  });

  // ── Linhas do PDF para referência ──
  console.log("\n\n📄 LINHAS DO PDF (para conferência manual):\n");
  linhas.forEach((l, i) => console.log(`  [${i+1}] ${l}`));

  // ── Totaliza o PDF se encontrar valores ──
  console.log("\n\n💡 Tente identificar nos valores acima as divergências.");
  console.log("   Se o PDF usar formato 'MM/AAAA  valor', rode novamente com parseamento personalizado.\n");
}

main().catch(err => {
  console.error("\n💥 Erro:", err.message);
  process.exit(1);
});
