// conferencia_amigavel.js
// Compara o PDF amigavel.pdf com a query exata do BI para AMIGAVEL (origem=5)
// Roda em duas fases:
//   Fase A: apenas consulta o banco e mostra o resumo do BI
//   Fase B (após extração do PDF): compara boleto a boleto

process.env.MYSQL_HOST     = "sistemasnovacorp.com.br";
process.env.MYSQL_PORT     = "5643";
process.env.MYSQL_DATABASE = "novacorpconect";
process.env.MYSQL_USER     = "Intelligence";
process.env.MYSQL_PASSWORD = "@bv2026@";

const fs    = require("fs");
const mysql = require("mysql2/promise");

const ID_EMPRESA  = 75;
const BI_TOTAL    = 2501215.42;   // valor que aparece no BI
const PDF_TOTAL   = 2247429.50;   // valor que aparece no PDF
const TXT_PATH    = "./amigavel_texto.txt";

function rc(v)    { return Math.round((parseFloat(v)||0)*100)/100; }
function fmt(v)   {
  const s = rc(v).toFixed(2).replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g,".");
  return `R$ ${s}`;
}
const SEP = "=".repeat(80);

// ── Regex para o formato do PDF amigável ─────────────────────────────────────
// Formato visto na imagem:
// "6932902  16/07/2026  R$ 304,02  R$ 6,07  R$ 52,49  R$ 74,39  R$ 85,82  R$ 526,28"
// Colunas: Documento | Vencimento | Valor | Multa | Juros | Correcao | Encargo | Total
const RE_BOLETO = /^(\d{6,9})\s+(\d{2}\/\d{2}\/\d{4})\s+(-?R\$\s*[\d.,]+)\s+(-?R\$\s*[\d.,]+)\s+(-?R\$\s*[\d.,]+)\s+(-?R\$\s*[\d.,]+)\s+(-?R\$\s*[\d.,]+)\s+(-?R\$\s*[\d.,]+)/;
// Cabeçalho de imovel: "Cod.  XXXXX  NOME DO IMOVEL  ..."
const RE_IMOVEL  = /^Cod\.\s+(\d+)\s+(.+)/;
// Linha de cliente (pode ter nome do devedor)
const RE_CLIENTE_LINE = /^\d{5,7}\s+.+/;

function parseBRL(s) {
  if (!s) return 0;
  const neg = s.includes("-");
  const v = parseFloat(s.replace(/R\$|\s|\./g,"").replace(",",".").replace("-",""));
  return isNaN(v) ? 0 : (neg ? -v : v);
}

// ── Parse do TXT ─────────────────────────────────────────────────────────────
function parseTxt(path) {
  const boletos = [];
  let imovelCod = null, imovelNome = null;

  const linhas = fs.readFileSync(path, "utf-8").split("\n");
  for (const linha of linhas) {
    const l = linha.trim();
    if (!l || l.startsWith("===")) continue;

    const mi = RE_IMOVEL.exec(l);
    if (mi) {
      imovelCod  = parseInt(mi[1]);
      imovelNome = mi[2].trim();
      continue;
    }

    const mb = RE_BOLETO.exec(l);
    if (mb) {
      boletos.push({
        idboleto:  parseInt(mb[1]),
        vecto:     mb[2],
        valor:     parseBRL(mb[3]),
        multa:     parseBRL(mb[4]),
        juros:     parseBRL(mb[5]),
        correcao:  parseBRL(mb[6]),
        encargo:   parseBRL(mb[7]),
        total_pdf: parseBRL(mb[8]),
        idimovel:  imovelCod,
        imovelNome,
      });
    }
  }
  return boletos;
}

