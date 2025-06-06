// src/middleware.ts
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Se não houver token (não autenticado), withAuth já redireciona para a página de login.
    // Esta lógica adicional é para autorização baseada em papéis.

    if (token) {
      // Proteger rotas /admin para apenas ADMINs
      if (pathname.startsWith("/admin")) {
        if (token.role !== "ADMIN") {
          // Redirecionar para uma página de acesso negado ou dashboard padrão
          // Idealmente, você teria uma página /unauthorized ou /403
          return NextResponse.redirect(new URL("/dashboard?error=unauthorized", req.url));
        }
      }

      // Adicionar outras lógicas de autorização baseadas em papéis aqui se necessário
      // Ex: Se /requests/new só pode ser acessado por FUNCIONARIO ou ADMIN
      // if (pathname.startsWith("/requests/new")) {
      //   if (token.role !== "EMPLOYEE" && token.role !== "ADMIN") { // Assuming EMPLOYEE is a valid role
      //     return NextResponse.redirect(new URL("/dashboard?error=unauthorized", req.url));
      //   }
      // }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Usuário é autorizado se houver um token (autenticado)
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/requests/new/:path*",
    // Adicione outras rotas aqui
  ],
};
