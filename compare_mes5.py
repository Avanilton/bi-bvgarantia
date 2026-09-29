import csv
import re
import fitz

pdf_path = r"C:\Users\Administrador\Downloads\mes5pdf.pdf"
csv_path = r"C:\Users\Administrador\Downloads\mes5.csv"

def extract_pdf_boletos():
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    
    boletos_pdf = {}
    lines = text.split("\n")
    for i in range(len(lines)):
        if i + 1 < len(lines) and i - 2 >= 0:
            line_current = lines[i].strip()
            line_next = lines[i+1].strip()
            # Pega o valor que ta 2 linhas acima
            line_valor = lines[i-2].strip() 
            
            if re.match(r'^\d{6,8}$', line_current) and re.match(r'^\d{2}/\d{4}$', line_next):
                val_str = line_valor.replace("R$", "").replace(".", "").replace(",", ".").strip()
                try:
                    val = float(val_str)
                except:
                    val = 0.0
                boletos_pdf[line_current] = val
                
    return boletos_pdf, text

def compare():
    pdf_boletos_dict, full_text = extract_pdf_boletos()
    
    csv_boletos = {}
    csv_boletos_raw = {}
    
    total_csv_full = 0

    with open(csv_path, 'r', encoding='utf-8', errors='replace') as f:
        reader = csv.DictReader(f, delimiter=';')
        for row in reader:
            b_id = row['idboleto'].strip()
            
            # Converter todos para float
            v = float(row.get('valor', '0').replace(',', '.')) if row.get('valor') else 0.0
            j = float(row.get('juros', '0').replace(',', '.')) if row.get('juros') else 0.0
            c = float(row.get('correcao', '0').replace(',', '.')) if row.get('correcao') else 0.0
            m = float(row.get('multa', '0').replace(',', '.')) if row.get('multa') else 0.0
            e = float(row.get('encargo', '0').replace(',', '.')) if row.get('encargo') else 0.0
            
            total_full = v + j + c + m + e
            
            total_csv_full += total_full
            
            csv_boletos[b_id] = total_full
            csv_boletos_raw[b_id] = row

    only_csv = []
    only_pdf = []
    
    for b_id in csv_boletos:
        if b_id not in pdf_boletos_dict:
            only_csv.append(b_id)
            
    for b_id in pdf_boletos_dict:
        if b_id not in csv_boletos:
            only_pdf.append(b_id)
            
    # Calculando os totais
    diff_val_csv = 0
    for b in only_csv:
        diff_val_csv += csv_boletos[b]
        
    diff_val_pdf = 0
    for b in only_pdf:
        diff_val_pdf += pdf_boletos_dict[b]
        
    total_pdf_full = sum(pdf_boletos_dict.values())
        
    print(f"Total boletos no CSV: {len(csv_boletos)}")
    print(f"Total boletos no PDF: {len(pdf_boletos_dict)}")
    print(f"Boletos no CSV e não no PDF: {len(only_csv)}")
    print(f"Boletos no PDF e não no CSV: {len(only_pdf)}")
    
    print(f"\nSoma total no CSV (valor+taxas): R$ {total_csv_full:.2f}")
    print(f"Soma total extraida do PDF: R$ {total_pdf_full:.2f}")
    
    diff_global = total_csv_full - total_pdf_full
    print(f"DIFERENÇA GLOBAL (CSV - PDF): R$ {diff_global:.2f}")
    
    print(f"\nSoma dos boletos EXCLUSIVOS DO CSV (valor+taxas): R$ {diff_val_csv:.2f}")
    print(f"Soma dos boletos EXCLUSIVOS DO PDF: R$ {diff_val_pdf:.2f}")

    # Relatorio para inspecao
    with open("boletos_diff_report.txt", "w") as out:
        out.write("--- BOLETOS EXCLUSIVOS DO CSV ---\n")
        for b in only_csv:
            row = csv_boletos_raw[b]
            out.write(f"ID: {b} | Condo: {row['idimovel']}-{row['nomefantasia']} | Valor: {csv_boletos[b]:.2f}\n")
            
        out.write("\n--- BOLETOS EXCLUSIVOS DO PDF ---\n")
        for b in only_pdf:
            out.write(f"ID: {b} | Valor Extraido: {pdf_boletos_dict[b]:.2f}\n")

    print("\nRelatório de diferenças salvo em 'boletos_diff_report.txt'")
    
if __name__ == "__main__":
    compare()
