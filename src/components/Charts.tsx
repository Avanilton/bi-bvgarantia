"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
  ComposedChart, PieChart, Pie, Cell, LabelList
} from "recharts";
import { formatBRL, formatPct } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

// ── Tooltip customizado ──────────────────────────────────────────────────────
const CustomTooltip = ({
  active,
  payload,
  label,
  prefix = "R$ ",
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  prefix?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="card p-3 text-xs"
      style={{ minWidth: 130, boxShadow: "0 4px 16px rgb(0 0 0 / 0.12)" }}
    >
      <p className="font-semibold mb-1" style={{ color: "#374151" }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span style={{ color: "#6b7280" }}>{p.name}:</span>
          <span className="font-medium" style={{ color: "#111827" }}>
            {p.name === "Crescimento (%)" || p.name === "crescimento"
              ? formatPct(p.value)
              : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Recebimento 6 Meses ─────────────────────────────────────────────────────
export function RecebimentoChart({ data }: { data: { mes: string; valor: number; crescimento: number }[] }) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-sm mb-4" style={{ color: "#111827" }}>
        Recebimento — Últimos 6 Meses
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 20, left: 0, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickFormatter={(v) =>
              new Intl.NumberFormat("pt-BR", { notation: "compact", currency: "BRL", style: "currency" }).format(v)
            }
            width={72}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickFormatter={(v) => `${v}%`}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, color: "#6b7280" }} />
          <Bar dataKey="valor" name="Recebido" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} yAxisId="left">
            <LabelList
              dataKey="valor"
              position="top"
              formatter={(v: any) => {
                if (v == null) return "";
                const num = Number(v);
                return isNaN(num) ? "" : Math.floor(num / 1000).toLocaleString("pt-BR");
              }}
              style={{ fontSize: 10, fill: "#6b7280", fontWeight: 600 }}
            />
          </Bar>
          <Line
            type="monotone"
            dataKey="crescimento"
            name="Crescimento (%)"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: "#22c55e", r: 3 }}
            yAxisId="right"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Comparativo Inadimplência ───────────────────────────────────────────────
