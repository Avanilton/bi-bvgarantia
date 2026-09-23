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
    SELECT COUNT(*) as count, SUM(valorparc) as sum_valorparc
    FROM TBBOLETO b
    WHERE b.idEmpresa = 75 AND b.pago = 0 AND b.cancelado = 0 AND b.dataVecto < CURDATE()
      AND b.idimovel = 1241
  `);
  console.log("Todos:", rows[0]);

  const [rows2] = await pool.query(`
    SELECT COUNT(*) as count, SUM(valorparc) as sum_valorparc
    FROM TBBOLETO b
    WHERE b.idEmpresa = 75 AND b.pago = 0 AND b.cancelado = 0 AND b.dataVecto < CURDATE()
      AND b.idimovel = 1241 AND origem NOT IN (5,6)
  `);
  console.log("Sem origem 5,6:", rows2[0]);

  process.exit(0);
}
run();
