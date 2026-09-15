"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Users, Key, Shield, Camera, Plus, Trash2, Pencil, Eye, EyeOff,
  CheckCircle2, XCircle, AlertTriangle, RefreshCw, Clock, Save,
} from "lucide-react";
// Camera mantido: usado no ícone da aba "Snapshot" no array de tabs

type Perfil = "ADMIN" | "OPERADOR" | "VISUALIZADOR";
const TELAS = ["dashboard", "configuracoes"];
const TELA_LABELS: Record<string, string> = {
  dashboard: "Dashboard Principal",
  configuracoes: "Configurações",
};

interface Usuario {
  id: number;
  email: string;
  nome: string;
  perfil: Perfil;
  ativo: boolean;
  acessos: string; // JSON
}

interface Snapshot {
  id: number;
  criadoEm: string;
  tipoSnap: string;
  status: string;
  mensagem: string | null;
  duracaoMs: number | null;
}

// ── Helper ──────────────────────────────────────────────────────────────────
const Toast = ({ msg, ok }: { msg: string; ok: boolean }) => (
  <div
    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fadeIn"
    style={{
      background: ok ? "#f0fdf4" : "#fef2f2",
      color: ok ? "#16a34a" : "#dc2626",
      border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}`,
    }}
  >
    {ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
    {msg}
  </div>
);

// ── Tabs ────────────────────────────────────────────────────────────────────
const tabs = [
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "senha", label: "Alterar Senha", icon: Key },
  { id: "acessos", label: "Acessos", icon: Shield },
  { id: "snapshot", label: "Snapshot", icon: Camera },
];

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("usuarios");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto pb-8">
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>Configurações</h1>
        <p className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>
          Gerencie usuários, senhas, acessos e snapshots
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "#f3f4f6" }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center"
            style={
              activeTab === id
                ? {
                    background: "white",
                    color: "#f97316",
                    boxShadow: "0 1px 4px rgb(0 0 0 / 0.08)",
                  }
                : { color: "#6b7280", background: "transparent" }
            }
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fadeIn">
        {activeTab === "usuarios" && <TabUsuarios showToast={showToast} />}
        {activeTab === "senha" && <TabSenha showToast={showToast} />}
        {activeTab === "acessos" && <TabAcessos showToast={showToast} />}
        {activeTab === "snapshot" && <TabSnapshot showToast={showToast} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab: Usuários
// ═══════════════════════════════════════════════════════════════════════════
function TabUsuarios({ showToast }: { showToast: (m: string, ok: boolean) => void }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<Usuario | null>(null);

  // Form state
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState<Perfil>("VISUALIZADOR");
  const [showSenha, setShowSenha] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErro, setFormErro] = useState("");

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/usuarios");
    const d = await r.json();
    setUsuarios(d.usuarios || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setNome(""); setEmail(""); setSenha(""); setPerfil("VISUALIZADOR");
    setEditUser(null); setShowForm(false); setFormErro("");
  };

  const openEdit = (u: Usuario) => {
    setEditUser(u);
    setNome(u.nome);
    setEmail(u.email);
    setSenha("");
    setPerfil(u.perfil);
    setShowForm(true);
  };

  const validate = (): string => {
    if (!nome.trim()) return "Nome é obrigatório.";
    if (!email.trim()) return "E-mail é obrigatório.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "E-mail inválido.";
    if (!editUser && !senha) return "Senha é obrigatória para novo usuário.";
    if (senha && senha.length < 6) return "Senha deve ter pelo menos 6 caracteres.";
    return "";
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setFormErro(err); return; }
    setSaving(true);
    setFormErro("");
    try {
      let res;
      if (editUser) {
        res = await fetch("/api/usuarios", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editUser.id, nome, perfil, novaSenha: senha || undefined }),
        });
      } else {
        res = await fetch("/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, nome, senha, perfil }),
        });
      }
      const d = await res.json();
      if (!res.ok) { setFormErro(d.error || "Erro ao salvar."); return; }
      showToast(editUser ? "Usuário atualizado!" : "Usuário criado!", true);
      resetForm();
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, userEmail: string) => {
    if (!confirm(`Excluir usuário ${userEmail}?`)) return;
    const res = await fetch(`/api/usuarios?id=${id}`, { method: "DELETE" });
    if (res.ok) { showToast("Usuário excluído.", true); load(); }
    else showToast("Erro ao excluir.", false);
  };

  const handleToggleAtivo = async (u: Usuario) => {
    const res = await fetch("/api/usuarios", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, ativo: !u.ativo }),
    });
    if (res.ok) { load(); }
  };

  const PERFIL_BADGE: Record<Perfil, string> = {
    ADMIN: "badge badge-orange",
    OPERADOR: "badge badge-green",
    VISUALIZADOR: "badge badge-gray",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: "#374151" }}>
          {usuarios.length} usuário{usuarios.length !== 1 ? "s" : ""} cadastrado{usuarios.length !== 1 ? "s" : ""}
        </p>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus size={15} /> Novo Usuário
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="card p-5 border-l-4 animate-fadeIn" style={{ borderLeftColor: "#f97316" }}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: "#111827" }}>
            {editUser ? "Editar Usuário" : "Novo Usuário"}
          </h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4" noValidate>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#374151" }}>Nome *</label>
              <input className="input-base" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#374151" }}>E-mail *</label>
              <input
                className="input-base"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@dominio.com"
                disabled={!!editUser}
              />
            </div>
            <div className="relative">
              <label className="block text-xs font-medium mb-1" style={{ color: "#374151" }}>
                {editUser ? "Nova Senha (opcional)" : "Senha *"}
              </label>
              <input
                className="input-base pr-10"
                type={showSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder={editUser ? "Deixe vazio para não alterar" : "Mín. 6 caracteres"}
              />
              <button type="button" onClick={() => setShowSenha((v) => !v)}
                className="absolute right-3 top-7" style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>
                {showSenha ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "#374151" }}>Perfil *</label>
              <select className="input-base" value={perfil} onChange={(e) => setPerfil(e.target.value as Perfil)}>
                <option value="ADMIN">Administrador</option>
                <option value="OPERADOR">Operador</option>
                <option value="VISUALIZADOR">Visualizador</option>
              </select>
            </div>
            {formErro && (
              <div className="col-span-2 rounded-lg px-3 py-2 text-xs flex items-center gap-1.5"
                style={{ background: "#fee2e2", color: "#dc2626" }}>
                <AlertTriangle size={13} /> {formErro}
              </div>
            )}
            <div className="col-span-2 flex gap-2 justify-end">
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancelar</button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {["Nome", "E-mail", "Perfil", "Status", "Ações"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#6b7280" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded animate-pulse-soft" style={{ background: "#f3f4f6", width: "80%" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: "#9ca3af" }}>
                    Nenhum usuário cadastrado
                  </td>
                </tr>
              ) : (
                usuarios.map((u, i) => (
                  <tr key={u.id} style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : undefined }}>
                    <td className="px-4 py-3 font-medium" style={{ color: "#111827" }}>{u.nome}</td>
                    <td className="px-4 py-3" style={{ color: "#6b7280" }}>{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={PERFIL_BADGE[u.perfil]}>{u.perfil}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleAtivo(u)}
                        className={`badge cursor-pointer ${u.ativo ? "badge-green" : "badge-red"}`}
                      >
                        {u.ativo ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(u)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                          style={{ background: "#f3f4f6", color: "#374151" }}
                          title="Editar">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(u.id, u.email)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                          style={{ background: "#fee2e2", color: "#dc2626" }}
                          title="Excluir">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab: Alterar Senha
// ═══════════════════════════════════════════════════════════════════════════
function TabSenha({ showToast }: { showToast: (m: string, ok: boolean) => void }) {
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showAtual, setShowAtual] = useState(false);
  const [showNova, setShowNova] = useState(false);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    if (!atual) return setErro("Informe a senha atual.");
    if (!nova || nova.length < 6) return setErro("Nova senha: mínimo 6 caracteres.");
    if (nova !== confirmar) return setErro("Confirmação de senha não confere.");

    setSaving(true);
    try {
      const res = await fetch("/api/usuarios/senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAtual: atual, novaSenha: nova, confirmarSenha: confirmar }),
      });
      const d = await res.json();
      if (!res.ok) { setErro(d.error || "Erro ao alterar senha."); return; }
      showToast("Senha alterada com sucesso!", true);
      setAtual(""); setNova(""); setConfirmar("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md">
      <div className="card p-6">
        <h3 className="font-semibold text-sm mb-5" style={{ color: "#111827" }}>Alterar Senha</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#374151" }}>Senha Atual *</label>
            <div className="relative">
              <input className="input-base pr-10" type={showAtual ? "text" : "password"}
                value={atual} onChange={(e) => setAtual(e.target.value)} placeholder="••••••••" />
              <button type="button" onClick={() => setShowAtual((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>
                {showAtual ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#374151" }}>Nova Senha *</label>
            <div className="relative">
              <input className="input-base pr-10" type={showNova ? "text" : "password"}
                value={nova} onChange={(e) => setNova(e.target.value)} placeholder="Mín. 6 caracteres" />
              <button type="button" onClick={() => setShowNova((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>
                {showNova ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {nova && (
              <div className="mt-1 h-1 rounded-full" style={{ background: "#f3f4f6" }}>
                <div className="h-1 rounded-full transition-all"
                  style={{
                    width: nova.length < 6 ? "30%" : nova.length < 10 ? "65%" : "100%",
                    background: nova.length < 6 ? "#ef4444" : nova.length < 10 ? "#f97316" : "#22c55e",
                  }} />
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "#374151" }}>Confirmar Nova Senha *</label>
            <input className="input-base" type="password"
              value={confirmar} onChange={(e) => setConfirmar(e.target.value)} placeholder="Repita a nova senha" />
            {confirmar && nova !== confirmar && (
              <p className="text-xs mt-1" style={{ color: "#ef4444" }}>Senhas não conferem</p>
            )}
          </div>
          {erro && (
            <div className="rounded-lg px-3 py-2 text-xs flex items-center gap-1.5"
              style={{ background: "#fee2e2", color: "#dc2626" }}>
              <AlertTriangle size={13} /> {erro}
            </div>
          )}
          <button type="submit" className="btn-primary justify-center" disabled={saving}>
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Key size={14} />}
            {saving ? "Salvando..." : "Alterar Senha"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab: Acessos
// ═══════════════════════════════════════════════════════════════════════════
function TabAcessos({ showToast }: { showToast: (m: string, ok: boolean) => void }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/usuarios")
      .then((r) => r.json())
      .then((d) => { setUsuarios(d.usuarios || []); setLoading(false); });
  }, []);

  const getAcessos = (u: Usuario): string[] => {
    try { return JSON.parse(u.acessos); } catch { return []; }
  };

  const toggleAcesso = async (usuario: Usuario, tela: string) => {
    const atual = getAcessos(usuario);
    const novos = atual.includes(tela)
      ? atual.filter((t) => t !== tela)
      : [...atual, tela];

    // Admins sempre têm acesso total
    if (usuario.perfil === "ADMIN") {
      showToast("Administradores têm acesso total automático.", false);
      return;
    }

    setSaving(usuario.id);
    const res = await fetch("/api/usuarios", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: usuario.id, acessos: JSON.stringify(novos) }),
    });
    setSaving(null);
    if (res.ok) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuario.id ? { ...u, acessos: JSON.stringify(novos) } : u))
      );
      showToast("Acesso atualizado!", true);
    } else {
      showToast("Erro ao atualizar acesso.", false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card p-4" style={{ background: "#fff8f2", border: "1px solid #fed7aa" }}>
        <p className="text-xs" style={{ color: "#92400e" }}>
          <strong>Regra:</strong> Administradores têm acesso total a todas as telas. Use esta tela para controlar o acesso de Operadores e Visualizadores.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#6b7280" }}>
                  Usuário
                </th>
                {TELAS.map((t) => (
                  <th key={t} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide" style={{ color: "#6b7280" }}>
                    {TELA_LABELS[t]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={TELAS.length + 1} className="px-4 py-8 text-center text-sm" style={{ color: "#9ca3af" }}>
                    Carregando...
                  </td>
                </tr>
              ) : (
                usuarios.map((u, i) => {
                  const acessos = getAcessos(u);
                  const isAdmin = u.perfil === "ADMIN";
                  return (
                    <tr key={u.id} style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : undefined }}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm" style={{ color: "#111827" }}>{u.nome}</p>
                        <p className="text-xs" style={{ color: "#9ca3af" }}>{u.email}</p>
                      </td>
                      {TELAS.map((tela) => {
                        const checked = isAdmin || acessos.includes(tela);
                        return (
                          <td key={tela} className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={isAdmin || saving === u.id}
                              onChange={() => toggleAcesso(u, tela)}
                              className="w-4 h-4 cursor-pointer"
                              style={{ accentColor: "#f97316" }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tab: Snapshot
// ═══════════════════════════════════════════════════════════════════════════
function TabSnapshot({ showToast }: { showToast: (m: string, ok: boolean) => void }) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const loadSnapshots = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/snapshot");
      const d = await r.json();
      setSnapshots(d.snapshots || []);
    } catch (e) {
      console.error("Erro ao carregar snapshots:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSnapshots(); }, []);

  const handleSnapshot = async () => {
    // Sem confirm() — usa confirmação inline
    setRunning(true);
    setConfirming(false);
    try {
      const res = await fetch("/api/snapshot", { method: "POST" });
      const d = await res.json();
      if (res.ok) {
        showToast(`Dados atualizados em ${((d.duracaoMs || 0) / 1000).toFixed(1)}s!`, true);
      } else {
        showToast(`Erro: ${d.error || "Verifique a conexão com o banco."}`, false);
      }
      loadSnapshots();
    } catch (err: any) {
      showToast(`Erro de rede: ${err.message}`, false);
    } finally {
      setRunning(false);
    }
  };

  const fmt = (dt: string) =>
    new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).format(new Date(dt));

  return (
    <div className="space-y-4">
      {/* Botão principal */}
      <div className="card p-6 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "linear-gradient(135deg, #fff3e0, #fef3ec)" }}
        >
          <RefreshCw size={28} style={{ color: "#f97316" }} />
        </div>
        <h3 className="font-bold text-lg mb-1" style={{ color: "#111827" }}>Atualizar Dados</h3>
        <p className="text-sm mb-5" style={{ color: "#6b7280" }}>
          Sincroniza todos os KPIs do MySQL Novacorp para o banco local.<br />
          Execute uma vez por dia, preferencialmente pela manhã.
        </p>

        {/* Confirmação inline — sem confirm() */}
        {!confirming && !running && (
          <button
            id="btn-atualizar-dados"
            className="btn-primary mx-auto"
            onClick={() => setConfirming(true)}
            style={{ padding: "0.6rem 2rem", fontSize: "0.9rem" }}
          >
            <RefreshCw size={16} /> Atualizar Dados
          </button>
        )}

        {confirming && !running && (
          <div className="flex flex-col items-center gap-3 animate-fadeIn">
            <p className="text-sm font-medium" style={{ color: "#374151" }}>
              Confirma a atualização dos dados?
            </p>
            <div className="flex gap-2">
              <button
                className="btn-secondary"
                onClick={() => setConfirming(false)}
                style={{ padding: "0.5rem 1.25rem" }}
              >
                Cancelar
              </button>
              <button
                id="btn-confirmar-atualizar"
                className="btn-primary"
                onClick={handleSnapshot}
                style={{ padding: "0.5rem 1.25rem" }}
              >
                <CheckCircle2 size={15} /> Confirmar
              </button>
            </div>
          </div>
        )}

        {running && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <RefreshCw size={18} className="animate-spin" style={{ color: "#f97316" }} />
              <span className="text-sm font-medium" style={{ color: "#f97316" }}>Atualizando...</span>
            </div>
            <p className="text-xs animate-pulse-soft" style={{ color: "#9ca3af" }}>
              Consultando MySQL e gravando no banco local...
            </p>
          </div>
        )}
      </div>

      {/* Histórico */}
      <div>
        <h3 className="font-semibold text-sm mb-3" style={{ color: "#374151" }}>
          Histórico de Snapshots
        </h3>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  {["Data/Hora", "Tipo", "Status", "Duração", "Detalhes"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#6b7280" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: "#9ca3af" }}>
                      Carregando...
                    </td>
                  </tr>
                ) : snapshots.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: "#9ca3af" }}>
                      Nenhum snapshot realizado ainda
                    </td>
                  </tr>
                ) : (
                  snapshots.map((s, i) => (
                    <tr key={s.id} style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : undefined }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "#374151" }}>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} style={{ color: "#9ca3af" }} />
                          {fmt(s.criadoEm)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge badge-gray">{s.tipoSnap}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${s.status === "OK" ? "badge-green" : s.status === "PROCESSANDO" ? "badge-orange" : "badge-red"}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#6b7280" }}>
                        {s.duracaoMs ? `${(s.duracaoMs / 1000).toFixed(1)}s` : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: "#9ca3af" }} title={s.mensagem || ""}>
                        {s.mensagem || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
