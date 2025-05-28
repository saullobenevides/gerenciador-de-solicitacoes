// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route"; // Importe sua configuração de auth

export default async function DashboardPage() {
  const session = await getServerSession(authOptions); // Pega a sessão no lado do servidor

  // VITAL: Se não houver sessão, redireciona para a página de login
  if (!session) {
    redirect("/"); // Redireciona para a home (que agora é a página de login)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Bem-vindo ao Dashboard!</h1>
      <p className="text-lg text-gray-600 mb-4">
        Você está logado como: <span className="font-semibold">{session.user?.name || session.user?.email}</span>
      </p>
      <p className="text-md text-gray-700">Esta é a sua página interna protegida.</p>

      {/* Exemplo de botão de logout */}
      {/* Atenção: O action correto para logout é /api/auth/signout */}
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