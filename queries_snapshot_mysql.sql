-- ===============================================================================
-- QUERIES DO DASHBOARD E SNAPSHOT - BI BVGARANTIA
-- ===============================================================================

-- 1. INADIMPLÊNCIA (Geração da Foto - usa dataVecto)
--    Vencidos antes de hoje, não pagos e não cancelados
SELECT b.idimovel, i.nomefantasia,
       DATE_FORMAT(b.dataVecto, '%Y-%m')   AS mesRef,
       SUM(IFNULL(b.valorparc, 0))         AS valor,
       SUM(IFNULL(b.juros, 0))             AS juros,
       SUM(IFNULL(b.correcao, 0))          AS correcao,
       SUM(IFNULL(b.multa, 0))             AS multa,
       SUM(IFNULL(b.encargo, 0))           AS encargo,
       SUM(IFNULL(b.tarifaBancaria, 0))    AS tarifaBoleto
FROM TBBOLETO b
JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
WHERE b.idEmpresa  = ?
  AND b.pago       = 0
  AND b.cancelado  = 0
  AND b.dataVecto  < CURDATE()
GROUP BY b.idimovel, i.nomefantasia, mesRef;

-- 1.A INADIMPLÊNCIA ORIGEM 5 (Para Comparativo Inadimplência)
SELECT b.idimovel, i.nomefantasia,
       DATE_FORMAT(b.dataVecto, '%Y-%m')   AS mesRef,
       SUM(IFNULL(b.valorparc, 0))         AS valor,
       SUM(IFNULL(b.juros, 0))             AS juros,
       SUM(IFNULL(b.correcao, 0))          AS correcao,
       SUM(IFNULL(b.multa, 0))             AS multa,
       SUM(IFNULL(b.encargo, 0))           AS encargo,
       SUM(IFNULL(b.tarifaBancaria, 0))    AS tarifaBoleto
FROM TBBOLETO b
JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
WHERE b.idEmpresa  = ?
  AND b.pago       = 0
  AND b.cancelado  = 0
  AND b.origem     = 5
  AND b.dataVecto  < CURDATE()
GROUP BY b.idimovel, i.nomefantasia, mesRef;

-- 1.B INADIMPLÊNCIA ORIGEM 6 (Para Comparativo Inadimplência)
SELECT b.idimovel, i.nomefantasia,
       DATE_FORMAT(b.dataVecto, '%Y-%m')   AS mesRef,
       SUM(IFNULL(b.valorparc, 0))         AS valor,
       SUM(IFNULL(b.juros, 0))             AS juros,
       SUM(IFNULL(b.correcao, 0))          AS correcao,
       SUM(IFNULL(b.multa, 0))             AS multa,
       SUM(IFNULL(b.encargo, 0))           AS encargo,
       SUM(IFNULL(b.tarifaBancaria, 0))    AS tarifaBoleto
FROM TBBOLETO b
JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
WHERE b.idEmpresa  = ?
  AND b.pago       = 0
  AND b.cancelado  = 0
  AND b.origem     = 6
  AND b.dataVecto  < CURDATE()
GROUP BY b.idimovel, i.nomefantasia, mesRef;

-- 2. RECEBIMENTO (Geração da Foto - usa dataPgto)
--    Pagos no mês atual, até ontem (D-1)
SELECT b.idimovel, i.nomefantasia,
       DATE_FORMAT(b.dataPgto, '%Y-%m')    AS mesRef,
       SUM(IFNULL(b.valorPago, 0))         AS valor,
       SUM(IFNULL(b.juros, 0))             AS juros,
       SUM(IFNULL(b.correcao, 0))          AS correcao,
       SUM(IFNULL(b.multa, 0))             AS multa,
       SUM(IFNULL(b.encargo, 0))           AS encargo,
       SUM(IFNULL(b.tarifaBancaria, 0))    AS tarifaBoleto
FROM TBBOLETO b
JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
WHERE b.idEmpresa  = ?
  AND b.cancelado  = 0
  AND b.valorPago  > 0
  AND b.dataPgto   IS NOT NULL
  AND b.dataPgto   <= CURDATE()
GROUP BY b.idimovel, i.nomefantasia, mesRef
HAVING valor > 0;

-- 3. JURÍDICOS NÃO PAGOS (Geração da Foto - usa dataVecto e origem = 6)
SELECT b.idimovel, i.nomefantasia,
       DATE_FORMAT(b.dataVecto, '%Y-%m')   AS mesRef,
       SUM(IFNULL(b.total, 0))             AS valor,
       SUM(IFNULL(b.juros, 0))             AS juros,
       SUM(IFNULL(b.correcao, 0))          AS correcao,
       SUM(IFNULL(b.multa, 0))             AS multa,
       SUM(IFNULL(b.encargo, 0))           AS encargo,
       SUM(IFNULL(b.tarifaBancaria, 0))    AS tarifaBoleto
