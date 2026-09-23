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
      AND b.idimovel = 1241
  `);
  
  console.log("Total rows:", rows.length); // Should be 303
  const target = 1822.36;
  
  let found = false;
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      for (let k = j + 1; k < rows.length; k++) {
        for (let l = k + 1; l < rows.length; l++) {
           let sum = Number(rows[i].valorparc) + Number(rows[j].valorparc) + Number(rows[k].valorparc) + Number(rows[l].valorparc);
           if (Math.abs(sum - target) < 0.1) {
               console.log("FOUND 4 BOLETOS SUMMING TO 1822.36!");
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
