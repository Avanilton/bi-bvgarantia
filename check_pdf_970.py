import fitz

pdf_path = "C:/Users/Administrador/Downloads/2.pdf"
doc = fitz.open(pdf_path)

for i in range(56, 58):
    text = doc[i].get_text("text")
    lines = text.split('\n')
    print(f"--- PAGE {i} ---")
    for j, line in enumerate(lines[:30]):
        print(f"{j}: {repr(line)}")
