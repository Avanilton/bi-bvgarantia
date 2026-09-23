const mysql = require('mysql2/promise');
async function run() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT) || 5643,
  });
  
  const [rows] = await pool.query(`
    SELECT b.idboleto, b.dataVecto, b.valorparc, b.total, b.origem, i.nomefantasia
    FROM TBBOLETO b
    JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
    WHERE b.idEmpresa = 75 AND b.pago = 0 AND b.cancelado = 0 AND b.dataVecto <= CURDATE()
      AND b.idimovel = 1241
  `);
  
  let target = 119942.58 - 117941.51; // 2001.07
  console.log("Looking for boletos summing to:", target);
  
  // Find which ones are "NÃO ANTECIPADAS" or "CRÉDITO" or "ACORDO AMIGAVEL"
  let origem5 = rows.filter(r => r.origem == 5).reduce((s, r) => s + Number(r.valorparc), 0);
  console.log("Origem 5 sum:", origem5); // Acordo Amigavel
  
  // Let's filter boletos from today
  let todayRows = rows.filter(r => new Date(r.dataVecto).toISOString().startsWith('2026-09-22'));
  let todaySum = todayRows.reduce((s, r) => s + Number(r.valorparc), 0);
  console.log("Vencimento Hoje sum:", todaySum, todayRows);

  let diffFromYesterday = 119763.87 - 117941.51; // 1822.36
  console.log("Diff from yesterday (< CURDATE):", diffFromYesterday);

  // Check if there are boletos with origem != 0 and != 5
  let outrasOrigens = rows.filter(r => r.origem !== 0 && r.origem !== 5);
  let outrasOrigensSum = outrasOrigens.reduce((s, r) => s + Number(r.valorparc), 0);
  console.log("Outras origens sum:", outrasOrigensSum, outrasOrigens);

  process.exit(0);
}
run();
