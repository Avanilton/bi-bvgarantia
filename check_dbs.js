const mysql = require('mysql2/promise');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx > 0) {
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

async function main() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT) || 5643,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    timezone: '+00:00',
    connectTimeout: 30000,
  });

  try {
    const [dbs] = await pool.query('SHOW DATABASES');
    console.log(dbs);
    
    // Check novacorpconect tbimovel
    const [novacorpconect] = await pool.query('SELECT COUNT(*) as c FROM novacorpconect.tbimovel');
    console.log('novacorpconect.tbimovel count:', novacorpconect[0].c);

    // If there is another db, check it
    for (const row of dbs) {
      const dbName = row.Database;
      if (dbName.includes('nova')) {
        try {
          const [cnt] = await pool.query(`SELECT COUNT(*) as c FROM \`${dbName}\`.tbimovel`);
          console.log(`\n${dbName}.tbimovel count:`, cnt[0].c);
        } catch(e) {}
      }
    }
  } catch (err) {
    console.error('Erro:', err.message);
  } finally {
    await pool.end();
  }
}

main();