export function ComparativoInadimplenciaChart({ 
  amigavel, 
  juridicos,
  onClickBar
}: { 
  amigavel: number; 
  juridicos: number;
  onClickBar?: (tipo: string) => void;
}) {
  const data = [
    { name: "Inadimplência", amigavel, juridicos }
  ];
  return (
    <div 
      className={`card p-5 transition-all duration-200 ${onClickBar ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 group" : ""}`}
      onClick={() => onClickBar?.("INADIMPLENCIA")}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm" style={{ color: "#111827" }}>
          Posição da Carteira
        </h3>
        {onClickBar && (
          <span className="text-[10px] font-semibold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            Ver detalhes <ExternalLink size={10} />
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 25, left: 0, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
          <YAxis
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickFormatter={(v) =>
              new Intl.NumberFormat("pt-BR", { notation: "compact", currency: "BRL", style: "currency" }).format(v)
            }
            width={72}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, color: "#6b7280" }} />
          <Bar 
            dataKey="amigavel" 
            name="Amigável (Origem 5)" 
            fill="#22c55e" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={60}
            onClick={(data, index, e) => {
              e?.stopPropagation();
              onClickBar?.("INAD_ORIGEM_5");
            }}
            cursor="pointer"
          >
            <LabelList
              dataKey="amigavel"
              position="top"
              formatter={(v: any) => {
                if (v == null) return "";
                const num = Number(v);
                return isNaN(num) ? "" : (num / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "k";
              }}
              style={{ fontSize: 10, fill: "#6b7280", fontWeight: 600 }}
            />
          </Bar>
          <Bar 
            dataKey="juridicos" 
            name="Jurídico (Origem 6)" 
            fill="#f97316" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={60}
            onClick={(data, index, e) => {
              e?.stopPropagation();
              onClickBar?.("INAD_ORIGEM_6");
            }}
            cursor="pointer"
          >
            <LabelList
              dataKey="juridicos"
              position="top"
              formatter={(v: any) => {
                if (v == null) return "";
                const num = Number(v);
                return isNaN(num) ? "" : (num / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "k";
              }}
              style={{ fontSize: 10, fill: "#6b7280", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Receitas Variáveis (Pizza) ──────────────────────────────────────────────
const COLORS = ["#f97316", "#4ade80", "#fb923c", "#22c55e", "#fdba74"];

export function ReceitasVariaveisChart({
  data,
}: {
  data: {
    juros: number;
    correcao: number;
    multa: number;
    encargo: number;
    tarifaBoleto: number;
  };
}) {
  const total =
    data.juros + data.correcao + data.multa + data.encargo + data.tarifaBoleto;

  const pieData = [
    { name: "Correção", value: data.correcao },
    { name: "Encargos", value: data.encargo },
    { name: "Juros", value: data.juros },
    { name: "Multa", value: data.multa },
    { name: "Taxa Boleto", value: data.tarifaBoleto },
  ].filter((d) => d.value > 0);

  const pct = (v: number) => (total > 0 ? ((v / total) * 100).toFixed(1) : "0.0");

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }: any) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-sm mb-4" style={{ color: "#111827" }}>
        Receitas Variáveis (%)
      </h3>
      {total === 0 ? (
        <div className="flex items-center justify-center h-44 text-sm" style={{ color: "#9ca3af" }}>
          Sem dados — execute o Snapshot
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <ResponsiveContainer width="50%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                labelLine={false}
                label={renderLabel}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any, name: any) => [
                  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v)),
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 flex flex-col gap-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="flex-1 truncate" style={{ color: "#374151" }}>
                  {d.name}
                </span>
                <span className="font-semibold" style={{ color: "#111827" }}>
                  {pct(d.value)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Concentração de Imóveis por Estado ──────────────────────────────────────
// TODO: substituir por dados reais quando o campo de UF for identificado no banco
export const MOCK_IMOVEIS_POR_ESTADO: { uf: string; qtde: number }[] = [
  { uf: "SP", qtde: 142 },
  { uf: "RJ", qtde: 87 },
  { uf: "MG", qtde: 64 },
  { uf: "PR", qtde: 41 },
  { uf: "SC", qtde: 33 },
  { uf: "RS", qtde: 28 },
  { uf: "BA", qtde: 19 },
  { uf: "GO", qtde: 12 },
  { uf: "DF", qtde: 9 },
  { uf: "PE", qtde: 7 },
];

const ESTADO_CORES = ["#f97316", "#22c55e", "#3b82f6", "#a855f7", "#eab308", "#9ca3af"];

export function ImoveisPorEstadoChart({
  data = MOCK_IMOVEIS_POR_ESTADO,
  ficticio = true,
}: {
  data?: { uf: string; qtde: number }[];
  ficticio?: boolean;
}) {
  const sorted = [...data].sort((a, b) => b.qtde - a.qtde);
  const top5 = sorted.slice(0, 5);
  const outros = sorted.slice(5).reduce((s, d) => s + d.qtde, 0);
  const chartData = outros > 0 ? [...top5, { uf: "Outros", qtde: outros }] : top5;

  return (
    <div className="card p-5 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm" style={{ color: "#111827" }}>
          Concentração de Imóveis por Estado
        </h3>
        {ficticio && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
            Dados fictícios
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={chartData} margin={{ top: 18, left: 0, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="uf" tick={{ fontSize: 11, fill: "#6b7280" }} />
          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} width={32} allowDecimals={false} />
          <Tooltip
            formatter={(v: any) => [Number(v).toLocaleString("pt-BR"), "Imóveis"]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="qtde" name="Imóveis" radius={[4, 4, 0, 0]} maxBarSize={44}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={ESTADO_CORES[i % ESTADO_CORES.length]} />
            ))}
            <LabelList dataKey="qtde" position="top" style={{ fontSize: 10, fill: "#6b7280", fontWeight: 600 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Inadimplência por Situação (top 4 + Outros) ─────────────────────────────
// TODO: dados fictícios até a coluna `situacao` existir no banco
export const MOCK_INAD_POR_SITUACAO = [
  { situacao: "Em cobrança", valor: 185000 },
  { situacao: "Acordo", valor: 122000 },
  { situacao: "Jurídico", valor: 96000 },
  { situacao: "Notificado", valor: 54000 },
  { situacao: "Outros", valor: 31000 },
];

export function InadimplenciaPorSituacaoChart({
  data: dataProp,
}: {
  data: { situacao: string; valor: number }[];
}) {
  const ficticio = dataProp.length === 0;
  const data = ficticio ? MOCK_INAD_POR_SITUACAO : dataProp;
  const fmtCompact = (v: number) =>
    v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1).replace(".", ",")}M`
    : v >= 1_000 ? `${(v / 1_000).toFixed(0)}k`
    : String(Math.round(v));

  return (
    <div className="card p-5 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm" style={{ color: "#111827" }}>
          Inadimplência por Situação
        </h3>
        {ficticio && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
            Dados fictícios
          </span>
        )}
      </div>
      {(
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={data} margin={{ top: 18, left: 0, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="situacao" tick={{ fontSize: 10, fill: "#6b7280" }} interval={0} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} width={40} tickFormatter={fmtCompact} />
            <Tooltip
              formatter={(v: any) => [formatBRL(Number(v)), "Inadimplência"]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar dataKey="valor" name="Inadimplência" radius={[4, 4, 0, 0]} maxBarSize={44}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.situacao === "Outros" ? "#9ca3af" : ESTADO_CORES[i % ESTADO_CORES.length]} />
              ))}
              <LabelList dataKey="valor" position="top" formatter={(v: any) => fmtCompact(Number(v))} style={{ fontSize: 10, fill: "#6b7280", fontWeight: 600 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
