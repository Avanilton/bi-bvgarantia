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
    SELECT origem, SUM(valorparc) as sum_valorparc, SUM(total) as sum_total
    FROM TBBOLETO b
    WHERE b.idEmpresa = 75 AND b.pago = 0 AND b.cancelado = 0 AND b.dataVecto < CURDATE()
      AND b.idimovel = 1241
    GROUP BY origem
  `);
  console.log("Soma por origem:", rows);

  const [rows_situacao] = await pool.query(`
    SELECT idsituacao, SUM(valorparc) as sum_valorparc, SUM(total) as sum_total
    FROM TBBOLETO b
    WHERE b.idEmpresa = 75 AND b.pago = 0 AND b.cancelado = 0 AND b.dataVecto < CURDATE()
      AND b.idimovel = 1241
    GROUP BY idsituacao
  `);
  console.log("Soma por situacao:", rows_situacao);

  process.exit(0);
}
run();
