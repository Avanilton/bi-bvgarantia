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

pdf_path = "C:/Users/Administrador/Downloads/2.pdf"
doc = fitz.open(pdf_path)

pdf_boletos = []
pdf_total_cliente_sum = 0.0
in_coqueiros = False
expecting_total = False

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
        
        if line == "ALAMEDA DOS COQUEIROS":
            in_coqueiros = True
            continue
            
        if in_coqueiros and re.match(r'^[A-Z][A-Z\s]+$', line):
            blacklist = ["BV GARANTIA SA", "RUA MARECHAL DEODORO", "CENTRO -", "FONE:", "COBRANCA@", "ESTA", "IMPRESSO POR", "DEMONSTRATIVO DE", "ACORDO JURIDICO", "Documento", "Total", "Vecto", "Valor", "Ref."]
            skip = False
            for b in blacklist:
                if b in line or line.startswith(b): skip = True
            if not skip and line != "ALAMEDA DOS COQUEIROS" and "ANTECIPADAS" not in line and "AMIGAVEL" not in line and "CREDITO" not in line and "CRÉDITO" not in line and "CRDITO" not in line:
                in_coqueiros = False
                break
                
        if in_coqueiros:
            if expecting_total:
                pdf_total_cliente_sum += parse_value(line)
                expecting_total = False
                continue
            if line.startswith("Total cliente:"):
                expecting_total = True
                continue
            if re.match(r'^\d{4,8}$', line):
                if i + 1 < len(lines) and re.match(r'^\d{2}/\d{4}$', lines[i+1].strip()):
                    pdf_boletos.append(line)

pdf_set = set(pdf_boletos)
mysql_set = set(mysql_inad_dict.keys())

only_in_pdf = pdf_set - mysql_set
only_in_mysql = mysql_set - pdf_set

sum_pdf_not_mysql = 0.0
for b in only_in_pdf:
    if b in mysql_boletos_dict:
        sum_pdf_not_mysql += float(mysql_boletos_dict[b]['valorparc'])

sum_mysql_not_pdf = sum(mysql_inad_dict[b] for b in only_in_mysql)

print(f"PDF sum of boletos not in MySQL INAD (but in PDF): R$ {sum_pdf_not_mysql:.2f}")
print(f"MySQL INAD sum of boletos not in PDF: R$ {sum_mysql_not_pdf:.2f}")

diff = sum_pdf_not_mysql - sum_mysql_not_pdf
print(f"Net difference: R$ {diff:.2f}")
print("--- BOLETOS NO PDF QUE NÃO ESTÃO NO BI (Pois estão cancelados/pagos) ---")
for b in only_in_pdf:
    if b in mysql_boletos_dict:
        row = mysql_boletos_dict[b]
        print(f"Boleto: {b} | Valor: {row['valorparc']} | Pago: {row['pago']} | Cancelado: {row['cancelado']} | Origem: {row['origem']}")

print("\n--- BOLETOS NO BI QUE NÃO ESTÃO NO PDF ---")
for b in only_in_mysql:
    print(f"Boleto: {b} | Valor: {mysql_inad_dict[b]}")
