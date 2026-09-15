"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw, Clock, Camera, DollarSign, Gavel, Handshake, CheckCircle2 } from "lucide-react";
import { InadimplenciaCard, KpiCard } from "@/components/KpiCards";
import { RecebimentoChart, FaturamentoChart, ReceitasVariaveisChart } from "@/components/Charts";
import { formatBRL } from "@/lib/utils";

interface DashData {
  cards: {
    inadimplencia: number;
    recebimento: number;
    juridicos: number;
    amigavel: number;
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
  cards: { inadimplencia: 0, recebimento: 0, juridicos: 0, amigavel: 0 },
  recebimento6Meses: [],
  faturamento6Meses: [],
  receitasVar: { juros: 0, correcao: 0, multa: 0, encargo: 0, tarifaBoleto: 0 },
  ultimoSnapshot: null,
  snapStatus: null,
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<DashData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

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

        <div className="flex items-center gap-3">
          {/* Status do último snapshot */}
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

          {/* Botão refresh */}
          <button
            onClick={fetchData}
            disabled={loading}
            className="btn-secondary"
            style={{ padding: "0.4rem 0.75rem", fontSize: "0.78rem" }}
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>
      </div>

      {/* ── 4 Cards KPI ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <InadimplenciaCard value={data.cards.inadimplencia} loading={loading} />

        <KpiCard
          title="Recebimento (D-1)"
          value={data.cards.recebimento}
          icon={CheckCircle2}
          colorGreen
          subtitle="Boletos pagos até ontem"
          loading={loading}
        />

        <KpiCard
          title="Jurídicos não pagos"
          value={data.cards.juridicos}
          icon={Gavel}
          colorOrange
          subtitle="Origem 5 — vencidos D-1"
          loading={loading}
        />

        <KpiCard
          title="Amigável não pagos"
          value={data.cards.amigavel}
          icon={Handshake}
          colorRed
          subtitle="Origem 6 — vencidos D-1"
          loading={loading}
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
            <RecebimentoChart data={data.recebimento6Meses} />
            <FaturamentoChart data={data.faturamento6Meses} />
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
