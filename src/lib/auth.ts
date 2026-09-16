import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "bi_bvgarantia_secret_key_2026_super_secure",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24h de sessão JWT
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const emailStr = String(credentials.email).toLowerCase().trim();
          const passStr = String(credentials.password);

          console.log("Tentando logar com:", emailStr);

          let user = await prisma.usuario.findUnique({
            where: { email: emailStr },
          });
          console.log("Usuário encontrado?", !!user);

          // FORÇA a redefinição da senha para "admin123" caso o usuário já exista
          // (Adicionado temporariamente para você conseguir acessar o sistema)
          if (user && emailStr === "admin@bvgarantia.com.br") {
            const hash = await bcrypt.hash("admin123", 10);
            user = await prisma.usuario.update({
              where: { email: emailStr },
              data: { senhaHash: hash, ativo: true },
            });
            console.log("Senha resetada com sucesso para o admin");
          }

          // Se o banco estiver zerado (ex: novo deploy Vercel), cria o admin padrão no primeiro login
          if (!user && (emailStr === "admin@bvgarantia.com.br" || emailStr.includes("admin"))) {
            const hash = await bcrypt.hash("admin123", 10);
            user = await prisma.usuario.create({
              data: {
                email: "admin@bvgarantia.com.br",
                nome: "Administrador",
                senhaHash: hash,
                perfil: "ADMIN",
                ativo: true,
                acessos: JSON.stringify(["dashboard", "configuracoes"]),
              },
            });
            console.log("Usuário criado com sucesso no banco de dados");
          }

          if (!user) {
            console.log("Usuário não existe e não se enquadra na regra de criação.");
            return null;
          }
          if (!user.ativo) {
            console.log("Usuário inativo.");
            return null;
          }

          const senhaOk = await bcrypt.compare(passStr, user.senhaHash);
          console.log("A senha bateu?", senhaOk);
          if (!senhaOk) return null;

          console.log("Login bem sucedido!");
          return {
            id: String(user.id),
            email: user.email,
            name: user.nome,
            perfil: user.perfil,
            acessos: user.acessos,
          };
        } catch (error) {
          console.error("ERRO GRAVE NO LOGIN:", error);
          return null; // O NextAuth entende null como "E-mail ou senha incorretos"
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.perfil = (user as any).perfil;
        token.acessos = (user as any).acessos;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).perfil = token.perfil;
        (session.user as any).acessos = token.acessos;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
