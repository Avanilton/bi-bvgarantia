"""
extract_amigavel.py
Extrai texto do PDF amigavel.pdf usando pdfplumber e salva em amigavel_texto.txt
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import pdfplumber

PDF_PATH = r"C:\Users\Administrador\Downloads\amigavel.pdf"
OUT_PATH = r"amigavel_texto.txt"

linhas_todas = []
with pdfplumber.open(PDF_PATH) as pdf:
    n = len(pdf.pages)
    print(f"PDF tem {n} paginas. Extraindo...")
    for i, page in enumerate(pdf.pages, 1):
        texto = page.extract_text(x_tolerance=4, y_tolerance=4) or ""
        linhas_todas.append(f"\n=== PAGINA {i} ===")
        linhas_todas.append(texto)
        if i % 20 == 0:
            print(f"  {i}/{n} paginas...")

with open(OUT_PATH, "w", encoding="utf-8") as f:
    f.write("\n".join(linhas_todas))

print(f"Salvo em: {OUT_PATH}")
print(f"Total de blocos: {len(linhas_todas)}")
# Amostra das primeiras 3 paginas
sample = "\n".join(linhas_todas[:8])
print("\nAmostra (pag 1-3):")
print(sample[:1200])
