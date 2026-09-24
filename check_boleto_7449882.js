// Verifica o boleto 7449882 no banco Novacorp
// e simula os filtros da query de INADIMPLÊNCIA do BI

// Valores de .env.local (dotenv não instalado)
process.env.MYSQL_HOST     = process.env.MYSQL_HOST     || "sistemasnovacorp.com.br";
process.env.MYSQL_PORT     = process.env.MYSQL_PORT     || "5643";
process.env.MYSQL_DATABASE = process.env.MYSQL_DATABASE || "novacorpconect";
process.env.MYSQL_USER     = process.env.MYSQL_USER     || "Intelligence";
process.env.MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "@bv2026@";
process.env.ID_EMPRESA     = process.env.ID_EMPRESA     || "75";

const mysql = require("mysql2/promise");

const ID_BOLETO = 7449882;
const ID_EMPRESA = Number(process.env.ID_EMPRESA ?? 75);

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    timezone: "+00:00",
  });

  console.log(`\n${"=".repeat(60)}`);
  console.log(`  Verificando idboleto = ${ID_BOLETO}  |  idEmpresa = ${ID_EMPRESA}`);
  console.log(`${"=".repeat(60)}\n`);

  // 1. Dados brutos do boleto
  const [rows] = await conn.query(
    `SELECT idboleto, idEmpresa, idimovel, idcliente,
            pago, cancelado, origem,
            total, valorparc,
            dataVecto, dataPgto,
            juros, correcao, multa, encargo, tarifaBancaria
     FROM TBBOLETO
     WHERE idboleto = ?`,
    [ID_BOLETO]
  );

  if (!rows.length) {
    console.log("BOLETO NAO ENCONTRADO NO BANCO.");
    await conn.end();
    return;
  }

  const b = rows[0];
  console.log("DADOS DO BOLETO:");
  console.table([b]);

  // 2. Verifica se passa nos filtros da query de INADIMPLENCIA
  console.log("\nANALISE — Filtros da query INADIMPLENCIA:");
  const checks = [
    { filtro: "idEmpresa = " + ID_EMPRESA,   ok: b.idEmpresa == ID_EMPRESA, valor: b.idEmpresa },
    { filtro: "pago = 0",                      ok: b.pago == 0,              valor: b.pago },
    { filtro: "cancelado = 0",                 ok: b.cancelado == 0,         valor: b.cancelado },
    { filtro: "dataVecto < CURDATE()",         ok: b.dataVecto && new Date(b.dataVecto) < new Date(), valor: b.dataVecto },
  ];

  checks.forEach(c => {
    const icon = c.ok ? "[OK]" : "[FALHOU]";
    console.log(`  ${icon}  ${c.filtro.padEnd(35)} -> valor: ${c.valor}`);
  });

  const passaTodos = checks.every(c => c.ok);
  console.log(`\n  ${passaTodos ? "[PASS] O boleto PASSA nos filtros e ENTRA no card Inadimplencia." : "[FAIL] O boleto NAO passa em todos os filtros — ver falhas acima."}`);

  // 3. Verifica valorparc
  console.log(`\nvalorparc = ${b.valorparc}  (coluna usada no SUM da inadimplencia)`);
  if (b.valorparc == null || b.valorparc == 0) {
    console.log("  ATENCAO: valorparc eh nulo ou zero — contribuiria R$ 0,00 para o total,");
    console.log("           e seria excluido pelo HAVING valor > 0 (se for o unico do grupo).");
  }

  // 4. Origem
  const origemLabel = { 5: "Amigavel", 6: "Juridico" };
  if (b.origem) {
    const label = origemLabel[b.origem] ?? "Outro";
    console.log(`\norigem = ${b.origem} -> ${label}`);
    if (b.origem == 5 || b.origem == 6) {
      console.log(`  Este boleto tambem aparece no card de ${label} Nao Pagos.`);
    }
  }

  await conn.end();
}

main().catch(err => {
  console.error("\nErro ao conectar:", err.message);
  process.exit(1);
});
