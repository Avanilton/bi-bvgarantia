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
    SELECT 
      SUM(IF(origem NOT IN (5, 6), valorparc, 0)) as valorparc_sem_jur_amig,
      SUM(IF(origem NOT IN (5, 6), total, 0)) as total_sem_jur_amig,
      SUM(valorparc) as valorparc_todos,
      SUM(total) as total_todos
    FROM TBBOLETO b
    JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
    WHERE b.idEmpresa = 75 AND b.pago = 0 AND b.cancelado = 0 AND b.dataVecto < CURDATE()
      AND b.idimovel = 1241
  `);
  console.log("Valores Alegria:", rows[0]);
  process.exit(0);
}
run();
