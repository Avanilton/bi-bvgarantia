import pandas as pd
import sys
import mysql.connector
import os
import json

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
                
    conn = mysql.connector.connect(
        host=env_vars.get('MYSQL_HOST'),
        port=int(env_vars.get('MYSQL_PORT', 5643)),
        user=env_vars.get('MYSQL_USER'),
        password=env_vars.get('MYSQL_PASSWORD'),
        database=env_vars.get('MYSQL_DATABASE')
    )
    return conn

# 1. Get Excel total for ALAMEDA DOS COQUEIROS
df = pd.read_excel("C:/Users/Administrador/Downloads/Resumo_Condominios.xlsx")
# Filter where name contains ALAMEDA DOS COQUEIROS
coqueiros_excel = df[df['Nome do Condominio'].str.contains('ALAMEDA DOS COQUEIROS', case=False, na=False)]
print("Excel totals for ALAMEDA DOS COQUEIROS:")
print(coqueiros_excel)
total_excel = coqueiros_excel['Total das Unidades'].sum()
print(f"Total Excel (PDF): R$ {total_excel:.2f}")

# 2. Get MySQL Inadimplência total for 970
conn = get_mysql_connection()
cursor = conn.cursor(dictionary=True)

query_inad = """
SELECT b.idimovel, i.nomefantasia,
       SUM(IFNULL(b.valorparc, 0)) AS valor,
       SUM(IFNULL(b.total, 0)) AS total
FROM tbboleto b
JOIN tbimovel i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
WHERE b.idEmpresa = 75
  AND b.idimovel = 970
  AND b.pago = 0
  AND b.cancelado = 0
  AND b.dataVecto < CURDATE()
GROUP BY b.idimovel, i.nomefantasia
"""
cursor.execute(query_inad)
inad_result = cursor.fetchall()

print("\nMySQL Inadimplência Total (using queries_novacorp logic):")
for r in inad_result:
    print(r)

if inad_result:
    total_mysql = float(inad_result[0]['valor'])
    print(f"Total MySQL (b.valorparc): R$ {total_mysql:.2f}")
    print(f"Total MySQL (b.total): R$ {float(inad_result[0]['total']):.2f}")
    
    diff = total_excel - total_mysql
    print(f"\nDiferença (Excel - MySQL_valorparc): R$ {diff:.2f}")
    
    diff2 = total_excel - float(inad_result[0]['total'])
    print(f"Diferença (Excel - MySQL_total): R$ {diff2:.2f}")
else:
    print("No Inadimplencia data in MySQL for 970.")

cursor.close()
conn.close()
