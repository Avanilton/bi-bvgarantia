import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";

// POST /api/usuarios/senha — altera senha do usuário logado
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { senhaAtual, novaSenha, confirmarSenha } = await req.json();

  if (!senhaAtual || !novaSenha || !confirmarSenha)
    return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
  if (novaSenha !== confirmarSenha)
    return NextResponse.json({ error: "Nova senha e confirmação não coincidem." }, { status: 400 });
  if (novaSenha.length < 6)
    return NextResponse.json({ error: "Nova senha deve ter pelo menos 6 caracteres." }, { status: 400 });

  const usuario = await prisma.usuario.findUnique({
    where: { id: Number(session.user.id) },
  });
  if (!usuario) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

  const senhaOk = await bcrypt.compare(senhaAtual, usuario.senhaHash);
  if (!senhaOk)
    return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { senhaHash: await bcrypt.hash(novaSenha, 10) },
  });

  return NextResponse.json({ ok: true });
}
