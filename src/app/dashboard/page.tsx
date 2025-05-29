// app/admin/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin"); // Redireciona para o login se não estiver logado
  }

  // Verifica se o usuário logado tem role de ADMIN
  if (session.user?.role !== 'ADMIN') {
    redirect("/dashboard"); // Redireciona para o dashboard comum se não for ADMIN
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Painel de Administrador</h1>
      <p className="text-lg text-gray-600 mb-4">
        Bem-vindo, <span className="font-semibold">{session.user?.name || session.user?.email}</span>! (Seu cargo: {session.user?.role})
      </p>
      <p className="text-md text-gray-700">Aqui você pode gerenciar empresas, departamentos e usuários.</p>

      <div className="mt-8 flex space-x-4">
        <Link href="/admin/users">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Gerenciar Usuários
          </button>
        </Link>
        {/* Outros links de administração */}
      </div>

      <form action="/api/auth/signout" method="POST" className="mt-8">
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Sair
        </button>
      </form>
    </div>
  );
}