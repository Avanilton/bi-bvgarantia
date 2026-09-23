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
    SELECT b.idboleto, b.dataVecto, b.valorparc, b.total, b.origem, b.juros, b.multa, b.correcao, b.encargo
    FROM TBBOLETO b
    WHERE b.idboleto IN (7362020, 7546080, 7546081)
  `);
  console.log("Boletos do PDF:", rows);
  process.exit(0);
}
run();
