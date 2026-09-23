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
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    timezone: '+00:00',
    connectTimeout: 30000,
  });

  try {
    // O PDF lista clientes como "179402 - IRAN DA SILVA GOMES" 
    // E boletos com documento como "7362020"
    // Vamos buscar o boleto com idBoleto = 7362020 para ver o idImovel
    
    const [boleto] = await pool.query(
      `SELECT b.idBoleto, b.idImovel, b.idCliente, b.valorParc, b.total, b.totalExtra, b.dataVecto, b.pago, b.cancelado, b.origem
       FROM TBBOLETO b
       WHERE b.idBoleto = 7362020`
    );
    console.log('=== BOLETO 7362020 (primeiro do PDF - Iran da Silva Gomes) ===');
    console.log(boleto);

    // Buscar por idCliente = 179402
    const [cliente179402] = await pool.query(
      `SELECT b.idBoleto, b.idImovel, b.idCliente, b.valorParc, b.total, b.totalExtra, b.dataVecto, b.pago, b.cancelado
       FROM TBBOLETO b
       WHERE b.idCliente = 179402 AND b.pago = 0 AND b.cancelado = 0
       ORDER BY b.dataVecto`
    );
    console.log('\n=== BOLETOS DO CLIENTE 179402 ===');
    console.log(cliente179402);

    if (boleto.length > 0) {
      const idImovelCorreto = boleto[0].idImovel;
      console.log(`\n>>> idImovel correto do Alegria: ${idImovelCorreto}`);

      // Agora vamos rodar a query completa para esse idImovel
      const [totalQuery] = await pool.query(
        `SELECT COUNT(*) as qtd,
                SUM(IFNULL(b.valorParc, 0)) AS soma_valorParc,
                SUM(IFNULL(b.total, 0)) AS soma_total,
                SUM(IFNULL(b.totalExtra, 0)) AS soma_totalExtra
         FROM TBBOLETO b
         WHERE b.idEmpresa = 75
           AND b.idImovel = ?
           AND b.pago = 0
           AND b.cancelado = 0
           AND b.dataVecto <= '2026-09-22'`,
        [idImovelCorreto]
      );
      console.log(`\n=== TOTAIS idImovel=${idImovelCorreto} (vecto <= 2026-09-22) ===`);
      console.log(`qtd: ${totalQuery[0].qtd}`);
      console.log(`valorParc: R$ ${Number(totalQuery[0].soma_valorParc).toFixed(2)}`);
      console.log(`total:     R$ ${Number(totalQuery[0].soma_total).toFixed(2)}`);
      console.log(`totalExtra: R$ ${Number(totalQuery[0].soma_totalExtra).toFixed(2)}`);
      console.log(`valorParc - totalExtra = R$ ${(Number(totalQuery[0].soma_valorParc) - Number(totalQuery[0].soma_totalExtra)).toFixed(2)}`);
      
      // Agora com dataVecto < CURDATE() (como o BI usa)
      const [totalQueryBI] = await pool.query(
        `SELECT COUNT(*) as qtd,
                SUM(IFNULL(b.valorParc, 0)) AS soma_valorParc,
                SUM(IFNULL(b.total, 0)) AS soma_total,
                SUM(IFNULL(b.totalExtra, 0)) AS soma_totalExtra
         FROM TBBOLETO b
         WHERE b.idEmpresa = 75
           AND b.idImovel = ?
           AND b.pago = 0
           AND b.cancelado = 0
           AND b.dataVecto < CURDATE()`,
        [idImovelCorreto]
      );
      console.log(`\n=== TOTAIS idImovel=${idImovelCorreto} (vecto < CURDATE()) ===`);
      console.log(`qtd: ${totalQueryBI[0].qtd}`);
      console.log(`valorParc: R$ ${Number(totalQueryBI[0].soma_valorParc).toFixed(2)}`);
      console.log(`total:     R$ ${Number(totalQueryBI[0].soma_total).toFixed(2)}`);
      console.log(`totalExtra: R$ ${Number(totalQueryBI[0].soma_totalExtra).toFixed(2)}`);
      
      // Agora com a query EXATA do snapshot (que usa valorparc)
      const [snapQuery] = await pool.query(
        `SELECT SUM(IFNULL(b.valorparc, 0)) AS valor
         FROM TBBOLETO b
         WHERE b.idEmpresa = 75
           AND b.idImovel = ?
           AND b.pago = 0
           AND b.cancelado = 0
           AND b.dataVecto < CURDATE()`,
        [idImovelCorreto]
      );
      console.log(`\n=== QUERY EXATA DO SNAPSHOT ===`);
      console.log(`valorparc (lowercase): R$ ${Number(snapQuery[0].valor).toFixed(2)}`);

      // Boletos com totalExtra != 0
      const [extraBoletos] = await pool.query(
        `SELECT b.idBoleto, b.dataVecto, b.valorParc, b.totalExtra, b.total, b.origem,
                (b.total - b.valorParc) as diff
         FROM TBBOLETO b
         WHERE b.idEmpresa = 75
           AND b.idImovel = ?
           AND b.pago = 0
           AND b.cancelado = 0
           AND b.dataVecto < CURDATE()
           AND IFNULL(b.totalExtra, 0) != 0
         ORDER BY b.totalExtra DESC`,
        [idImovelCorreto]
      );
      console.log(`\n=== BOLETOS COM totalExtra != 0 ===`);
      console.log(`Encontrados: ${extraBoletos.length}`);
      let somaExtra = 0;
      for (const r of extraBoletos) {
        somaExtra += Number(r.totalExtra);
        console.log(`  id=${r.idBoleto} vecto=${r.dataVecto} valorParc=${r.valorParc} totalExtra=${r.totalExtra} total=${r.total} diff=${r.diff} origem=${r.origem}`);
      }
      console.log(`Soma totalExtra: R$ ${somaExtra.toFixed(2)}`);

      // Verificar: total = valorParc + totalExtra?
      const [check] = await pool.query(
        `SELECT COUNT(*) as total_rows,
                SUM(CASE WHEN ABS(total - (valorParc + IFNULL(totalExtra, 0))) < 0.01 THEN 1 ELSE 0 END) as matches,
                SUM(CASE WHEN total != valorParc THEN 1 ELSE 0 END) as diff_count
         FROM TBBOLETO b
         WHERE b.idEmpresa = 75
           AND b.idImovel = ?
           AND b.pago = 0
           AND b.cancelado = 0
           AND b.dataVecto < CURDATE()`,
        [idImovelCorreto]
      );
      console.log('\n=== VERIFICAÇÃO: total = valorParc + totalExtra? ===');
      console.log(check);

      // Datas de vencimento
      const [datas] = await pool.query(
        `SELECT DATE_FORMAT(b.dataVecto, '%Y-%m-%d') as vecto, COUNT(*) as qtd,
                SUM(b.valorParc) as soma_valorParc,
                SUM(b.total) as soma_total,
                SUM(b.totalExtra) as soma_totalExtra
         FROM TBBOLETO b
         WHERE b.idEmpresa = 75
           AND b.idImovel = ?
           AND b.pago = 0
           AND b.cancelado = 0
           AND b.dataVecto < CURDATE()
         GROUP BY vecto
         ORDER BY vecto`,
        [idImovelCorreto]
      );
      console.log('\n=== POR DATA DE VENCIMENTO ===');
      for (const r of datas) {
        console.log(`  ${r.vecto}: ${r.qtd} boletos, valorParc=${Number(r.soma_valorParc).toFixed(2)}, total=${Number(r.soma_total).toFixed(2)}, totalExtra=${Number(r.soma_totalExtra).toFixed(2)}`);
      }

      // COMPARAÇÃO FINAL
      console.log('\n========== COMPARAÇÃO FINAL ==========');
      console.log(`PDF (Alegria):  R$ 116.274,01 (295 docs, 171 clientes)`);
      console.log(`BI mostra:      R$ 117.941,51`);
      console.log(`Diferença:      R$ ${(117941.51 - 116274.01).toFixed(2)}`);
      console.log(`MySQL valorParc: R$ ${Number(totalQueryBI[0].soma_valorParc).toFixed(2)}`);
      console.log(`MySQL total:     R$ ${Number(totalQueryBI[0].soma_total).toFixed(2)}`);
      console.log(`MySQL totalExtra: R$ ${Number(totalQueryBI[0].soma_totalExtra).toFixed(2)}`);
    }

  } catch (err) {
    console.error('Erro:', err.message);
  } finally {
    await pool.end();
  }
}

main();
