// step2_conferencia.js
// Carrega boletos_pdf.json e compara com banco Novacorp (idimovel=970)
// Usa mysql2 que ja funciona bem no projeto.

process.env.MYSQL_HOST     = "sistemasnovacorp.com.br";
process.env.MYSQL_PORT     = "5643";
process.env.MYSQL_DATABASE = "novacorpconect";
process.env.MYSQL_USER     = "Intelligence";
process.env.MYSQL_PASSWORD = "@bv2026@";

const fs    = require("fs");
const mysql = require("mysql2/promise");

const ID_EMPRESA = 75;
const ID_IMOVEL  = 970;
const JSON_PATH  = "./boletos_pdf.json";

function rc(v)    { return Math.round((parseFloat(v) || 0) * 100) / 100; }
function fmtBRL(v){ return "R$ " + rc(v).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
const SEP = "=".repeat(80);

async function main() {
  // ── Carrega JSON do PDF ──────────────────────────────────────────────────
  const todosPDF    = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));
  const normaisPDF  = todosPDF.filter(b => !b.is_credito);
  const creditosPDF = todosPDF.filter(b => b.is_credito);
  const idsPDF      = todosPDF.map(b => b.idboleto);
  const idsNormSet  = new Set(normaisPDF.map(b => b.idboleto));

  console.log(`\n${SEP}`);
  console.log("  CONFERENCIA: PDF Coqueiros x Banco Novacorp (idimovel=970)");
  console.log(`  ${new Date().toLocaleString("pt-BR")}`);
  console.log(`${SEP}\n`);
  console.log(`PDF: ${normaisPDF.length} boletos normais + ${creditosPDF.length} creditos`);

  // ── Conecta ao banco ─────────────────────────────────────────────────────
  console.log("Conectando ao banco...");
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

  // ── Query 1: IDs do PDF no banco ─────────────────────────────────────────
  // Divide em lotes para o IN() não ser enorme
  const bancoPorId = {};
  const LOTE = 300;
  for (let i = 0; i < idsPDF.length; i += LOTE) {
    const lote = idsPDF.slice(i, i + LOTE);
    const [rows] = await conn.query(
      `SELECT idboleto, idcliente, pago, cancelado, origem,
              total, valorparc, dataVecto, dataPgto,
              DATE_FORMAT(dataVecto,'%Y-%m') AS mesRef
       FROM TBBOLETO
       WHERE idEmpresa=? AND idboleto IN (${lote.map(()=>"?").join(",")})`,
      [ID_EMPRESA, ...lote]
    );
    rows.forEach(r => { bancoPorId[r.idboleto] = r; });
    process.stdout.write(`  Lote ${Math.floor(i/LOTE)+1}: ${Object.keys(bancoPorId).length} encontrados\r`);
  }
  console.log(`\nBanco (pelos IDs do PDF): ${Object.keys(bancoPorId).length} boletos encontrados`);

  // ── Query 2: Inadimplencia do BI (query exata route.ts) ──────────────────
  console.log("Buscando inadimplencia do BI...");
  const [inadRows] = await conn.query(
    `SELECT idboleto, valorparc, dataVecto, DATE_FORMAT(dataVecto,'%Y-%m') AS mesRef
     FROM TBBOLETO
     WHERE idEmpresa=? AND idimovel=?
       AND pago=0 AND cancelado=0
       AND dataVecto < CURDATE()`,
    [ID_EMPRESA, ID_IMOVEL]
  );
  const biInadById = {};
  inadRows.forEach(r => { biInadById[r.idboleto] = r; });
  console.log(`BI inadimplencia: ${inadRows.length} boletos\n`);

  await conn.end();

  // ── Totais por mes ────────────────────────────────────────────────────────
  const pdfPorMes = {};
  normaisPDF.forEach(b => {
    if (!pdfPorMes[b.mes_ref]) pdfPorMes[b.mes_ref] = { valor: 0, qtd: 0 };
    pdfPorMes[b.mes_ref].valor = rc(pdfPorMes[b.mes_ref].valor + b.valor_pdf);
    pdfPorMes[b.mes_ref].qtd++;
  });

  const biPorMes = {};
  inadRows.forEach(r => {
    if (!biPorMes[r.mesRef]) biPorMes[r.mesRef] = { valor: 0, qtd: 0 };
    biPorMes[r.mesRef].valor = rc(biPorMes[r.mesRef].valor + rc(r.valorparc));
    biPorMes[r.mesRef].qtd++;
  });

  // ── Tabela comparativa ────────────────────────────────────────────────────
  console.log(`${SEP}`);
  console.log("  COMPARACAO POR MES  —  PDF vs BI");
  console.log(`${SEP}`);
  console.log(`  ${"Mes".padStart(7)} | ${"PDF Valor".padStart(15)} ${"Qtd".padStart(4)} | ${"BI Valor".padStart(15)} ${"Qtd".padStart(4)} | ${"Dif".padStart(15)} | Status`);
  console.log(`  ${"─".repeat(80)}`);

  const todosMeses = [...new Set([...Object.keys(pdfPorMes), ...Object.keys(biPorMes)])].sort().reverse();
  let tp = 0, tb = 0;
  const divMeses = [];

  for (const mes of todosMeses) {
    const vp = pdfPorMes[mes]?.valor || 0;
    const qp = pdfPorMes[mes]?.qtd   || 0;
    const vb = biPorMes[mes]?.valor  || 0;
    const qb = biPorMes[mes]?.qtd    || 0;
    const d  = rc(vp - vb);
    tp += vp; tb += vb;
    const st = Math.abs(d) < 0.02 ? "OK" : "*** DIVERGE ***";
    if (Math.abs(d) >= 0.02) divMeses.push(mes);
    console.log(`  ${mes.padStart(7)} | ${fmtBRL(vp).padStart(15)} ${String(qp).padStart(4)} | ${fmtBRL(vb).padStart(15)} ${String(qb).padStart(4)} | ${fmtBRL(d).padStart(15)} | ${st}`);
  }
  console.log(`  ${"─".repeat(80)}`);
  const td = rc(tp - tb);
  console.log(`  ${"TOTAL".padStart(7)} | ${fmtBRL(tp).padStart(15)}      | ${fmtBRL(tb).padStart(15)}      | ${fmtBRL(td).padStart(15)} |`);

  // ── No PDF mas NAO no BI ──────────────────────────────────────────────────
  const noPDFnaoBI = normaisPDF.filter(b => !biInadById[b.idboleto]);
  console.log(`\n${SEP}`);
  console.log(`  BOLETOS NO PDF mas NAO na inadimplencia do BI  (${noPDFnaoBI.length} itens)`);
  console.log(`${SEP}`);
  if (noPDFnaoBI.length) {
    // Agrupa por motivo para facilitar leitura
    const porMotivo = { PAGO: [], CANCELADO: [], NAO_ENCONTRADO: [], OUTRO: [] };
    for (const b of noPDFnaoBI) {
      const r = bancoPorId[b.idboleto];
      if (!r) { porMotivo.NAO_ENCONTRADO.push(b); continue; }
      if (r.pago == 1) { porMotivo.PAGO.push({b, r}); continue; }
      if (r.cancelado == 1) { porMotivo.CANCELADO.push({b, r}); continue; }
      porMotivo.OUTRO.push({b, r});
    }

    console.log(`\n  PAGOS (${porMotivo.PAGO.length}): estao no PDF como inadimplentes mas foram pagos no banco`);
    if (porMotivo.PAGO.length) {
      console.log(`  ${"idboleto".padStart(9)} | ${"mes".padStart(7)} | ${"dataPgto".padStart(12)} | ${"val_pdf".padStart(13)} | unidade`);
      console.log(`  ${"─".repeat(80)}`);
      for (const {b,r} of porMotivo.PAGO) {
        const dp = r.dataPgto ? String(r.dataPgto).substring(0,10) : "?";
        console.log(`  ${String(b.idboleto).padStart(9)} | ${b.mes_ref.padStart(7)} | ${dp.padStart(12)} | ${fmtBRL(b.valor_pdf).padStart(13)} | ${b.unidade}`);
      }
    }

    console.log(`\n  CANCELADOS (${porMotivo.CANCELADO.length}): estao no PDF mas estao cancelados no banco`);
    if (porMotivo.CANCELADO.length) {
      console.log(`  ${"idboleto".padStart(9)} | ${"mes".padStart(7)} | ${"val_pdf".padStart(13)} | unidade`);
      for (const {b,r} of porMotivo.CANCELADO) {
        console.log(`  ${String(b.idboleto).padStart(9)} | ${b.mes_ref.padStart(7)} | ${fmtBRL(b.valor_pdf).padStart(13)} | ${b.unidade}`);
      }
    }

    console.log(`\n  NAO ENCONTRADOS NO BANCO (${porMotivo.NAO_ENCONTRADO.length})`);
    if (porMotivo.NAO_ENCONTRADO.length) {
      for (const b of porMotivo.NAO_ENCONTRADO) {
        console.log(`  ${String(b.idboleto).padStart(9)} | ${b.mes_ref.padStart(7)} | ${fmtBRL(b.valor_pdf).padStart(13)} | ${b.unidade}`);
      }
    }

    console.log(`\n  OUTRO/INDEFINIDO (${porMotivo.OUTRO.length})`);
    if (porMotivo.OUTRO.length) {
      for (const {b,r} of porMotivo.OUTRO) {
        console.log(`  ${String(b.idboleto).padStart(9)} | ${b.mes_ref.padStart(7)} | pago=${r.pago} canc=${r.cancelado} | ${b.unidade}`);
      }
    }
  } else {
    console.log("  Nenhum.");
  }

  // ── No BI mas NAO no PDF ──────────────────────────────────────────────────
  const noBInaoDF = inadRows.filter(r => !idsNormSet.has(r.idboleto));
  console.log(`\n${SEP}`);
  console.log(`  BOLETOS na inadimplencia do BI mas NAO no PDF  (${noBInaoDF.length} itens)`);
  console.log(`${SEP}`);
  if (noBInaoDF.length) {
    console.log(`  ${"idboleto".padStart(9)} | ${"mesRef".padStart(7)} | ${"dataVecto".padStart(12)} | ${"valorparc".padStart(13)}`);
    console.log(`  ${"─".repeat(60)}`);
    for (const r of noBInaoDF.sort((a,b)=>a.idboleto-b.idboleto)) {
      console.log(`  ${String(r.idboleto).padStart(9)} | ${r.mesRef.padStart(7)} | ${String(r.dataVecto).substring(0,10).padStart(12)} | ${fmtBRL(r.valorparc).padStart(13)}`);
    }
  } else {
    console.log("  Nenhum.");
  }

  // ── Valores diferentes ────────────────────────────────────────────────────
  const divValor = normaisPDF.filter(b => {
    const r = biInadById[b.idboleto];
    return r && Math.abs(rc(b.valor_pdf) - rc(r.valorparc)) >= 0.02;
  });

  console.log(`\n${SEP}`);
  console.log(`  BOLETOS EM AMBOS com VALOR DIFERENTE  (${divValor.length} itens)`);
  console.log(`${SEP}`);
  if (divValor.length) {
    console.log(`  ${"idboleto".padStart(9)} | ${"mes".padStart(7)} | ${"val_pdf".padStart(13)} | ${"valorparc".padStart(13)} | ${"dif".padStart(13)} | unidade`);
    console.log(`  ${"─".repeat(85)}`);
    for (const b of divValor) {
      const r  = biInadById[b.idboleto];
      const vb = rc(r.valorparc);
      const d  = rc(b.valor_pdf - vb);
      console.log(`  ${String(b.idboleto).padStart(9)} | ${b.mes_ref.padStart(7)} | ${fmtBRL(b.valor_pdf).padStart(13)} | ${fmtBRL(vb).padStart(13)} | ${fmtBRL(d).padStart(13)} | ${b.unidade}`);
    }
  } else {
    console.log("  Nenhum — valores iguais em todos boletos em comum.");
  }

  // ── Creditos ──────────────────────────────────────────────────────────────
  if (creditosPDF.length) {
    console.log(`\n${SEP}`);
    console.log(`  CREDITOS/ESTORNOS NO PDF  (${creditosPDF.length} itens)`);
    console.log(`${SEP}`);
    let totalCred = 0;
    console.log(`  ${"idboleto".padStart(9)} | ${"mes".padStart(7)} | ${"vecto".padStart(12)} | ${"val_pdf".padStart(13)} | banco (pago/canc/orig) | unidade`);
    console.log(`  ${"─".repeat(90)}`);
    for (const b of creditosPDF) {
      const r = bancoPorId[b.idboleto];
      const banco_info = r ? `pago=${r.pago} canc=${r.cancelado} orig=${r.origem}` : "NAO ENCONTRADO";
      console.log(`  ${String(b.idboleto).padStart(9)} | ${b.mes_ref.padStart(7)} | ${b.vecto.padStart(12)} | ${fmtBRL(b.valor_pdf).padStart(13)} | ${banco_info} | ${b.unidade}`);
      totalCred += b.valor_pdf;
    }
    console.log(`\n  Total creditos PDF: ${fmtBRL(totalCred)}`);
  }

  console.log(`\n${SEP}\n`);
}

main().catch(err => {
  console.error("\nErro:", err.message);
  process.exit(1);
});
