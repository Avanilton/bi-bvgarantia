import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
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

        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.ativo) return null;

        const senhaOk = await bcrypt.compare(
          credentials.password as string,
          user.senhaHash
        );
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
