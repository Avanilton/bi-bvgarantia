"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw, Clock, Camera, DollarSign, Gavel, Handshake, CheckCircle2 } from "lucide-react";
import { InadimplenciaCard, KpiCard } from "@/components/KpiCards";
import { RecebimentoChart, ComparativoInadimplenciaChart, ReceitasVariaveisChart } from "@/components/Charts";
import { KpiDetailsModal } from "@/components/KpiDetailsModal";
import { formatBRL } from "@/lib/utils";

interface DashData {
  cards: {
    inadimplencia: number;
    recebimento: number;
    juridicos: number;
    amigavel: number;
    inadOrigem5?: number;
    inadOrigem6?: number;
  };
  recebimento6Meses: { mes: string; valor: number; crescimento: number }[];
  faturamento6Meses: { mes: string; valor: number; crescimento: number }[];
  receitasVar: {
    juros: number;
    correcao: number;
    multa: number;
    encargo: number;
    tarifaBoleto: number;
  };
  ultimoSnapshot: string | null;
  snapStatus: string | null;
}

const EMPTY: DashData = {
  cards: { inadimplencia: 0, recebimento: 0, juridicos: 0, amigavel: 0, inadOrigem5: 0, inadOrigem6: 0 },
  recebimento6Meses: [],
  faturamento6Meses: [],
  receitasVar: { juros: 0, correcao: 0, multa: 0, encargo: 0, tarifaBoleto: 0 },
  ultimoSnapshot: null,
  snapStatus: null,
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<DashData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [snapshotLoading, setSnapshotLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const [modalTipo, setModalTipo] = useState<
    "INADIMPLENCIA" | "RECEBIMENTO" | "JURIDICOS" | "AMIGAVEL" | "INAD_ORIGEM_5" | "INAD_ORIGEM_6" | null
  >(null);

  const condoId = searchParams.get("condominio");
  const [condoNome, setCondoNome] = useState<string | null>(null);

  useEffect(() => {
    if (condoId) {
      fetch("/api/condominios")
        .then((r) => r.json())
        .then((d) => {
          const found = d.condominios?.find((c: any) => String(c.IDIMOVEL) === condoId);
          if (found) setCondoNome(found.NOMEFANTASIA);
        })
        .catch(console.error);
    } else {
      setCondoNome(null);
    }
  }, [condoId]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const qs = searchParams.toString();
      const res = await fetch(`/api/dashboard${qs ? `?${qs}` : ""}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setUpdatedAt(new Date());
      }
    } catch (err) {
      console.error("Erro ao buscar dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleForceSnapshot = async () => {
    if (confirm("Deseja extrair uma nova foto do banco de dados completo? Isso pode demorar alguns segundos.")) {
      setSnapshotLoading(true);
      try {
        const res = await fetch("/api/snapshot", { method: "POST" });
        if (res.ok) {
          alert("Foto do banco gerada com sucesso!");
          await fetchData();
        } else {
          alert("Ocorreu um erro ao gerar a foto do banco.");
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao acionar a API de snapshot.");
      } finally {
        setSnapshotLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const snapLabel = data.ultimoSnapshot
    ? new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(data.ultimoSnapshot))
    : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Modal de Detalhes do KPI */}
      <KpiDetailsModal
        isOpen={Boolean(modalTipo)}
        onClose={() => setModalTipo(null)}
        tipo={modalTipo}
        condominio={searchParams.get("condominio") || ""}
        dataInicio={searchParams.get("dataInicio") || ""}
        dataFim={searchParams.get("dataFim") || ""}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 flex-wrap" style={{ color: "#111827" }}>
            Dashboard{" "}
            <span
              className="text-base font-normal"
              style={{ color: "#9ca3af" }}
            >
              BV Garantia
            </span>
            {condoNome && (
              <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold border border-orange-200 shadow-sm animate-fadeIn">
                🏢 {condoNome}
              </span>
            )}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
            {condoNome
              ? `Exibindo indicadores exclusivos do condomínio ${condoNome}`
              : "Indicadores D-1 — todos os valores referem-se ao dia de ontem para trás"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-3">
            {/* Status da última atualização*/}
            {snapLabel && (
              <div
                className="flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5"
                style={{
                  background: data.snapStatus === "OK" ? "#f0fdf4" : "#fef2f2",
                  color: data.snapStatus === "OK" ? "#16a34a" : "#dc2626",
                }}
              >
                <Camera size={12} />
                Foto: {snapLabel}
              </div>
            )}

            {/* Atualizado em */}
            {updatedAt && (
              <div
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "#9ca3af" }}
              >
                <Clock size={12} />
                {updatedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </div>
            )}

            {/* Botões de Ação */}
            <button
              onClick={handleForceSnapshot}
              disabled={snapshotLoading || loading}
              className="btn-secondary"
              style={{ padding: "0.4rem 0.75rem", fontSize: "0.78rem", background: "#fff7ed", color: "#ea580c", borderColor: "#fdba74" }}
            >
              <Camera size={13} className={snapshotLoading ? "animate-spin" : ""} />
              Atualizar dados do banco
            </button>

            <button
              onClick={fetchData}
              disabled={loading || snapshotLoading}
              className="btn-secondary"
              style={{ padding: "0.4rem 0.75rem", fontSize: "0.78rem" }}
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Atualizar Tela
            </button>
          </div>

          {snapLabel && (
            <span className="text-[10px] text-gray-500 italic max-w-[320px] text-right mt-1">
              Podem ocorrer diferenças devido ao tempo de atualização entre o banco de dados real e a API
            </span>
          )}
        </div>
      </div>

      {/* ── 4 Cards KPI ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <InadimplenciaCard
          value={data.cards.inadimplencia}
          loading={loading}
          onClick={() => setModalTipo("INADIMPLENCIA")}
        />

        <KpiCard
          title="Recebimento (D-1)"
          value={data.cards.recebimento}
          icon={CheckCircle2}
          colorGreen
          subtitle="Boletos pagos no mês"
          loading={loading}
          onClick={() => setModalTipo("RECEBIMENTO")}
        />

        <KpiCard
          title="Jurídicos não pagos"
          value={data.cards.juridicos}
          icon={Gavel}
          colorOrange
          subtitle="Origem 6 — vencidos D-1"
          loading={loading}
          onClick={() => setModalTipo("JURIDICOS")}
        />

        <KpiCard
          title="Amigável não pagos"
          value={data.cards.amigavel}
          icon={Handshake}
          colorRed
          subtitle="Origem 5— vencidos D-1"
          loading={loading}
          onClick={() => setModalTipo("AMIGAVEL")}
        />
      </div>

      {/* ── Gráficos linha 1 ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <>
            <div className="card h-64 animate-pulse-soft" style={{ background: "#f9fafb" }} />
            <div className="card h-64 animate-pulse-soft" style={{ background: "#f9fafb" }} />
          </>
        ) : (
          <>
            <ComparativoInadimplenciaChart 
              amigavel={data.cards.inadOrigem5 ?? 0} 
              juridicos={data.cards.inadOrigem6 ?? 0}
              onClickBar={(tipo) => setModalTipo(tipo as any)} 
            />
            <RecebimentoChart data={data.recebimento6Meses} />
          </>
        )}
      </div>

      {/* ── Gráficos linha 2 ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <>
            <div className="card h-64 animate-pulse-soft" style={{ background: "#f9fafb" }} />
            <div className="card h-64 animate-pulse-soft" style={{ background: "#f9fafb" }} />
          </>
        ) : (
          <>
            <ReceitasVariaveisChart data={data.receitasVar} />

            {/* Card de resumo de receitas variáveis detalhado */}
            <div className="card p-5 animate-fadeIn">
              <h3 className="font-semibold text-sm mb-4" style={{ color: "#111827" }}>
                Receitas Variáveis — Detalhes
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Correção", value: data.receitasVar.correcao, color: "#f97316" },
                  { label: "Encargos", value: data.receitasVar.encargo, color: "#4ade80" },
                  { label: "Juros", value: data.receitasVar.juros, color: "#fb923c" },
                  { label: "Multa", value: data.receitasVar.multa, color: "#22c55e" },
                  { label: "Taxa Boleto", value: data.receitasVar.tarifaBoleto, color: "#fdba74" },
                ].map(({ label, value, color }) => {
                  const total =
                    data.receitasVar.correcao +
                    data.receitasVar.encargo +
                    data.receitasVar.juros +
                    data.receitasVar.multa +
                    data.receitasVar.tarifaBoleto;
                  const pct = total > 0 ? (value / total) * 100 : 0;
                  return (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: "#374151" }}>{label}</span>
                        <span className="font-semibold" style={{ color: "#111827" }}>
                          {formatBRL(value)}
                        </span>
                      </div>
                      <div className="w-full rounded-full h-1.5" style={{ background: "#f3f4f6" }}>
                        <div
                          className="h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
