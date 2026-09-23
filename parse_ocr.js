const fs = require('fs');
const mysql = require('mysql2/promise');

async function run() {
  const transcript = fs.readFileSync('C:\\Users\\Administrador\\.gemini\\antigravity-ide\\brain\\1c810552-11e7-466a-ab34-b9fb98cc16b1\\.system_generated\\logs\\transcript.jsonl', 'utf8');
  
  // Find the last USER_INPUT message
  const lines = transcript.split('\n').filter(l => l.trim().length > 0);
  let promptText = "";
  for (let i = lines.length - 1; i >= 0; i--) {
      let obj = JSON.parse(lines[i]);
      if (obj.type === "USER_INPUT") {
          promptText = obj.content;
          break;
      }
  }
  
  const regex = /\b(7[0-9]{6})\b/g;
  const pdfIds = new Set();
  let match;
  while ((match = regex.exec(promptText)) !== null) {
    pdfIds.add(Number(match[1]));
  }
  
  console.log("Found", pdfIds.size, "unique boletos in PDF (using regex 7xxxxxx)");

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
    WHERE b.idEmpresa = 75 AND b.pago = 0 AND b.cancelado = 0 
      AND b.idimovel = 1241
      AND b.dataVecto <= CURDATE()
  `);
  
  console.log("Total in DB for Alegria (<= CURDATE):", rows.length);
  
  let notInPdf = [];
  let inPdf = [];
  for (let r of rows) {
      if (pdfIds.has(Number(r.idboleto))) {
          inPdf.push(r);
      } else {
          notInPdf.push(r);
      }
  }
  
  console.log("Boletos in DB but NOT in PDF:", notInPdf.length);
  for (let b of notInPdf) {
      console.log(b.idboleto, b.dataVecto.toISOString().substring(0,10), "valorparc:", b.valorparc, "total:", b.total, "origem:", b.origem);
  }
  
  let inPdfSum = inPdf.reduce((s, r) => s + Number(r.valorparc), 0);
  console.log("Sum of boletos IN DB AND IN PDF (using valorparc):", inPdfSum);

  process.exit(0);
}
run();
