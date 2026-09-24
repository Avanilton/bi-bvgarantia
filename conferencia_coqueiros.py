"""
conferencia_v3.py
Parseia coqueiros_texto2.txt e compara com o banco Novacorp (idimovel=970).
Formato da linha de boleto: "7449882 09/2026 10/09/2026 R$ 343,24 R$ 343,24"
"""
import sys, io, re, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import mysql.connector
from datetime import datetime

TXT_PATH = r"C:\Users\Administrador\Documents\Projetos BV\bi_bvgarantia_novo\bi-bvgarantia\coqueiros_texto2.txt"
DB_CFG   = dict(host="sistemasnovacorp.com.br", port=5643,
                database="novacorpconect", user="Intelligence",
                password="@bv2026@")
ID_EMPRESA = 75
ID_IMOVEL  = 970

def parse_brl(s):
    s = s.strip().replace("R$","").replace(" ","").replace(".","").replace(",",".")
    s = s.replace("-","")   # ignora negativos por ora (creditados)
    try: return float(s)
    except: return 0.0

def fmt_brl(v):
    v = float(v or 0)
    s = f"{v:,.2f}".replace(",","X").replace(".",",").replace("X",".")
    return f"R$ {s}"

def rc(v): return round(float(v or 0), 2)

SEP = "=" * 80

# ── Regex ─────────────────────────────────────────────────────────────────────
RE_BOLETO  = re.compile(
    r'^(\d{6,9})\s+(\d{2}/\d{4})\s+(\d{2}/\d{2}/\d{4})\s+(-?R\$\s*[\d.,]+)\s+(-?R\$\s*[\d.,]+)'
)
RE_CLIENTE = re.compile(r'^(\d{5,7})\s*-\s*(.+?)\s*-\s*CARTEIRA\s+(.+)$')
RE_TOTAL   = re.compile(r'^Total cliente:\s*(-?R\$\s*[\d.,]+)')

# ── 1. Parseia TXT ────────────────────────────────────────────────────────────
def parsear_txt(path):
    boletos      = []
    cliente_id   = None
    cliente_nome = None
    unidade      = None

    with open(path, encoding="utf-8") as f:
        linhas = f.readlines()

    for linha in linhas:
        linha = linha.strip()
        if not linha or linha.startswith("==="):
            continue

        mc = RE_CLIENTE.match(linha)
        if mc:
            cliente_id   = int(mc.group(1))
            cliente_nome = mc.group(2).strip()
            unidade      = mc.group(3).strip()
            continue

        mb = RE_BOLETO.match(linha)
        if mb:
            idb   = int(mb.group(1))
            ref   = mb.group(2)          # MM/YYYY
            vecto = mb.group(3)          # dd/MM/YYYY
            valor = parse_brl(mb.group(4))
            total = parse_brl(mb.group(5))
            p = ref.split("/")
            mes_ref = f"{p[1]}-{p[0]}"
            # detecta se é crédito (valor negativo no raw)
            is_credito = "-" in mb.group(4)
            boletos.append({
                "idboleto":    idb,
                "ref":         ref,
                "mes_ref":     mes_ref,
                "vecto":       vecto,
                "valor_pdf":   valor if not is_credito else -valor,
                "total_pdf":   total if not is_credito else -total,
                "is_credito":  is_credito,
                "cliente_id":  cliente_id,
                "cliente_nome":cliente_nome,
                "unidade":     unidade,
            })
    return boletos

