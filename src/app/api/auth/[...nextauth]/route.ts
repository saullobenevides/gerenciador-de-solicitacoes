import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { SessionStrategy } from "next-auth";

import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  NEXTAUTH_SECRET
} from "../../../../utils/env";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      // Acesse diretamente de process.env
      clientId: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email e senha são obrigatórios.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // Se o usuário não for encontrado, ou se não tiver uma senha cadastrada (ex: usuário OAuth)
        if (!user || !user.password) {
          throw new Error("Usuário não encontrado ou login por credenciais não habilitado para esta conta.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Senha incorreta.");
        }

        // Retornar o objeto do usuário SEM a senha
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    })
  ],
  session: {
    strategy: "jwt" as SessionStrategy, // Usando JWT para sessões
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Cast user to any to access custom properties not in DefaultUser
        token.role = (user as any).role;
        token.companyId = (user as any).companyId;
        token.departmentId = (user as any).departmentId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) { // Ensure session.user exists
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.companyId = token.companyId as string;
        session.user.departmentId = token.departmentId as string | null;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin", // Updated sign-in page URL
    error: "/error" // Error page can remain or be customized
  },
  secret: NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };