import fs from 'fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

async function main() {
  const buf = new Uint8Array(fs.readFileSync('C:/Users/Administrador/Downloads/1.pdf'));
  const doc = await getDocument({ data: buf }).promise;
  
  let fullText = '';
  fullText += `TOTAL PAGES: ${doc.numPages}\n`;
  
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map(item => item.str).join(' ');
    fullText += `\n=== PAGE ${i} ===\n${text}\n`;
  }
  
  fs.writeFileSync('pdf_full_text.txt', fullText, 'utf-8');
  console.log('Full text saved to pdf_full_text.txt');
  console.log('Total length:', fullText.length, 'chars');
}
main().catch(e => console.error('Error:', e.message));