async function main() {
  console.log(`\n${SEP}`);
  console.log("  CONFERENCIA: AMIGAVEL NAO PAGOS — PDF vs BI");
  console.log(`  BI mostra: ${fmt(BI_TOTAL)}  |  PDF mostra: ${fmt(PDF_TOTAL)}`);
  console.log(`  Diferenca: ${fmt(BI_TOTAL - PDF_TOTAL)}`);
  console.log(`${SEP}\n`);

  // ── Fase A: Banco ──────────────────────────────────────────────────────────
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

  // Query EXATA do BI para AMIGAVEL (route.ts linhas 87-106)
  console.log("Query AMIGAVEL do BI (origem=5)...");
  const [amiRows] = await conn.query(`
    SELECT b.idboleto, b.idimovel, i.nomefantasia,
           b.pago, b.cancelado, b.origem,
           b.total, b.valorparc, b.dataVecto,
           b.juros, b.correcao, b.multa, b.encargo, b.tarifaBancaria,
           DATE_FORMAT(b.dataVecto,'%Y-%m') AS mesRef
    FROM TBBOLETO b
    JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
    WHERE b.idEmpresa = ?
      AND b.pago      = 0
      AND b.cancelado = 0
      AND b.origem    = 5
      AND b.dataVecto < CURDATE()
    ORDER BY b.dataVecto DESC
  `, [ID_EMPRESA]);

  // Também busca por TODOS os origem=5 (incluindo pagos/cancelados) para investigar
  console.log("Buscando TODOS amigaveis (incl. pagos/cancelados)...");
  const [todosAmi] = await conn.query(`
    SELECT idboleto, idimovel, pago, cancelado, origem,
           total, valorparc, dataVecto, dataPgto,
           juros, correcao, multa, encargo, tarifaBancaria,
           DATE_FORMAT(dataVecto,'%Y-%m') AS mesRef
    FROM TBBOLETO
    WHERE idEmpresa = ?
      AND origem    = 5
      AND dataVecto < CURDATE()
    ORDER BY dataVecto DESC
    LIMIT 10000
  `, [ID_EMPRESA]);

  await conn.end();

  // ── Sumario do BI ──────────────────────────────────────────────────────────
  const biById = {};
  let biTotal = 0;
  const biPorMes = {};
  const biPorImovel = {};

  for (const r of amiRows) {
    biById[r.idboleto] = r;
    const v = rc(r.total);
    biTotal = rc(biTotal + v);
    if (!biPorMes[r.mesRef]) biPorMes[r.mesRef] = {valor:0, qtd:0};
    biPorMes[r.mesRef].valor = rc(biPorMes[r.mesRef].valor + v);
    biPorMes[r.mesRef].qtd++;
    if (!biPorImovel[r.idimovel]) biPorImovel[r.idimovel] = {nome:r.nomefantasia, valor:0, qtd:0};
    biPorImovel[r.idimovel].valor = rc(biPorImovel[r.idimovel].valor + v);
    biPorImovel[r.idimovel].qtd++;
  }

  console.log(`\n${SEP}`);
  console.log(`  BANCO — AMIGAVEL NAO PAGOS (query exata BI, origem=5)`);
  console.log(`${SEP}`);
  console.log(`  Total boletos: ${amiRows.length}`);
  console.log(`  Total valor (b.total): ${fmt(biTotal)}`);
  console.log(`  BI informa:            ${fmt(BI_TOTAL)}`);
  console.log(`  Diff query vs BI card: ${fmt(rc(biTotal - BI_TOTAL))} ${Math.abs(rc(biTotal - BI_TOTAL)) < 0.1 ? "(OK - query bate)" : "(DIVERGE!)"}\n`);

  // Analisa o que o BI usa: b.total vs b.valorparc
  let totalUsandoValorparc = 0;
  for (const r of amiRows) totalUsandoValorparc = rc(totalUsandoValorparc + rc(r.valorparc));
  console.log(`  Se usasse b.valorparc: ${fmt(totalUsandoValorparc)}`);

  let totalComAcrescimos = 0;
  for (const r of amiRows) {
    totalComAcrescimos = rc(totalComAcrescimos + rc(r.total) + rc(r.juros) + rc(r.multa) + rc(r.encargo) + rc(r.correcao));
  }
  // Nota: b.total ja pode incluir os acrescimos ou nao dependendo do sistema

  // ── Por mes ────────────────────────────────────────────────────────────────
  console.log(`\n  Por mes (BI):`);
  const meses = Object.keys(biPorMes).sort().reverse();
  for (const m of meses) {
    console.log(`    ${m}: ${fmt(biPorMes[m].valor).padStart(16)}  (${biPorMes[m].qtd} boletos)`);
  }

  // ── Boletos negativos (valorparc ou total < 0) na query ──────────────────
  const negativos = amiRows.filter(r => rc(r.total) < 0);
  console.log(`\n  Boletos com b.total NEGATIVO na query do BI: ${negativos.length}`);
  if (negativos.length) {
    let sumNeg = 0;
    negativos.forEach(r => {
      sumNeg = rc(sumNeg + rc(r.total));
      console.log(`    idboleto=${r.idboleto} | total=${fmt(r.total)} | valorparc=${fmt(r.valorparc)} | ${r.mesRef} | idimovel=${r.idimovel}`);
    });
    console.log(`    Soma negativos: ${fmt(sumNeg)}`);
  }

  // ── Todos os amigavel (status geral) ──────────────────────────────────────
  const totalPagos    = todosAmi.filter(r => r.pago==1).length;
  const totalCanc     = todosAmi.filter(r => r.cancelado==1).length;
  const totalNaBI     = amiRows.length;
  console.log(`\n  STATUS geral origem=5 (todos, sem filtro de data):`);
  console.log(`    Na inadimplencia BI (pago=0, canc=0, vencidos): ${totalNaBI}`);
  console.log(`    Pagos:                                           ${totalPagos}`);
  console.log(`    Cancelados:                                      ${totalCanc}`);

  // ── Fase B: Se o TXT do PDF existir, faz conferência ──────────────────────
  if (!fs.existsSync(TXT_PATH)) {
    console.log(`\n[AGUARDANDO PDF] Arquivo ${TXT_PATH} ainda nao existe.`);
    console.log("Execute extract_amigavel.py e rode este script novamente.\n");
    return;
  }

  console.log(`\n${SEP}`);
  console.log("  FASE B — CONFERENCIA COM PDF");
  console.log(`${SEP}`);

  const pdfBoletos = parseTxt(TXT_PATH);
  const pdfNorm    = pdfBoletos.filter(b => b.total_pdf >= 0);
  const pdfNeg     = pdfBoletos.filter(b => b.total_pdf < 0);

  console.log(`  PDF: ${pdfBoletos.length} boletos (${pdfNorm.length} positivos, ${pdfNeg.length} negativos/creditos)`);

  let pdfTotal = 0;
  const pdfById  = {};
  const pdfPorMes = {};
  for (const b of pdfNorm) {
    pdfById[b.idboleto] = b;
    pdfTotal = rc(pdfTotal + b.total_pdf);
    const mes = b.vecto.split("/").reverse().join("-").substring(0,7); // dd/MM/YYYY → YYYY-MM
    if (!pdfPorMes[mes]) pdfPorMes[mes] = {valor:0, qtd:0};
    pdfPorMes[mes].valor = rc(pdfPorMes[mes].valor + b.total_pdf);
    pdfPorMes[mes].qtd++;
  }
  console.log(`  PDF total (positivos): ${fmt(pdfTotal)}`);

  // ── Tabela por mes ────────────────────────────────────────────────────────
  console.log(`\n  COMPARACAO POR MES:`);
  console.log(`  ${"Mes".padStart(7)} | ${"PDF".padStart(15)} ${"Qtd".padStart(4)} | ${"BI".padStart(15)} ${"Qtd".padStart(4)} | ${"Dif".padStart(15)} | Status`);
  console.log(`  ${"─".repeat(80)}`);

  const todosMeses = [...new Set([...Object.keys(pdfPorMes), ...Object.keys(biPorMes)])].sort().reverse();
  let tp=0, tb=0;
  for (const m of todosMeses) {
    const vp = pdfPorMes[m]?.valor||0, qp = pdfPorMes[m]?.qtd||0;
    const vb = biPorMes[m]?.valor||0,  qb = biPorMes[m]?.qtd||0;
    const d  = rc(vp-vb);
    tp+=vp; tb+=vb;
    const st = Math.abs(d)<0.02 ? "OK" : "*** DIVERGE ***";
    console.log(`  ${m.padStart(7)} | ${fmt(vp).padStart(15)} ${String(qp).padStart(4)} | ${fmt(vb).padStart(15)} ${String(qb).padStart(4)} | ${fmt(d).padStart(15)} | ${st}`);
  }
  console.log(`  ${"─".repeat(80)}`);
  console.log(`  ${"TOTAL".padStart(7)} | ${fmt(tp).padStart(15)}      | ${fmt(tb).padStart(15)}      | ${fmt(rc(tp-tb)).padStart(15)} |`);

  // ── No PDF mas NAO no BI ──────────────────────────────────────────────────
  const idsBI   = new Set(Object.keys(biById).map(Number));
  const idsPDF  = new Set(pdfNorm.map(b => b.idboleto));

  const noPDFnaoBI = pdfNorm.filter(b => !idsBI.has(b.idboleto));
  console.log(`\n  NO PDF mas NAO no BI: ${noPDFnaoBI.length}`);
  if (noPDFnaoBI.length) {
    // Precisa buscar no banco para saber o motivo
    console.log(`  (rode com a consulta de todos para ver motivo)`);
    const todosById = {};
    todosAmi.forEach(r => { todosById[r.idboleto] = r; });
    
    const porMotivo = {PAGO:[], CANCELADO:[], SEM_ORIGEM5:[], OUTRO:[]};
    for (const b of noPDFnaoBI) {
      const r = todosById[b.idboleto];
      if (!r) { porMotivo.SEM_ORIGEM5.push(b); continue; }
      if (r.pago==1)      { porMotivo.PAGO.push({b,r}); continue; }
      if (r.cancelado==1) { porMotivo.CANCELADO.push({b,r}); continue; }
      porMotivo.OUTRO.push({b,r});
    }
    console.log(`\n  PAGOS (${porMotivo.PAGO.length}):`);
    for (const {b,r} of porMotivo.PAGO.slice(0,20)) {
      const dp = r.dataPgto ? String(r.dataPgto).substring(0,10) : "?";
      console.log(`    ${b.idboleto} | ${b.vecto} | PDF.total=${fmt(b.total_pdf)} | PAGO em ${dp}`);
    }
    if (porMotivo.PAGO.length > 20) console.log(`    ... e mais ${porMotivo.PAGO.length-20}`);

    console.log(`\n  CANCELADOS (${porMotivo.CANCELADO.length}):`);
    for (const {b,r} of porMotivo.CANCELADO.slice(0,20)) {
      console.log(`    ${b.idboleto} | ${b.vecto} | PDF.total=${fmt(b.total_pdf)} | CANCELADO`);
    }
    if (porMotivo.CANCELADO.length > 20) console.log(`    ... e mais ${porMotivo.CANCELADO.length-20}`);

    console.log(`\n  NAO ENCONTRADO/OUTRO (${porMotivo.SEM_ORIGEM5.length + porMotivo.OUTRO.length}):`);
    for (const b of porMotivo.SEM_ORIGEM5) {
      console.log(`    ${b.idboleto} | ${b.vecto} | PDF.total=${fmt(b.total_pdf)} | NAO ENCONTRADO NO BANCO (origem=5)`);
    }
    for (const {b,r} of porMotivo.OUTRO) {
      console.log(`    ${b.idboleto} | ${b.vecto} | PDF.total=${fmt(b.total_pdf)} | pago=${r.pago} canc=${r.cancelado}`);
    }
  }

  // ── No BI mas NAO no PDF ──────────────────────────────────────────────────
  const noBInaoDF = amiRows.filter(r => !idsPDF.has(r.idboleto));
  console.log(`\n  NO BI mas NAO no PDF: ${noBInaoDF.length}`);
  if (noBInaoDF.length > 0) {
    let somaExtra = 0;
    console.log(`  ${"idboleto".padStart(9)} | ${"mes".padStart(7)} | ${"total".padStart(13)} | ${"valorparc".padStart(13)} | idimovel | nome`);
    console.log(`  ${"─".repeat(80)}`);
    for (const r of noBInaoDF.sort((a,b)=>a.idboleto-b.idboleto)) {
      somaExtra = rc(somaExtra + rc(r.total));
      console.log(`  ${String(r.idboleto).padStart(9)} | ${r.mesRef.padStart(7)} | ${fmt(r.total).padStart(13)} | ${fmt(r.valorparc).padStart(13)} | ${r.idimovel} | ${(r.nomefantasia||"").substring(0,30)}`);
    }
    console.log(`\n  Soma dos extras no BI: ${fmt(somaExtra)}`);
  }

  // ── Valores diferentes ────────────────────────────────────────────────────
  const divValor = pdfNorm.filter(b => {
    const r = biById[b.idboleto];
    return r && Math.abs(rc(b.total_pdf) - rc(r.total)) >= 0.02;
  });
  console.log(`\n  COM VALOR DIFERENTE (PDF.total vs banco.total): ${divValor.length}`);
  if (divValor.length) {
    let somaDif = 0;
    for (const b of divValor.slice(0,30)) {
      const r = biById[b.idboleto];
      const d = rc(b.total_pdf - rc(r.total));
      somaDif = rc(somaDif + d);
      console.log(`    ${b.idboleto} | ${b.vecto} | PDF=${fmt(b.total_pdf)} | banco.total=${fmt(r.total)} | dif=${fmt(d)}`);
    }
    if (divValor.length>30) console.log(`    ... e mais ${divValor.length-30}`);
    console.log(`    Soma difs: ${fmt(somaDif)}`);
  }

  console.log(`\n${SEP}\n`);
}

main().catch(e => { console.error("Erro:", e.message); process.exit(1); });
