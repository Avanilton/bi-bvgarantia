// test_recebimento.js
// Testa a nova query de Recebimento (mes cheio, valorPago > 0)
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

async function main() {
  console.log("========================================================================");
  console.log("  VALIDACAO: Card RECEBIMENTO");
  console.log(`  Valor esperado pelo sistema: ${fmt(VALOR_ESPERADO)}`);
  console.log("========================================================================\n");

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

  console.log("--- Query (cancelado=0, valorPago>0, dataPgto no mes atual) ---");
  const [result1] = await conn.query(`
    SELECT COUNT(*) AS qtd,
           SUM(IFNULL(valorPago, 0)) AS soma_valorPago,
           SUM(IFNULL(total, 0))     AS soma_total,
           SUM(IFNULL(valorParc, 0)) AS soma_valorParc
    FROM TBBOLETO
    WHERE idEmpresa = ?
      AND cancelado = 0
      AND valorPago > 0
      AND dataPgto >= DATE_FORMAT(NOW(), '%Y-%m-01')
      AND dataPgto <= LAST_DAY(NOW())
  `, [ID_EMPRESA]);
  
  const r1 = result1[0];
  console.log(`  Qtd boletos:    ${r1.qtd}`);
  console.log(`  Soma valorPago: ${fmt(r1.soma_valorPago)}  <-- (O que a nova regra diz)`);
  console.log(`  Soma total:     ${fmt(r1.soma_total)}`);
  console.log(`  Soma valorParc: ${fmt(r1.soma_valorParc)}`);
  console.log(`  Diferença (valorPago vs Esperado): ${fmt(rc(r1.soma_valorPago - VALOR_ESPERADO))}`);
  console.log(`  Diferença (total vs Esperado):     ${fmt(rc(r1.soma_total - VALOR_ESPERADO))}`);

  console.log("\n--- Detalhamento por dia ---");
  const [dias] = await conn.query(`
    SELECT DATE(dataPgto) AS dia,
           COUNT(*) AS qtd,
           SUM(IFNULL(valorPago, 0)) AS vp,
           SUM(IFNULL(total, 0)) AS vt
    FROM TBBOLETO
    WHERE idEmpresa = ?
      AND cancelado = 0
      AND valorPago > 0
      AND dataPgto >= DATE_FORMAT(NOW(), '%Y-%m-01')
      AND dataPgto <= LAST_DAY(NOW())
    GROUP BY dia
    ORDER BY dia
  `, [ID_EMPRESA]);
  
  let acumVP = 0;
  for(const d of dias) {
    acumVP = rc(acumVP + rc(d.vp));
    console.log(`  ${String(d.dia).substring(0,10)} | qtd: ${String(d.qtd).padStart(5)} | valorPago: ${fmt(d.vp).padStart(15)} | Acumulado: ${fmt(acumVP).padStart(16)}`);
  }
  
  await conn.end();
}

main().catch(e => { console.error("Erro:", e.message); process.exit(1); });
