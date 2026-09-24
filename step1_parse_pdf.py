"""
step1_parse_pdf.py
Parseia coqueiros_texto2.txt e salva os boletos em boletos_pdf.json
"""
import sys, io, re, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

TXT_PATH  = r"coqueiros_texto2.txt"
JSON_PATH = r"boletos_pdf.json"

RE_BOLETO  = re.compile(
    r'^(\d{6,9})\s+(\d{2}/\d{4})\s+(\d{2}/\d{2}/\d{4})\s+(-?R\$\s*[\d.,]+)\s+(-?R\$\s*[\d.,]+)'
)
RE_CLIENTE = re.compile(r'^(\d{5,7})\s*-\s*(.+?)\s*-\s*CARTEIRA\s+(.+)$')

def parse_brl(s):
    neg = s.strip().startswith("-")
    s2  = s.strip().replace("R$","").replace(" ","").replace("-","").replace(".","").replace(",",".")
    try:
        v = float(s2)
        return -v if neg else v
    except:
        return 0.0

boletos      = []
cliente_id   = None
cliente_nome = None
unidade      = None

with open(TXT_PATH, encoding="utf-8") as f:
    for linha in f:
        linha = linha.strip()
        if not linha or linha.startswith("==="): continue

        mc = RE_CLIENTE.match(linha)
        if mc:
            cliente_id   = int(mc.group(1))
            cliente_nome = mc.group(2).strip()
            unidade      = mc.group(3).strip()
            continue

        mb = RE_BOLETO.match(linha)
        if mb:
            idb   = int(mb.group(1))
            ref   = mb.group(2)
            vecto = mb.group(3)
            valor = parse_brl(mb.group(4))
            total = parse_brl(mb.group(5))
            p     = ref.split("/")
            mes   = f"{p[1]}-{p[0]}"
            boletos.append({
                "idboleto":    idb,
                "mes_ref":     mes,
                "vecto":       vecto,
                "valor_pdf":   valor,
                "total_pdf":   total,
                "is_credito":  valor < 0,
                "cliente_id":  cliente_id,
                "cliente_nome":cliente_nome,
                "unidade":     unidade,
            })

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(boletos, f, ensure_ascii=False, indent=2)

print(f"Extraidos: {len(boletos)} boletos")
normais  = [b for b in boletos if not b["is_credito"]]
creditos = [b for b in boletos if b["is_credito"]]
print(f"  Normais:  {len(normais)}")
print(f"  Creditos: {len(creditos)}")

total_pdf = sum(b["valor_pdf"] for b in normais)
print(f"  Total PDF (normais): R$ {total_pdf:,.2f}")

# Totais por mes
por_mes = {}
for b in normais:
    por_mes.setdefault(b["mes_ref"], 0.0)
    por_mes[b["mes_ref"]] += b["valor_pdf"]

print("\nPDF por mes:")
for mes in sorted(por_mes.keys(), reverse=True):
    print(f"  {mes}: R$ {por_mes[mes]:,.2f}")

ids_unicos = sorted(set(b["idboleto"] for b in boletos))
print(f"\nTotal de IDs unicos: {len(ids_unicos)}")
print(f"Range: {ids_unicos[0]} .. {ids_unicos[-1]}")
