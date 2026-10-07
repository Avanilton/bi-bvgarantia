import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user: any = session?.user;
  const isAdmin = user?.perfil === "ADMIN";
  const acessos = (() => {
    try {
      return JSON.parse(user?.acessos || "[]");
    } catch {
      return [];
    }
  })();

  return (
    <div className="flex min-h-screen" style={{ background: "#f9fafb" }}>
      {/* Sidebar (inclui filtros e logout) */}
      <Suspense fallback={null}>
        <Sidebar isAdmin={isAdmin} acessos={acessos} />
      </Suspense>

      {/* Conteúdo principal — empurrado pelo sidebar */}
      <main
        className="flex-1 md:ml-64 min-h-screen"
        style={{ padding: "1.5rem 1.75rem" }}
      >
        {children}
      </main>
    </div>
  );
}
