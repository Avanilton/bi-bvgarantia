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
    SELECT b.idboleto, b.dataVecto, b.valorparc, b.total, b.origem
    FROM TBBOLETO b
    JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
    WHERE b.idEmpresa = 75 AND b.pago = 0 AND b.cancelado = 0 AND b.dataVecto < CURDATE()
      AND b.idimovel = 1241
  `);
  
  let sumValorparc = 0;
  for (let r of rows) {
      sumValorparc += Number(r.valorparc);
  }
  
  console.log("Total sum (valorparc):", sumValorparc);
  
  let sumWithout1822 = sumValorparc;
  for (let r of rows) {
      if (Math.abs(Number(r.valorparc) - 1822.35) < 5) {
          console.log("Found boleto ~1822:", r);
      }
  }

  process.exit(0);
}
run();
