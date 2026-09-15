"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, BarChart3, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");

    // Validações front-end
    if (!email) return setErro("Informe o e-mail.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErro("E-mail inválido.");
    if (!senha) return setErro("Informe a senha.");
    if (senha.length < 6) return setErro("Senha deve ter pelo menos 6 caracteres.");

    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password: senha,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      setErro("E-mail ou senha incorretos.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #fff8f2 0%, #f0fdf6 50%, #fff8f2 100%)",
      }}
    >
      {/* Círculos decorativos */}
      <div
        className="fixed top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #f97316, transparent)" }}
      />
      <div
        className="fixed bottom-[-60px] left-[-60px] w-[240px] h-[240px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #22c55e, transparent)" }}
      />

      <div
        className="w-full max-w-md animate-fadeIn"
        style={{ padding: "0 1rem" }}
      >
        <div className="card p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{
                background: "linear-gradient(135deg, #f97316, #fb923c)",
                boxShadow: "0 4px 14px rgb(249 115 22 / 0.35)",
              }}
            >
              <BarChart3 size={28} color="white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>
              BI <span style={{ color: "#f97316" }}>BVGarantia</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              Acesse sua conta para continuar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
                style={{ color: "#374151" }}
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base"
                placeholder="seu@email.com.br"
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="senha"
                className="block text-sm font-medium mb-1"
                style={{ color: "#374151" }}
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={showSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="input-base pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
                  tabIndex={-1}
                >
                  {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {erro && (
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                style={{ background: "#fee2e2", color: "#dc2626" }}
              >
                <span>⚠</span> {erro}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full justify-center mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse-soft">Entrando...</span>
              ) : (
                <>
                  <LogIn size={16} /> Entrar
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: "#9ca3af" }}>
            BV Garantia © {new Date().getFullYear()} · Sistema interno
          </p>
        </div>
      </div>
    </div>
  );
}
