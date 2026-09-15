/**
 * Seed: Cria o usuário admin inicial
 * Execute com: node prisma/seed.mjs
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@bvgarantia.com.br";
  const senhaHash = await bcrypt.hash("123456", 10);
  const todosAcessos = JSON.stringify(["dashboard", "configuracoes"]);

  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) {
    console.log("✅ Usuário admin já existe, pulando...");
    return;
  }

  await prisma.usuario.create({
    data: {
      email,
      nome: "Administrador",
      senhaHash,
      perfil: "ADMIN",
      ativo: true,
      acessos: todosAcessos,
    },
  });
  console.log("✅ Usuário admin criado: admin@bvgarantia.com.br / 123456");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
