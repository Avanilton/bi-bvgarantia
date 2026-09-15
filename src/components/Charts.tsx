"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
  ComposedChart, PieChart, Pie, Cell,
} from "recharts";
import { formatBRL, formatPct } from "@/lib/utils";

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
        <ComposedChart data={data} margin={{ left: 0, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} />
          <YAxis
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickFormatter={(v) =>
              new Intl.NumberFormat("pt-BR", { notation: "compact", currency: "BRL", style: "currency" }).format(v)
            }
            width={72}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, color: "#6b7280" }} />
          <Bar dataKey="valor" name="Recebido" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Line
            type="monotone"
            dataKey="crescimento"
            name="Crescimento (%)"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: "#22c55e", r: 3 }}
            yAxisId={0}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Faturamento & Crescimento ───────────────────────────────────────────────
export function FaturamentoChart({ data }: { data: { mes: string; valor: number; crescimento: number }[] }) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-sm mb-4" style={{ color: "#111827" }}>
        Faturamento & Crescimento
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ left: 0, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} />
          <YAxis
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickFormatter={(v) =>
              new Intl.NumberFormat("pt-BR", { notation: "compact", currency: "BRL", style: "currency" }).format(v)
            }
            width={72}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, color: "#6b7280" }} />
          <Bar dataKey="valor" name="Faturamento" fill="#4ade80" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Line
            type="monotone"
            dataKey="crescimento"
            name="Crescimento (%)"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ fill: "#f97316", r: 3 }}
          />
        </ComposedChart>
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
