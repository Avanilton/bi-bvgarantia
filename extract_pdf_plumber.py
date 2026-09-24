"""
extract_pdf_plumber.py
Extrai texto do PDF page-by-page usando pdfplumber (layout normal)
e salva em coqueiros_texto2.txt. Usa extract_text sem layout para ser mais rapido.
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import pdfplumber

PDF_PATH = r"C:\Users\Administrador\Downloads\coqueiros.pdf"
OUT_PATH = r"C:\Users\Administrador\Documents\Projetos BV\bi_bvgarantia_novo\bi-bvgarantia\coqueiros_texto2.txt"

linhas_todas = []
with pdfplumber.open(PDF_PATH) as pdf:
    n = len(pdf.pages)
    print(f"PDF tem {n} paginas. Extraindo...")
    for i, page in enumerate(pdf.pages, 1):
        # x_tolerance e y_tolerance maiores agrupam melhor as colunas em linhas
        texto = page.extract_text(x_tolerance=4, y_tolerance=4) or ""
        linhas_todas.append(f"\n=== PAGINA {i} ===")
        linhas_todas.append(texto)
        if i % 10 == 0:
            print(f"  {i}/{n} paginas processadas...")

with open(OUT_PATH, "w", encoding="utf-8") as f:
    f.write("\n".join(linhas_todas))

print(f"Salvo em: {OUT_PATH}")
print(f"Total: {len(linhas_todas)} blocos")
# Mostra amostra
sample = "\n".join(linhas_todas[1:6])
print("\nAmostra (pag 1):")
print(sample[:800])
