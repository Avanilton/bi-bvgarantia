const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function main() {
  const buf = new Uint8Array(fs.readFileSync('C:/Users/Administrador/Downloads/1.pdf'));
  const doc = await pdfjsLib.getDocument({ data: buf }).promise;
  
  console.log('TOTAL PAGES:', doc.numPages);
  
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map(item => item.str).join(' ');
    console.log(`\n=== PAGE ${i} ===`);
    console.log(text);
  }
}
main().catch(e => console.error('Error:', e.message));
