"""
step2_conferencia.py
Carrega boletos_pdf.json e compara com o banco Novacorp (idimovel=970).
Busca no banco SOMENTE pelos IDs presentes no PDF + a inadimplencia agregada do BI.
"""
import sys, io, re, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import mysql.connector
from datetime import datetime

JSON_PATH  = r"boletos_pdf.json"
DB_CFG     = dict(host="sistemasnovacorp.com.br", port=5643,
                  database="novacorpconect", user="Intelligence",
                  password="@bv2026@")
ID_EMPRESA = 75
ID_IMOVEL  = 970

def fmt_brl(v):
    v = float(v or 0)
    s = f"{v:,.2f}".replace(",","X").replace(".",",").replace("X",".")
    return f"R$ {s}"

def rc(v): return round(float(v or 0), 2)
SEP = "=" * 82

# ── Carrega PDF ───────────────────────────────────────────────────────────────
with open(JSON_PATH, encoding="utf-8") as f:
    todos_pdf = json.load(f)

normais_pdf  = [b for b in todos_pdf if not b["is_credito"]]
creditos_pdf = [b for b in todos_pdf if b["is_credito"]]
ids_pdf      = [b["idboleto"] for b in todos_pdf]
ids_norm_pdf = set(b["idboleto"] for b in normais_pdf)

