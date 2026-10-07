"use client";

import { useState } from "react";
import { Users, UserPlus, Briefcase, Clock, UserMinus, DollarSign, HeartPulse, Eye, EyeOff } from "lucide-react";
import { formatBRL } from "@/lib/utils";

function RhCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  format = "number",
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
  subtitle?: string;
  format?: "number" | "currency" | "percent" | "hours";
}) {
  const [hidden, setHidden] = useState(false);

  const formattedValue = (() => {
    if (format === "currency") return formatBRL(value);
    if (format === "percent") return `${value.toFixed(1)}%`;
    if (format === "hours") return `${value.toLocaleString("pt-BR")}h`;
    return value.toLocaleString("pt-BR");
  })();

  const bg = `${color}15`; // hex with opacity approx 10%
  const iconColor = color;

  return (
    <div className="card p-5 animate-fadeIn transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group bg-white border border-gray-100 rounded-xl shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide group-hover:text-orange-600 transition-colors" style={{ color: "#9ca3af" }}>
          {title}
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setHidden((h) => !h)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-gray-100"
            title={hidden ? "Mostrar valor" : "Ocultar valor"}
          >
            {hidden ? (
              <EyeOff size={14} style={{ color: "#9ca3af" }} />
            ) : (
              <Eye size={14} style={{ color: "#9ca3af" }} />
            )}
          </button>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
            style={{ background: bg }}
          >
            <Icon size={18} style={{ color: iconColor }} />
          </div>
        </div>
      </div>

      <p
        className="text-2xl font-bold tracking-tight transition-all duration-300 select-none"
        style={{
          color: "#111827",
          filter: hidden ? "blur(8px)" : "none",
          userSelect: hidden ? "none" : "auto",
        }}
      >
        {formattedValue}
      </p>

      {subtitle && (
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs" style={{ color: "#9ca3af" }}>
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}

export function RhClientPage() {
  // Dados fictícios
  const data = {
    headcountTotal: 145,
    headcountMes: 12,
    admissoesGeral: 15,
    vagasPercentual: 8.5,
    bancoHoras: 340,
    turnoverGeral: 2.3,
    custoFolha: 1250000.00,
    custoBeneficio: 320000.00,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>Recursos Humanos</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
          Indicadores e métricas de RH (Valores fictícios - Em desenvolvimento)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RhCard
          title="HeadCount (Total)"
          value={data.headcountTotal}
          icon={Users}
          color="#3b82f6"
          subtitle={`+${data.headcountMes} no último mês`}
          format="number"
        />
        <RhCard
          title="Admissões (Geral)"
          value={data.admissoesGeral}
          icon={UserPlus}
          color="#10b981"
          subtitle="Distribuição por dpto em breve"
          format="number"
        />
        <RhCard
          title="Vagas Abertas"
          value={data.vagasPercentual}
          icon={Briefcase}
          color="#f59e0b"
          subtitle="% em relação ao quadro atual"
          format="percent"
        />
        <RhCard
          title="Turnover (Geral)"
          value={data.turnoverGeral}
          icon={UserMinus}
          color="#ef4444"
          subtitle="Detalhes por dpto em breve"
          format="percent"
        />
        <RhCard
          title="Banco de Horas"
          value={data.bancoHoras}
          icon={Clock}
          color="#8b5cf6"
          subtitle="Horas acumuladas ativas"
          format="hours"
        />
        <RhCard
          title="Custo Folha"
          value={data.custoFolha}
          icon={DollarSign}
          color="#f97316"
          subtitle="Valor bruto da folha mensal"
          format="currency"
        />
        <RhCard
          title="Custo Benefícios"
          value={data.custoBeneficio}
          icon={HeartPulse}
          color="#ec4899"
          subtitle="VA, VR, VT, Plano de Saúde, etc."
          format="currency"
        />
      </div>
    </div>
  );
}
