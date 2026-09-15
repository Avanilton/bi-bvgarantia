import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  DollarSign,
  Gavel,
  Handshake,
  CheckCircle2,
  LucideIcon,
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
}: KpiCardProps) {
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
    <div className="card p-5 animate-fadeIn">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#9ca3af" }}>
          {title}
        </p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: bg }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
      </div>

      {loading ? (
        <div
          className="h-7 w-32 rounded animate-pulse-soft"
          style={{ background: "#f3f4f6" }}
        />
      ) : (
        <p className="text-2xl font-bold tracking-tight" style={{ color: "#111827" }}>
          {formatBRL(value)}
        </p>
      )}

      {subtitle && (
        <p className="text-xs mt-1.5" style={{ color: "#9ca3af" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Card de Inadimplência com destaque vermelho ───────────────────────────
export function InadimplenciaCard({ value, loading }: { value: number; loading?: boolean }) {
  return (
    <div
      className="card p-5 animate-fadeIn"
      style={{
        borderLeft: "4px solid #ef4444",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#9ca3af" }}>
          Inadimplência (D-1)
        </p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#fef2f2" }}>
          <AlertTriangle size={18} style={{ color: "#ef4444" }} />
        </div>
      </div>

      {loading ? (
        <div className="h-7 w-32 rounded animate-pulse-soft" style={{ background: "#f3f4f6" }} />
      ) : (
        <p className="text-2xl font-bold" style={{ color: "#dc2626" }}>
          {formatBRL(value)}
        </p>
      )}
      <p className="text-xs mt-1.5" style={{ color: "#9ca3af" }}>
        Boletos vencidos não pagos
      </p>
    </div>
  );
}

export { DollarSign, Gavel, Handshake, CheckCircle2 };