# ── 2. Banco ──────────────────────────────────────────────────────────────────
def buscar_banco():
    conn = mysql.connector.connect(**DB_CFG)
    cur  = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT idboleto, idcliente, pago, cancelado, origem,
               total, valorparc, dataVecto, dataPgto,
               juros, correcao, multa, encargo, tarifaBancaria,
               DATE_FORMAT(dataVecto,'%%Y-%%m') AS mesRef
        FROM TBBOLETO
        WHERE idEmpresa=%s AND idimovel=%s
        ORDER BY dataVecto DESC
    """, (ID_EMPRESA, ID_IMOVEL))
    todos = {r["idboleto"]: r for r in cur.fetchall()}

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
    sumario = {r["mesRef"]: r for r in cur.fetchall()}

    cur.close(); conn.close()
    return todos, sumario

# ── 3. Main ───────────────────────────────────────────────────────────────────
def main():
    print(f"\n{SEP}")
    print("  CONFERENCIA: PDF Coqueiros x Banco Novacorp (idimovel=970)")
    print(f"  Data hoje: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    print(f"{SEP}\n")

    print("Parseando TXT do PDF...")
    pdf_boletos = parsear_txt(TXT_PATH)
    print(f"  -> {len(pdf_boletos)} boletos extraidos do PDF")
    # separa os creditos
    creditos_pdf = [b for b in pdf_boletos if b["is_credito"]]
    normais_pdf  = [b for b in pdf_boletos if not b["is_credito"]]
    if creditos_pdf:
        print(f"  -> {len(creditos_pdf)} creditos/estornos no PDF (serao exibidos separadamente)")

    print("\nConsultando banco...")
    banco_todos, banco_sumario = buscar_banco()
    hoje = datetime.now()
    banco_inad = {
        idb: r for idb, r in banco_todos.items()
        if r["pago"] == 0 and r["cancelado"] == 0
        and r["dataVecto"] and r["dataVecto"] < hoje
    }
    print(f"  -> {len(banco_todos)} boletos no banco (total do imovel)")
    print(f"  -> {len(banco_inad)} boletos na inadimplencia do BI\n")

    # ── Totais por mes ────────────────────────────────────────────────────────
    pdf_por_mes   = {}
    pdf_ids_todos = {b["idboleto"] for b in pdf_boletos}
    pdf_ids_norm  = {b["idboleto"] for b in normais_pdf}

    for b in normais_pdf:
        mes = b["mes_ref"]
        pdf_por_mes.setdefault(mes, {"valor":0.0,"qtd":0,"ids":[]})
        pdf_por_mes[mes]["valor"] += b["valor_pdf"]
        pdf_por_mes[mes]["qtd"]   += 1
        pdf_por_mes[mes]["ids"].append(b["idboleto"])

    banco_por_mes = {}
    for idb, r in banco_inad.items():
        mes = r["mesRef"]
        banco_por_mes.setdefault(mes, {"valor":0.0,"qtd":0,"ids":[]})
        banco_por_mes[mes]["valor"] += rc(r["valorparc"])
        banco_por_mes[mes]["qtd"]   += 1
        banco_por_mes[mes]["ids"].append(idb)

    # ── Tabela comparativa por mes ────────────────────────────────────────────
    print(f"{SEP}")
    print("  COMPARACAO POR MES: PDF vs BI (banco) — inadimplencia")
    print(f"{SEP}")
    header = f"  {'MesRef':>7} | {'PDF Valor':>14} {'Qtd':>4} | {'Banco Valor':>14} {'Qtd':>4} | {'Diferenca':>14} | Status"
    print(header)
    print(f"  {'─'*80}")

    todos_meses = sorted(set(list(pdf_por_mes.keys()) + list(banco_por_mes.keys())), reverse=True)
    divergencias_mes = []
    total_pdf = total_banco = 0.0

    for mes in todos_meses:
        vp = rc(pdf_por_mes.get(mes, {}).get("valor", 0))
        qp = pdf_por_mes.get(mes, {}).get("qtd", 0)
        vb = rc(banco_por_mes.get(mes, {}).get("valor", 0))
        qb = banco_por_mes.get(mes, {}).get("qtd", 0)
        diff = rc(vp - vb)
        total_pdf   += vp
        total_banco += vb
        status = "OK" if abs(diff) < 0.02 else "*** DIVERGE ***"
        if abs(diff) >= 0.02:
            divergencias_mes.append(mes)
        print(f"  {mes:>7} | {fmt_brl(vp):>14} {qp:>4} | {fmt_brl(vb):>14} {qb:>4} | {fmt_brl(diff):>14} | {status}")

    print(f"  {'─'*80}")
    td = rc(total_pdf - total_banco)
    print(f"  {'TOTAL':>7} | {fmt_brl(total_pdf):>14}      | {fmt_brl(total_banco):>14}      | {fmt_brl(td):>14} |")

    # ── PDF mas NAO no BI ─────────────────────────────────────────────────────
    ids_inad = set(banco_inad.keys())
    no_pdf_nao_bi = [b for b in normais_pdf if b["idboleto"] not in ids_inad]

    print(f"\n{SEP}")
    print(f"  BOLETOS NO PDF mas NAO na inadimplencia do BI ({len(no_pdf_nao_bi)} itens)")
    print(f"{SEP}")
    if no_pdf_nao_bi:
        print(f"  {'idboleto':>9} | {'mes':>7} | {'vecto':>12} | {'val_pdf':>13} | Motivo no banco")
        print(f"  {'─'*85}")
        for b in no_pdf_nao_bi:
            idb = b["idboleto"]
            if idb in banco_todos:
                r = banco_todos[idb]
                motivo = []
                if r["pago"]      == 1:
                    dp = str(r["dataPgto"])[:10] if r["dataPgto"] else "?"
                    motivo.append(f"PAGO em {dp}")
                if r["cancelado"] == 1: motivo.append("CANCELADO")
                if r["dataVecto"] and r["dataVecto"] >= hoje: motivo.append("Nao vencido")
                if not motivo: motivo.append(f"pago={r['pago']} canc={r['cancelado']}")
                st = " | ".join(motivo)
                print(f"  {idb:>9} | {b['mes_ref']:>7} | {b['vecto']:>12} | {fmt_brl(b['valor_pdf']):>13} | {st}")
                print(f"           banco: valorparc={fmt_brl(r['valorparc'])} total={fmt_brl(r['total'])} orig={r['origem']} idcliente={r['idcliente']}")
            else:
                print(f"  {idb:>9} | {b['mes_ref']:>7} | {b['vecto']:>12} | {fmt_brl(b['valor_pdf']):>13} | NAO ENCONTRADO NO BANCO")
    else:
        print("  Nenhum.")

    # ── BI mas NAO no PDF ─────────────────────────────────────────────────────
    no_bi_nao_pdf = [idb for idb in ids_inad if idb not in pdf_ids_todos]

    print(f"\n{SEP}")
    print(f"  BOLETOS na inadimplencia do BI mas NAO no PDF ({len(no_bi_nao_pdf)} itens)")
    print(f"{SEP}")
    if no_bi_nao_pdf:
        print(f"  {'idboleto':>9} | {'mesRef':>7} | {'dataVecto':>12} | {'valorparc':>13} | idcliente")
        print(f"  {'─'*75}")
        for idb in sorted(no_bi_nao_pdf):
            r = banco_todos[idb]
            print(f"  {idb:>9} | {r['mesRef']:>7} | {str(r['dataVecto'])[:10]:>12} | {fmt_brl(r['valorparc']):>13} | {r['idcliente']}")
    else:
        print("  Nenhum.")

    # ── Valores divergentes (em ambos mas com valor diferente) ────────────────
    print(f"\n{SEP}")
    print("  BOLETOS EM AMBOS mas com VALOR DIFERENTE (PDF vs banco.valorparc)")
    print(f"{SEP}")
    div_valor = []
    for b in normais_pdf:
        idb = b["idboleto"]
        if idb in banco_inad:
            r   = banco_inad[idb]
            vb  = rc(r["valorparc"])
            vp  = rc(b["valor_pdf"])
            if abs(vb - vp) >= 0.02:
                div_valor.append((b, r))

    if div_valor:
        for b, r in div_valor:
            diff = rc(b["valor_pdf"] - rc(r["valorparc"]))
            print(f"  idboleto={b['idboleto']} | {b['mes_ref']} | {b['unidade']}")
            print(f"    PDF:   valor={fmt_brl(b['valor_pdf'])}  total={fmt_brl(b['total_pdf'])}")
            print(f"    Banco: valorparc={fmt_brl(r['valorparc'])}  total={fmt_brl(r['total'])}")
            print(f"    Dif:   {fmt_brl(diff)}  | orig={r['origem']} pago={r['pago']} canc={r['cancelado']}")
            print()
    else:
        print("  Nenhum — valores identicos em todos os boletos em comum.")

    # ── Creditos/estornos no PDF ──────────────────────────────────────────────
    if creditos_pdf:
        print(f"\n{SEP}")
        print(f"  CREDITOS/ESTORNOS NO PDF ({len(creditos_pdf)} itens) — nao somados acima")
        print(f"{SEP}")
        print(f"  {'idboleto':>9} | {'mes':>7} | {'vecto':>12} | {'val_pdf':>13} | {'unidade'}")
        print(f"  {'─'*75}")
        for b in creditos_pdf:
            print(f"  {b['idboleto']:>9} | {b['mes_ref']:>7} | {b['vecto']:>12} | {fmt_brl(b['valor_pdf']):>13} | {b['unidade']}")
            idb = b["idboleto"]
            if idb in banco_todos:
                r = banco_todos[idb]
                print(f"           banco: valorparc={fmt_brl(r['valorparc'])} pago={r['pago']} canc={r['cancelado']} orig={r['origem']}")
            else:
                print(f"           banco: NAO ENCONTRADO")

    print(f"\n{SEP}\n")

main()
