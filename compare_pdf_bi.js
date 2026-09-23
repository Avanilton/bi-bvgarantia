// Script para comparar o PDF com o banco de dados
// O PDF mostra R$ 116.274,01 (295 documentos)
// O BI mostra R$ 117.941,51
// Diferença: R$ 1.667,50

// Extrair todos os valores do PDF
const fs = require('fs');
const text = fs.readFileSync('pdf_full_text.txt', 'utf-8');

// Encontrar todos os valores R$ X.XXX,XX nos boletos individuais (não totais de cliente)
// Padrão: "R$ XXX,XX DD/MM/YYYY   R$ XXX,XX XXXXXXX   MM/YYYY" - cada boleto
const boletoPattern = /R\$\s+([\d.,]+)\s+(\d{2}\/\d{2}\/\d{4})\s+R\$\s+([\d.,]+)\s+(\d+)\s*\*?\s+(\d{2}\/\d{4})/g;

let match;
let boletos = [];
let totalPDF = 0;

while ((match = boletoPattern.exec(text)) !== null) {
  const valor = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
  const vencimento = match[2];
  const total = parseFloat(match[3].replace(/\./g, '').replace(',', '.'));
  const documento = match[4];
  const ref = match[5];
  
  boletos.push({ valor, vencimento, total, documento, ref });
  totalPDF += total;
}

console.log(`Total de boletos encontrados: ${boletos.length}`);
console.log(`Soma dos valores: R$ ${totalPDF.toFixed(2)}`);
console.log(`Total esperado (PDF): R$ 116.274,01`);
console.log(`Total no BI: R$ 117.941,51`);
console.log(`Diferença: R$ ${(117941.51 - totalPDF).toFixed(2)}`);

// Agrupar por referência
const porRef = {};
for (const b of boletos) {
  if (!porRef[b.ref]) porRef[b.ref] = { count: 0, total: 0 };
  porRef[b.ref].count++;
  porRef[b.ref].total += b.total;
}
console.log('\n--- Totais por referência ---');
for (const [ref, data] of Object.entries(porRef)) {
  console.log(`Ref ${ref}: ${data.count} boletos, R$ ${data.total.toFixed(2)}`);
}

// Verificar boletos com asterisco (marcados com *)
const marcados = text.match(/R\$\s+[\d.,]+\s+\d{2}\/\d{2}\/\d{4}\s+R\$\s+[\d.,]+\s+\d+\s*\*/g);
console.log('\n--- Boletos marcados com * ---');
if (marcados) {
  for (const m of marcados) {
    console.log(m.trim());
  }
}

// Verificar marcadores de tipo no cabeçalho do PDF
console.log('\n--- Tipos de cobrança no PDF ---');
const tipos = text.match(/(ACORDO JURIDICO|ACORDO AMIGAVEL|CRÉDITO|NÃO ANTECIPADAS|CARTEIRA)\*/gi);
if (tipos) {
  for (const t of [...new Set(tipos)]) {
    console.log(t);
  }
}
