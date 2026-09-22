"use client";

import { useState } from "react";
import {
  AlertTriangle,
  DollarSign,
  Gavel,
  Handshake,
  CheckCircle2,
  LucideIcon,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import { formatBRL } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  colorOrange?: boolean;
  colorGreen?: boolean;
  colorRed?: boolean;
  colorBlue?: boolean;
  subtitle?: string;
  loading?: boolean;
  onClick?: () => void;
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  colorOrange,
  colorGreen,
  colorRed,
  subtitle,
  loading,
  onClick,
}: KpiCardProps) {
  const [hidden, setHidden] = useState(false);

  const bg = colorOrange
    ? "#fff3e0"
    : colorGreen
    ? "#f0fdf4"
    : colorRed
    ? "#fef2f2"
    : "#f0fdf6";

  const iconColor = colorOrange
    ? "#f97316"
    : colorGreen
    ? "#22c55e"
    : colorRed
    ? "#ef4444"
    : "#16a34a";

  return (
    <div
      onClick={onClick}
      className={`card p-5 animate-fadeIn transition-all duration-200 ${
        onClick ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 group" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide group-hover:text-orange-600 transition-colors" style={{ color: "#9ca3af" }}>
          {title}
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Botão olho */}
          <button
            onClick={(e) => { e.stopPropagation(); setHidden((h) => !h); }}
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

      {loading ? (
        <div
          className="h-7 w-32 rounded animate-pulse-soft"
          style={{ background: "#f3f4f6" }}
        />
      ) : (
        <p
          className="text-2xl font-bold tracking-tight transition-all duration-300 select-none"
          style={{
            color: "#111827",
            filter: hidden ? "blur(8px)" : "none",
            userSelect: hidden ? "none" : "auto",
          }}
        >
          {formatBRL(value)}
        </p>
      )}

      <div className="flex items-center justify-between mt-1.5">
        {subtitle && (
          <p className="text-xs" style={{ color: "#9ca3af" }}>
            {subtitle}
          </p>
        )}
        {onClick && (
          <span className="text-[10px] font-semibold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-auto">
            Ver detalhes <ExternalLink size={10} />
          </span>
        )}
      </div>
    </div>
  );
}

// ── Card de Inadimplência com destaque vermelho ───────────────────────────
export function InadimplenciaCard({
  value,
  loading,
  onClick,
}: {
  value: number;
  loading?: boolean;
  onClick?: () => void;
}) {
  const [hidden, setHidden] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`card p-5 animate-fadeIn transition-all duration-200 ${
        onClick ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 group" : ""
      }`}
      style={{
        borderLeft: "4px solid #ef4444",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide group-hover:text-red-600 transition-colors" style={{ color: "#9ca3af" }}>
          Inadimplência (D-1)
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Botão olho */}
          <button
            onClick={(e) => { e.stopPropagation(); setHidden((h) => !h); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-red-50"
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
            style={{ background: "#fef2f2" }}
          >
            <AlertTriangle size={18} style={{ color: "#ef4444" }} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-7 w-32 rounded animate-pulse-soft" style={{ background: "#f3f4f6" }} />
      ) : (
        <p
          className="text-2xl font-bold transition-all duration-300 select-none"
          style={{
            color: "#dc2626",
            filter: hidden ? "blur(8px)" : "none",
            userSelect: hidden ? "none" : "auto",
          }}
        >
          {formatBRL(value)}
        </p>
      )}

      <div className="flex items-center justify-between mt-1.5">
        <p className="text-xs" style={{ color: "#9ca3af" }}>
          Boletos vencidos não pagos
        </p>
        {onClick && (
          <span className="text-[10px] font-semibold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-auto">
            Ver detalhes <ExternalLink size={10} />
          </span>
        )}
      </div>
    </div>
  );
}

export { DollarSign, Gavel, Handshake, CheckCircle2 };
