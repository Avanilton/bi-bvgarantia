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
    WHERE b.idEmpresa = 75 AND b.pago = 0 AND b.cancelado = 0 AND b.dataVecto < CURDATE()
      AND b.idimovel = 1241 AND origem NOT IN (5,6)
  `);
  
  // Find combinations of 4 boletos that sum to ~1139.02
  console.log("Total rows:", rows.length);
  const target = 1139.02;
  
  // Simple algorithm to find 4 boletos summing to target
  let found = false;
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      for (let k = j + 1; k < rows.length; k++) {
        for (let l = k + 1; l < rows.length; l++) {
           let sum = Number(rows[i].valorparc) + Number(rows[j].valorparc) + Number(rows[k].valorparc) + Number(rows[l].valorparc);
           if (Math.abs(sum - target) < 0.1) {
               console.log("FOUND COMBINATION OF 4 BOLETOS!");
               console.log(rows[i]);
               console.log(rows[j]);
               console.log(rows[k]);
               console.log(rows[l]);
               found = true;
               break;
           }
        }
        if(found) break;
      }
      if(found) break;
    }
    if(found) break;
  }
  
  if (!found) {
      console.log("No combination of 4 boletos found for sum", target);
  }

  process.exit(0);
}
run();
