"""
extract_pdf_text.py
Extrai texto do PDF usando pdfminer (mais rapido) e salva em coqueiros_texto.txt
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from pdfminer.high_level import extract_text

PDF_PATH = r"C:\Users\Administrador\Downloads\coqueiros.pdf"
OUT_PATH = r"C:\Users\Administrador\Documents\Projetos BV\bi_bvgarantia_novo\bi-bvgarantia\coqueiros_texto.txt"

print("Extraindo texto do PDF com pdfminer...")
text = extract_text(PDF_PATH)
with open(OUT_PATH, "w", encoding="utf-8") as f:
    f.write(text)
print(f"Salvo em: {OUT_PATH}")
print(f"Total de caracteres: {len(text)}")
# Mostra primeiros 500 chars para conferir
print("\nAmostra:")
print(text[:500])
