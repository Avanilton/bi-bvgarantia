import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/usuarios — lista todos
export async function GET() {
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      email: true,
      nome: true,
      perfil: true,
      ativo: true,
      acessos: true,
      criadoEm: true,
    },
    orderBy: { nome: "asc" },
  });
  return NextResponse.json({ usuarios });
}

// POST /api/usuarios — cria novo
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, nome, senha, perfil = "VISUALIZADOR", acessos = "[]" } = body;

  // Validações
  if (!email || !nome || !senha)
    return NextResponse.json({ error: "Campos obrigatórios: email, nome, senha." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  if (senha.length < 6)
    return NextResponse.json({ error: "Senha deve ter pelo menos 6 caracteres." }, { status: 400 });

  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe)
    return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 409 });

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await prisma.usuario.create({
    data: { email, nome, senhaHash, perfil, acessos },
  });
  return NextResponse.json({ id: usuario.id, email: usuario.email }, { status: 201 });
}

// PUT /api/usuarios — edita
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, nome, perfil, ativo, acessos, novaSenha } = body;

  if (!id) return NextResponse.json({ error: "ID obrigatório." }, { status: 400 });

  const data: any = {};
  if (nome !== undefined) data.nome = nome;
  if (perfil !== undefined) data.perfil = perfil;
  if (ativo !== undefined) data.ativo = ativo;
  if (acessos !== undefined) data.acessos = acessos;
  if (novaSenha) {
    if (novaSenha.length < 6)
      return NextResponse.json({ error: "Nova senha deve ter pelo menos 6 caracteres." }, { status: 400 });
    data.senhaHash = await bcrypt.hash(novaSenha, 10);
  }

  const usuario = await prisma.usuario.update({ where: { id: Number(id) }, data });
  return NextResponse.json({ id: usuario.id });
}

// DELETE /api/usuarios?id=X
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "ID obrigatório." }, { status: 400 });

  await prisma.usuario.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
