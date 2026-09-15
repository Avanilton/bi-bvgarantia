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
        if (!credentials?.email || !credentials?.password) return null;

        const emailStr = String(credentials.email).toLowerCase().trim();
        const passStr = String(credentials.password);

        let user = await prisma.usuario.findUnique({
          where: { email: emailStr },
        });

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
        }

        if (!user || !user.ativo) return null;

        const senhaOk = await bcrypt.compare(passStr, user.senhaHash);
        if (!senhaOk) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.nome,
          perfil: user.perfil,
          acessos: user.acessos,
        };
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
