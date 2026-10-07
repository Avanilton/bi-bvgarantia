import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RhClientPage } from "./RhClientPage";

export default async function RHPage() {
  const session = await auth();
  const user: any = session?.user;
  const isAdmin = user?.perfil === "ADMIN";
  const acessos = JSON.parse(user?.acessos || "[]");

  if (!isAdmin && !acessos.includes("rh")) {
    redirect("/");
  }

  return <RhClientPage />;
}
