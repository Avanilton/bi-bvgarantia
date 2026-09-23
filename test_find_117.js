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
    SELECT b.idimovel, i.nomefantasia,
           SUM(b.valorparc) as sum_valorparc,
           SUM(b.total) as sum_total
    FROM TBBOLETO b
    JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
    WHERE b.idEmpresa = 75 AND b.pago = 0 AND b.cancelado = 0 AND b.dataVecto < CURDATE()
    GROUP BY b.idimovel, i.nomefantasia
    HAVING sum_valorparc > 117000 AND sum_valorparc < 118000
        OR sum_total > 117000 AND sum_total < 118000
  `);
  console.log("Condominios perto de 117.941,51 (dataVecto < CURDATE):", rows);
  
  const [rows2] = await pool.query(`
    SELECT b.idimovel, i.nomefantasia,
           SUM(b.valorparc) as sum_valorparc,
           SUM(b.total) as sum_total
    FROM TBBOLETO b
    JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
    WHERE b.idEmpresa = 75 AND b.pago = 0 AND b.cancelado = 0 AND b.dataVecto <= CURDATE()
    GROUP BY b.idimovel, i.nomefantasia
    HAVING sum_valorparc > 117000 AND sum_valorparc < 118000
        OR sum_total > 117000 AND sum_total < 118000
  `);
  console.log("Com <= CURDATE:", rows2);

  process.exit(0);
}
run();
