import fitz
import re
import mysql.connector

def get_mysql_connection():
    with open('.env.local', 'r') as f:
        env_lines = f.readlines()
    env_vars = {}
    for line in env_lines:
        line = line.strip()
        if line and not line.startswith('#'):
            if '=' in line:
                k, v = line.split('=', 1)
                env_vars[k.strip()] = v.strip()
    return mysql.connector.connect(
        host=env_vars.get('MYSQL_HOST'),
        port=int(env_vars.get('MYSQL_PORT', 5643)),
        user=env_vars.get('MYSQL_USER'),
        password=env_vars.get('MYSQL_PASSWORD'),
        database=env_vars.get('MYSQL_DATABASE')
    )

conn = get_mysql_connection()
cursor = conn.cursor(dictionary=True)

query = """
SELECT idboleto, b.total, b.valorparc, b.idcliente, b.pago, b.cancelado, b.origem
FROM tbboleto b
WHERE b.idEmpresa = 75
  AND b.idimovel = 970
"""
cursor.execute(query)
mysql_boletos_all = cursor.fetchall()
mysql_boletos_dict = {str(b['idboleto']): b for b in mysql_boletos_all}

query_inad = """
SELECT idboleto, b.total, b.valorparc, b.idcliente
FROM tbboleto b
WHERE b.idEmpresa = 75
  AND b.idimovel = 970
  AND b.pago = 0
  AND b.cancelado = 0
  AND b.dataVecto < CURDATE()
"""
cursor.execute(query_inad)
mysql_inad_rows = cursor.fetchall()
mysql_inad_dict = {str(b['idboleto']): float(b['valorparc']) for b in mysql_inad_rows}

pdf_path = "C:/Users/Administrador/Downloads/3.pdf"
doc = fitz.open(pdf_path)

pdf_boletos = {}

def parse_value(val_str):
    val_str = val_str.replace('R$', '').strip()
    val_str = val_str.replace('.', '').replace(',', '.')
    try: return float(val_str)
    except: return 0.0

for page in doc:
    text = page.get_text("text")
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line: continue
        
        # We need to find the Document ID and its Value.
        if re.match(r'^\d{4,8}$', line):
            # Check if next line is a date mm/yyyy
            if i + 1 < len(lines) and re.match(r'^\d{2}/\d{4}$', lines[i+1].strip()):
                doc_id = line
                # Look backwards for R$ to get the value
                # In PyMuPDF, for a table row, usually the R$ value comes BEFORE the Document ID
                val = 0.0
                for j in range(i-1, max(-1, i-5), -1):
                    if lines[j].strip().startswith("R$") or lines[j].strip().startswith("-R$"):
                        val = parse_value(lines[j])
                        break
                pdf_boletos[doc_id] = val

pdf_set = set(pdf_boletos.keys())
mysql_set = set(mysql_inad_dict.keys())

only_in_pdf = pdf_set - mysql_set
only_in_mysql = mysql_set - pdf_set

sum_pdf_not_mysql = 0.0
print("--- BOLETOS NO PDF QUE NÃO ESTÃO NO BI (Pois estão cancelados/pagos no MySQL) ---")
for b in only_in_pdf:
    sum_pdf_not_mysql += pdf_boletos[b]
    if b in mysql_boletos_dict:
        row = mysql_boletos_dict[b]
        print(f"Boleto: {b} | Valor PDF: R$ {pdf_boletos[b]:.2f} | Status no DB: Pago={row['pago']}, Cancelado={row['cancelado']}, Origem={row['origem']}")
    else:
        print(f"Boleto: {b} | Valor PDF: R$ {pdf_boletos[b]:.2f} | NÃO EXISTE NO MYSQL!")

sum_mysql_not_pdf = sum(mysql_inad_dict[b] for b in only_in_mysql)
print("\n--- BOLETOS NO BI QUE NÃO ESTÃO NO PDF ---")
for b in only_in_mysql:
    print(f"Boleto: {b} | Valor MySQL: R$ {mysql_inad_dict[b]:.2f}")

diff = sum_pdf_not_mysql - sum_mysql_not_pdf
print(f"\nSoma total dos boletos no PDF (que faltam no BI): R$ {sum_pdf_not_mysql:.2f}")
print(f"Soma total dos boletos no BI (que faltam no PDF): R$ {sum_mysql_not_pdf:.2f}")
print(f"Diferença líquida exata: R$ {diff:.2f}")