print(f"\n{SEP}")
print("  CONFERENCIA: PDF Coqueiros x Banco Novacorp (idimovel=970)")
print(f"  Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
print(f"{SEP}\n")
print(f"PDF: {len(normais_pdf)} boletos normais + {len(creditos_pdf)} creditos")

# ── Banco ─────────────────────────────────────────────────────────────────────
print("Conectando ao banco...")
conn = mysql.connector.connect(**DB_CFG)
cur  = conn.cursor(dictionary=True)

# 1. Busca dados dos IDs do PDF (em lotes de 500 para evitar pacotes grandes)
print(f"Buscando {len(ids_pdf)} boletos no banco por ID...")
banco_por_id = {}
LOTE = 500
for i in range(0, len(ids_pdf), LOTE):
    lote = ids_pdf[i:i+LOTE]
    placeholders = ",".join(["%s"] * len(lote))
    cur.execute(f"""
        SELECT idboleto, idcliente, pago, cancelado, origem,
               total, valorparc, dataVecto, dataPgto,
               DATE_FORMAT(dataVecto,'%%Y-%%m') AS mesRef
        FROM TBBOLETO
        WHERE idEmpresa=%s AND idboleto IN ({placeholders})
    """, [ID_EMPRESA] + lote)
    for r in cur.fetchall():
        banco_por_id[r["idboleto"]] = r
    print(f"  Lote {i//LOTE+1}: {len(banco_por_id)} encontrados ate agora...")

# 2. Inadimplencia agregada do BI (query exata do route.ts)
print("Buscando sumario de inadimplencia do BI...")
cur.execute("""
    SELECT DATE_FORMAT(b.dataVecto,'%%Y-%%m') AS mesRef,
           SUM(IFNULL(b.valorparc,0)) AS valor,
           COUNT(*) AS qtd
    FROM TBBOLETO b
    WHERE b.idEmpresa=%s AND b.idimovel=%s
      AND b.pago=0 AND b.cancelado=0
      AND b.dataVecto < CURDATE()
    GROUP BY mesRef HAVING valor>0
    ORDER BY mesRef DESC
""", (ID_EMPRESA, ID_IMOVEL))
bi_sumario = {r["mesRef"]: r for r in cur.fetchall()}

# 3. IDs na inadimplencia do BI para este imovel
cur.execute("""
    SELECT idboleto, valorparc, dataVecto, DATE_FORMAT(dataVecto,'%%Y-%%m') AS mesRef
    FROM TBBOLETO
    WHERE idEmpresa=%s AND idimovel=%s
      AND pago=0 AND cancelado=0
      AND dataVecto < CURDATE()
""", (ID_EMPRESA, ID_IMOVEL))
bi_inad_rows = cur.fetchall()
bi_inad_ids  = {r["idboleto"]: r for r in bi_inad_rows}

cur.close()
conn.close()
print(f"Banco: {len(banco_por_id)} boletos encontrados pelos IDs do PDF")
print(f"Banco: {len(bi_inad_ids)} boletos na inadimplencia do BI\n")

# ── Totais por mes ────────────────────────────────────────────────────────────
pdf_por_mes = {}
for b in normais_pdf:
    m = b["mes_ref"]
    pdf_por_mes.setdefault(m, {"valor":0.0, "qtd":0})
    pdf_por_mes[m]["valor"] = rc(pdf_por_mes[m]["valor"] + b["valor_pdf"])
    pdf_por_mes[m]["qtd"]  += 1

bi_por_mes = {}
for r in bi_inad_rows:
    m = r["mesRef"]
    bi_por_mes.setdefault(m, {"valor":0.0, "qtd":0})
    bi_por_mes[m]["valor"] = rc(bi_por_mes[m]["valor"] + rc(r["valorparc"]))
    bi_por_mes[m]["qtd"]  += 1

# ── Tabela comparativa ────────────────────────────────────────────────────────
print(f"{SEP}")
print("  COMPARACAO POR MES  —  PDF vs BI (inadimplencia, query route.ts)")
print(f"{SEP}")
print(f"  {'Mes':>7} | {'PDF':>14} {'Qtd':>4} | {'BI Banco':>14} {'Qtd':>4} | {'Dif':>14} | Status")
print(f"  {'─'*80}")

todos_meses = sorted(set(list(pdf_por_mes.keys()) + list(bi_por_mes.keys())), reverse=True)
tp = tb = 0.0
div_meses = []

for mes in todos_meses:
    vp = pdf_por_mes.get(mes, {"valor":0.0})["valor"]
    qp = pdf_por_mes.get(mes, {"qtd":0})["qtd"]
    vb = bi_por_mes.get(mes, {"valor":0.0})["valor"]
    qb = bi_por_mes.get(mes, {"qtd":0})["qtd"]
    d  = rc(vp - vb)
    tp += vp; tb += vb
    st = "OK" if abs(d)<0.02 else "*** DIVERGE ***"
    if abs(d)>=0.02: div_meses.append(mes)
    print(f"  {mes:>7} | {fmt_brl(vp):>14} {qp:>4} | {fmt_brl(vb):>14} {qb:>4} | {fmt_brl(d):>14} | {st}")

print(f"  {'─'*80}")
td = rc(tp - tb)
print(f"  {'TOTAL':>7} | {fmt_brl(tp):>14}      | {fmt_brl(tb):>14}      | {fmt_brl(td):>14} |")

# ── No PDF mas NAO no BI ──────────────────────────────────────────────────────
hoje = datetime.now()
no_pdf_nao_bi = [b for b in normais_pdf if b["idboleto"] not in bi_inad_ids]

print(f"\n{SEP}")
print(f"  BOLETOS NO PDF mas NAO na inadimplencia do BI  ({len(no_pdf_nao_bi)} itens)")
print(f"{SEP}")
if no_pdf_nao_bi:
    print(f"  {'idboleto':>9} | {'mes':>7} | {'vecto':>12} | {'val_pdf':>13} | Motivo no banco")
    print(f"  {'─'*85}")
    for b in no_pdf_nao_bi:
        idb = b["idboleto"]
        if idb in banco_por_id:
            r = banco_por_id[idb]
            motivos = []
            if r["pago"]      == 1:
                dp = str(r["dataPgto"])[:10] if r["dataPgto"] else "?"
                motivos.append(f"PAGO em {dp}")
            if r["cancelado"] == 1: motivos.append("CANCELADO")
            if r["dataVecto"] and r["dataVecto"] >= hoje: motivos.append("Nao vencido")
            if not motivos: motivos.append(f"pago={r['pago']} canc={r['cancelado']}")
            st = " + ".join(motivos)
            print(f"  {idb:>9} | {b['mes_ref']:>7} | {b['vecto']:>12} | {fmt_brl(b['valor_pdf']):>13} | {st}")
            print(f"           banco: valorparc={fmt_brl(r['valorparc'])} total={fmt_brl(r['total'])} orig={r['origem']} cli={r['idcliente']}")
        else:
            print(f"  {idb:>9} | {b['mes_ref']:>7} | {b['vecto']:>12} | {fmt_brl(b['valor_pdf']):>13} | NAO ENCONTRADO NO BANCO")
else:
    print("  Nenhum.")

# ── No BI mas NAO no PDF ──────────────────────────────────────────────────────
no_bi_nao_pdf = [idb for idb in bi_inad_ids if idb not in ids_norm_pdf]

print(f"\n{SEP}")
print(f"  BOLETOS na inadimplencia do BI mas NAO no PDF  ({len(no_bi_nao_pdf)} itens)")
print(f"{SEP}")
if no_bi_nao_pdf:
    print(f"  {'idboleto':>9} | {'mesRef':>7} | {'dataVecto':>12} | {'valorparc':>13} | idcliente")
    print(f"  {'─'*75}")
    for idb in sorted(no_bi_nao_pdf):
        r = bi_inad_ids[idb]
        print(f"  {idb:>9} | {r['mesRef']:>7} | {str(r['dataVecto'])[:10]:>12} | {fmt_brl(r['valorparc']):>13} |")
else:
    print("  Nenhum.")

# ── Valores diferentes (em ambos mas valor diverge) ──────────────────────────
div_valor = []
for b in normais_pdf:
    idb = b["idboleto"]
    if idb in bi_inad_ids:
        r   = bi_inad_ids[idb]
        vb  = rc(r["valorparc"])
        vp  = rc(b["valor_pdf"])
        if abs(vb - vp) >= 0.02:
            div_valor.append((b, r))

print(f"\n{SEP}")
print(f"  BOLETOS EM AMBOS com VALOR DIFERENTE  ({len(div_valor)} itens)")
print(f"  PDF.valor_pdf vs banco.valorparc")
print(f"{SEP}")
if div_valor:
    print(f"  {'idboleto':>9} | {'mes':>7} | {'val_pdf':>13} | {'valorparc':>13} | {'dif':>13} | unidade")
    print(f"  {'─'*85}")
    for b, r in div_valor:
        d = rc(b["valor_pdf"] - rc(r["valorparc"]))
        print(f"  {b['idboleto']:>9} | {b['mes_ref']:>7} | {fmt_brl(b['valor_pdf']):>13} | {fmt_brl(r['valorparc']):>13} | {fmt_brl(d):>13} | {b['unidade']}")
else:
    print("  Nenhum — todos os boletos em comum tem valores iguais.")

# ── Creditos/estornos ─────────────────────────────────────────────────────────
if creditos_pdf:
    print(f"\n{SEP}")
    print(f"  CREDITOS/ESTORNOS NO PDF  ({len(creditos_pdf)} itens)")
    print(f"{SEP}")
    print(f"  {'idboleto':>9} | {'mes':>7} | {'vecto':>12} | {'val_pdf':>13} | unidade")
    print(f"  {'─'*75}")
    total_cred = 0.0
    for b in creditos_pdf:
        print(f"  {b['idboleto']:>9} | {b['mes_ref']:>7} | {b['vecto']:>12} | {fmt_brl(b['valor_pdf']):>13} | {b['unidade']}")
        if b["idboleto"] in banco_por_id:
            r = banco_por_id[b["idboleto"]]
            print(f"           banco: valorparc={fmt_brl(r['valorparc'])} pago={r['pago']} canc={r['cancelado']} orig={r['origem']}")
        total_cred += b["valor_pdf"]
    print(f"  Total creditos: {fmt_brl(total_cred)}")

print(f"\n{SEP}\n")
