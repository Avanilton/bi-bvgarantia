"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BarChart3,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  Calendar,
  X,
  Filter,
  Search,
  Check,
} from "lucide-react";

interface Condominio {
  IDIMOVEL: number;
  NOMEFANTASIA: string;
}

const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutos

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [condominios, setCondominios] = useState<Condominio[]>([]);
  const [condominio, setCondominio] = useState(searchParams.get("condominio") || "");
  const [searchCondo, setSearchCondo] = useState("");
  const [isCondoOpen, setIsCondoOpen] = useState(false);
  const [dataInicio, setDataInicio] = useState(searchParams.get("dataInicio") || "");
  const [dataFim, setDataFim] = useState(searchParams.get("dataFim") || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const condoDropdownRef = useRef<HTMLDivElement | null>(null);

  // Sincroniza nome do condomínio selecionado
  useEffect(() => {
    if (condominio && condominios.length > 0) {
      const selected = condominios.find((c) => String(c.IDIMOVEL) === condominio);
      if (selected) {
        setSearchCondo(selected.NOMEFANTASIA);
      }
    } else if (!condominio) {
      setSearchCondo("");
    }
  }, [condominio, condominios]);

  // Fecha dropdown de condomínios ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (condoDropdownRef.current && !condoDropdownRef.current.contains(e.target as Node)) {
        setIsCondoOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Busca condomínios
  useEffect(() => {
    fetch("/api/condominios")
      .then((r) => r.json())
      .then((d) => setCondominios(d.condominios || []))
      .catch(console.error);
  }, []);

  // Logout por inatividade
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      signOut({ callbackUrl: "/login" });
    }, TIMEOUT_MS);
  }, []);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    resetTimer();
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);

  // Aplica filtros na URL com id customizado
  const applyFiltersWithCondo = (newCondoId: string) => {
    setCondominio(newCondoId);
    const params = new URLSearchParams();
    if (newCondoId) params.set("condominio", newCondoId);
    if (dataInicio) params.set("dataInicio", dataInicio);
    if (dataFim) params.set("dataFim", dataFim);
    router.push(`${pathname}?${params.toString()}`);
    setMobileOpen(false);
  };

  // Aplica filtros na URL usando o estado atual
  const applyFilters = () => {
    applyFiltersWithCondo(condominio);
  };

  const clearFilters = () => {
    setCondominio("");
    setSearchCondo("");
    setDataInicio("");
    setDataFim("");
    router.push(pathname);
    setMobileOpen(false);
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/configuracoes", label: "Configurações", icon: Settings },
  ];

  const selectedCondo = condominios.find((c) => String(c.IDIMOVEL) === condominio);
  const selectedName = selectedCondo ? selectedCondo.NOMEFANTASIA : "";

  // Se o texto é igual ao nome do selecionado, mostra todos os condomínios na lista.
  // Se o usuário digitou uma nova busca, filtra pelo texto.
  const isFiltering = Boolean(searchCondo && searchCondo.trim() !== selectedName.trim());

  const filteredCondominios = isFiltering
    ? condominios.filter((c) =>
        c.NOMEFANTASIA?.toLowerCase().includes(searchCondo.toLowerCase())
      )
    : condominios;

  const hasFilters = Boolean(condominio || dataInicio || dataFim);

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "#f3e8d6" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #f97316, #fb923c)",
              boxShadow: "0 2px 8px rgb(249 115 22 / 0.3)",
            }}
          >
            <BarChart3 size={18} color="white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight" style={{ color: "#111827" }}>
              BI - BVGarantia
            </p>
            <p className="text-xs" style={{ color: "#9ca3af" }}>
              Indicadores Financeiros
            </p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="px-3 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2 px-2" style={{ color: "#d1d5db" }}>
          Menu
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                  style={
                    active
                      ? {
                          background: "linear-gradient(135deg, #fff3e0, #fef3ec)",
                          color: "#ea6c0a",
                          boxShadow: "inset 0 0 0 1px #fed7aa",
                        }
                      : { color: "#374151" }
                  }
                >
                  <Icon
                    size={17}
                    style={{ color: active ? "#f97316" : "#9ca3af" }}
                  />
                  {label}
                  {active && (
                    <div
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ background: "#f97316" }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Divisor */}
      <div className="mx-4 border-t my-1" style={{ borderColor: "#f3f4f6" }} />

      {/* Filtros */}
      <div className="px-3 py-4 flex-1 overflow-y-auto">
        <div className="flex items-center gap-1.5 mb-3 px-2">
          <Filter size={13} style={{ color: "#9ca3af" }} />
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#d1d5db" }}>
            Filtros
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs flex items-center gap-0.5 font-medium"
              style={{ color: "#f97316", background: "none", border: "none", cursor: "pointer" }}
            >
              <X size={11} /> Limpar
            </button>
          )}
        </div>

        {/* Condomínio com Pesquisa por Nome */}
        <div className="mb-3 relative" ref={condoDropdownRef}>
          <label className="block text-xs font-medium mb-1 px-1" style={{ color: "#6b7280" }}>
            <Building2 size={11} className="inline mr-1" />
            Condomínio
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={searchCondo}
              onFocus={(e) => {
                setIsCondoOpen(true);
                e.target.select();
              }}
              onClick={() => setIsCondoOpen(true)}
              onChange={(e) => {
                const val = e.target.value;
                setSearchCondo(val);
                setIsCondoOpen(true);
                if (!val.trim()) {
                  setCondominio("");
                }
              }}
              className="input-base text-xs"
              style={{ fontSize: "0.75rem", paddingLeft: "2.25rem", paddingRight: "2rem" }}
            />
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#9ca3af" }}
            />
            {searchCondo ? (
              <button
                type="button"
                onClick={() => {
                  setSearchCondo("");
                  setIsCondoOpen(false);
                  applyFiltersWithCondo("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded"
              >
                <X size={12} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsCondoOpen((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded"
              >
                <ChevronDown size={13} />
              </button>
            )}
          </div>

          {/* Lista de Opções Dropdown */}
          {isCondoOpen && (
            <div
              className="absolute z-50 left-0 right-0 mt-1 bg-white border border-amber-100 rounded-xl shadow-lg max-h-48 overflow-y-auto py-1"
              style={{ fontSize: "0.75rem" }}
            >
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  setSearchCondo("");
                  setIsCondoOpen(false);
                  applyFiltersWithCondo("");
                }}
                className={`px-3 py-1.5 cursor-pointer hover:bg-orange-50 flex items-center justify-between text-xs ${
                  !condominio ? "font-semibold text-orange-600 bg-orange-50/50" : "text-gray-700"
                }`}
              >
                <span>Todos os condomínios</span>
                {!condominio && <Check size={12} className="text-orange-500" />}
              </div>

              {filteredCondominios.length === 0 ? (
                <div className="px-3 py-2 text-xs text-gray-400 text-center">
                  Nenhum condomínio encontrado
                </div>
              ) : (
                filteredCondominios.map((c) => {
                  const isSelected = String(c.IDIMOVEL) === condominio;
                  return (
                    <div
                      key={c.IDIMOVEL}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSearchCondo(c.NOMEFANTASIA);
                        setIsCondoOpen(false);
                        applyFiltersWithCondo(String(c.IDIMOVEL));
                      }}
                      className={`px-3 py-1.5 cursor-pointer hover:bg-orange-50 flex items-center justify-between text-xs ${
                        isSelected ? "font-semibold text-orange-600 bg-orange-50/50" : "text-gray-700"
                      }`}
                    >
                      <span className="truncate mr-2">{c.NOMEFANTASIA}</span>
                      {isSelected && <Check size={12} className="text-orange-500 flex-shrink-0" />}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Data Início */}
        <div className="mb-3">
          <label className="block text-xs font-medium mb-1 px-1" style={{ color: "#6b7280" }}>
            <Calendar size={11} className="inline mr-1" />
            Data Início
          </label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="input-base"
            style={{ fontSize: "0.75rem" }}
          />
        </div>

        {/* Data Fim */}
        <div className="mb-4">
          <label className="block text-xs font-medium mb-1 px-1" style={{ color: "#6b7280" }}>
            <Calendar size={11} className="inline mr-1" />
            Data Fim
          </label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="input-base"
            style={{ fontSize: "0.75rem" }}
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col gap-2">
          <button
            onClick={applyFilters}
            className="btn-primary w-full justify-center text-xs"
            style={{ padding: "0.5rem 0.75rem", fontSize: "0.78rem" }}
          >
            <Filter size={13} /> Aplicar Filtros
          </button>
          
          <button
            onClick={clearFilters}
            className="w-full justify-center text-xs flex items-center gap-1.5 py-2 px-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium"
            style={{ fontSize: "0.78rem" }}
          >
            <X size={13} /> Limpar Filtros
          </button>
        </div>
      </div>

      {/* Rodapé — Sair */}
      <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: "#f3f4f6" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: "#6b7280" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
            (e.currentTarget as HTMLButtonElement).style.color = "#dc2626";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
          }}
        >
          <LogOut size={16} />
          Sair da conta
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Botão mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
        style={{ background: "#f97316", color: "white" }}
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? <X size={20} /> : <BarChart3 size={20} />}
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar desktop */}
      <aside
        className="hidden md:flex flex-col w-64 min-h-screen border-r fixed top-0 left-0 z-30"
        style={{
          background: "linear-gradient(180deg, #fffbf7 0%, #f9fafb 100%)",
          borderColor: "#f3e8d6",
        }}
      >
        {renderSidebarContent()}
      </aside>

      {/* Sidebar mobile */}
      <aside
        className="md:hidden fixed top-0 left-0 h-full w-72 z-50 flex flex-col transition-transform duration-300 shadow-2xl"
        style={{
          background: "linear-gradient(180deg, #fffbf7 0%, #f9fafb 100%)",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {renderSidebarContent()}
      </aside>
    </>
  );
}
