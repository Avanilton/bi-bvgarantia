import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "#f9fafb" }}>
      {/* Sidebar (inclui filtros e logout) */}
      <Suspense fallback={null}>
        <Sidebar />
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