FROM TBBOLETO b
JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
WHERE b.idEmpresa  = ?
  AND b.pago       = 0
  AND b.cancelado  = 0
  AND b.origem     = 6
  AND b.dataVecto  < CURDATE()
GROUP BY b.idimovel, i.nomefantasia, mesRef;

-- 4. AMIGÁVEL NÃO PAGOS (Geração da Foto - usa dataVecto e origem = 5)
SELECT b.idimovel, i.nomefantasia,
       DATE_FORMAT(b.dataVecto, '%Y-%m')   AS mesRef,
       SUM(IFNULL(b.total, 0))             AS valor,
       SUM(IFNULL(b.juros, 0))             AS juros,
       SUM(IFNULL(b.correcao, 0))          AS correcao,
       SUM(IFNULL(b.multa, 0))             AS multa,
       SUM(IFNULL(b.encargo, 0))           AS encargo,
       SUM(IFNULL(b.tarifaBancaria, 0))    AS tarifaBoleto
FROM TBBOLETO b
JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
WHERE b.idEmpresa  = ?
  AND b.pago       = 0
  AND b.cancelado  = 0
  AND b.origem     = 5
  AND b.dataVecto  < CURDATE()
GROUP BY b.idimovel, i.nomefantasia, mesRef;

-- 5. RECEITAS VARIÁVEIS (Geração da Foto - usa dataPgto)
SELECT b.idimovel, i.nomefantasia,
       DATE_FORMAT(b.dataPgto, '%Y-%m')    AS mesRef,
       SUM(IFNULL(b.correcao, 0))          AS correcao,
       SUM(IFNULL(b.encargo, 0))           AS encargo,
       SUM(IFNULL(b.juros, 0))             AS juros,
       SUM(IFNULL(b.multa, 0))             AS multa,
       SUM(IFNULL(b.tarifaBancaria, 0))    AS tarifaBoleto,
       (SUM(IFNULL(b.correcao, 0)) + SUM(IFNULL(b.encargo, 0))
        + SUM(IFNULL(b.juros, 0)) + SUM(IFNULL(b.multa, 0))
        + SUM(IFNULL(b.tarifaBancaria, 0))) AS valor
FROM TBBOLETO b
JOIN TBIMOVEL i ON i.idEmpresa = b.idEmpresa AND i.idimovel = b.idimovel
WHERE b.idEmpresa  = ?
  AND b.pago       = 1
  AND b.cancelado  = 0
  AND b.dataPgto   IS NOT NULL
  AND b.dataPgto   < CURDATE()
GROUP BY b.idimovel, i.nomefantasia, mesRef
HAVING valor > 0;

-- 6. QUANTIDADE DE UNIDADES (Ativos total de unidades + Inativos com cobrança em aberto)
--    Regra:
--    * Condomínios ATIVOS (com antecipação recente nos últimos 90 dias): contagem total de unidades (TBCLIENTE)
--    * Condomínios INATIVOS: contagem de unidades com cobrança em aberto (TBBOLETO pago=0 e cancelado=0)
SELECT 
  i.idimovel,
  i.nomefantasia,
  'GLOBAL' AS mesRef,
  CASE 
    WHEN atv.idImovel IS NOT NULL THEN
      -- Condomínio ATIVO: total de unidades cadastradas (adimplentes + inadimplentes)
      COALESCE(cli.total_unidades, 0)
    ELSE
      -- Condomínio INATIVO: apenas unidades com cobrança em aberto
      COALESCE(bol_aberto.unidades_aberto, 0)
  END AS valor
FROM TBIMOVEL i
LEFT JOIN (
  SELECT DISTINCT idImovel 
  FROM tbantecipacao 
  WHERE idEmpresa = ?
    AND mesRef >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
) atv ON atv.idImovel = i.idimovel
LEFT JOIN (
  SELECT idImovel, COUNT(DISTINCT idCliente) AS total_unidades
  FROM tbcliente
  WHERE idEmpresa = ?
  GROUP BY idImovel
) cli ON cli.idImovel = i.idimovel
LEFT JOIN (
  SELECT idImovel, COUNT(DISTINCT idCliente) AS unidades_aberto
  FROM tbboleto
  WHERE idEmpresa = ?
    AND pago = 0
    AND cancelado = 0
  GROUP BY idImovel
) bol_aberto ON bol_aberto.idImovel = i.idimovel
WHERE i.idEmpresa = ?
HAVING valor > 0
ORDER BY valor DESC;

-- ===============================================================================
-- DICAS:
-- Como os dados são cacheados (fotografados), ao realizar filtros no Dashboard,
-- o sistema utiliza o campo `mesRef` para todos os cards. 
--
-- Isso funciona corretamente pois o `mesRef` foi populado baseando-se:
-- * No `dataVecto` para (Inadimplência, Jurídicos, Amigável)
-- * No `dataPgto` para (Recebimento, Receitas Variáveis, Recebimento 6 meses)
-- ===============================================================================
SELECT SUM(receitaantecipada) FROM tbAntecipacao WHERE idEmpresa = 75;