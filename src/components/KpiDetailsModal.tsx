"use client";

import { useState, useEffect } from "react";
import { X, Search, Loader2, Building2 } from "lucide-react";
import { formatBRL } from "@/lib/utils";

interface CondoValueItem {
  idImovel: number;
  nomeImovel: string;
  valor: number;
}

interface KpiDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: "INADIMPLENCIA" | "RECEBIMENTO" | "JURIDICOS" | "AMIGAVEL" | null;
  condominio?: string;
  dataInicio?: string;
  dataFim?: string;
}

export function KpiDetailsModal({
  isOpen,
  onClose,
  tipo,
  condominio = "",
  dataInicio = "",
  dataFim = "",
}: KpiDetailsModalProps) {
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [comValor, setComValor] = useState<CondoValueItem[]>([]);
  const [zerados, setZerados] = useState<CondoValueItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isOpen || !tipo) return;

    setLoading(true);
    setSearchQuery("");

    const params = new URLSearchParams({ tipo });
    if (condominio) params.set("condominio", condominio);
    if (dataInicio) params.set("dataInicio", dataInicio);
    if (dataFim) params.set("dataFim", dataFim);

    fetch(`/api/dashboard/detalhes?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setTitulo(data.titulo || "Detalhes");
        setComValor(data.comValor || []);
        setZerados(data.zerados || []);
      })
      .catch((err) => console.error("Erro ao carregar detalhes:", err))
      .finally(() => setLoading(false));
  }, [isOpen, tipo, condominio, dataInicio, dataFim]);

  if (!isOpen || !tipo) return null;

  // Filtragem local pela busca
  const q = searchQuery.toLowerCase().trim();
  const filteredComValor = q
    ? comValor.filter((c) => c.nomeImovel.toLowerCase().includes(q))
    : comValor;

  const filteredZerados = q
    ? zerados.filter((c) => c.nomeImovel.toLowerCase().includes(q))
    : zerados;

  const getValueColor = () => {
    switch (tipo) {
      case "INADIMPLENCIA":
        return "#dc2626"; // Vermelho
      case "RECEBIMENTO":
        return "#16a34a"; // Verde
      case "JURIDICOS":
        return "#ea580c"; // Laranja
      case "AMIGAVEL":
        return "#e11d48"; // Rosa/Vermelho
      default:
        return "#111827";
    }
  };

  const valueColor = getValueColor();

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-100 overflow-hidden">
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {titulo}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Dados importados por condomínio
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Campo de Filtro Interno */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Filtrar condomínio por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-8 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Corpo com 2 Colunas */}
        <div className="flex-1 overflow-y-auto p-6 pt-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <Loader2 size={32} className="animate-spin text-orange-500" />
              <p className="text-xs">Carregando detalhes por condomínio...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coluna 1: Importados com Valor */}
              <div className="bg-amber-50/20 rounded-2xl p-4 border border-amber-100/60 flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-bold text-gray-800 tracking-wide uppercase">
                    Importados com Valor
                  </h3>
                  <span className="text-xs font-semibold bg-amber-100/80 text-amber-800 px-2.5 py-0.5 rounded-full">
                    {filteredComValor.length}
                  </span>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {filteredComValor.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-400">
                      Nenhum condomínio com valor encontrado
                    </div>
                  ) : (
                    filteredComValor.map((item) => (
                      <div
                        key={item.idImovel}
                        className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm flex items-center justify-between gap-3 hover:border-orange-200 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Building2 size={13} className="text-gray-400 flex-shrink-0" />
                          <span className="text-xs font-semibold text-gray-700 truncate">
                            {item.nomeImovel}
                          </span>
                        </div>
                        <span
                          className="text-xs font-bold whitespace-nowrap flex-shrink-0"
                          style={{ color: valueColor }}
                        >
                          {formatBRL(item.valor)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Coluna 2: Zerados */}
              <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-200/60 flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-bold text-gray-600 tracking-wide uppercase">
                    Zerados
                  </h3>
                  <span className="text-xs font-semibold bg-gray-200/70 text-gray-600 px-2.5 py-0.5 rounded-full">
                    {filteredZerados.length}
                  </span>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {filteredZerados.length === 0 ? (
                    <div className="p-8 text-center text-xs text-gray-400">
                      Nenhum condomínio zerado
                    </div>
                  ) : (
                    filteredZerados.map((item) => (
                      <div
                        key={item.idImovel}
                        className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm flex items-center justify-between gap-3 opacity-80"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Building2 size={13} className="text-gray-400 flex-shrink-0" />
                          <span className="text-xs font-medium text-gray-600 truncate">
                            {item.nomeImovel}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium bg-gray-100 text-gray-400 px-2.5 py-0.5 rounded-md flex-shrink-0">
                          Zerado
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/30">
          <button
            onClick={onClose}
            className="bg-slate-900 text-white hover:bg-black font-semibold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
