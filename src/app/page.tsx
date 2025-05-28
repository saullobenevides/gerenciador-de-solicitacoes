// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Importa useRouter do next/navigation para App Router
import Link from "next/link"; // Se você tiver links para cadastro/recuperação de senha

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para verificar o status da sessão e redirecionar
  useEffect(() => {
    if (status === "authenticated") {
      // Se o usuário está logado, redireciona para a página interna
      router.push("/app"); // Altere para a URL desejada (ex: /app, /gerenciador)
    }
  }, [status, router]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Importante para lidar com o redirecionamento manualmente
    });

    if (result?.error) {
      setError("Usuário ou senha incorretos.");
    } else {
      // Se o login for bem-sucedido, o useEffect acima cuidará do redirecionamento
      // Você pode adicionar um pequeno atraso ou mensagem de sucesso aqui se quiser
    }
    setIsLoading(false);
  };

  // Se a sessão está carregando, ou se o usuário já está autenticado (e será redirecionado)
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Carregando...</p> {/* Ou um spinner de carregamento */}
      </div>
    );
  }

  // Se o usuário NÃO está logado, renderiza o formulário de login
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h1 className="text-black text-2xl font-bold text-center">Entrar</h1>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/app" })} // Redireciona para /dashboard
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            Entrar com Google
          </button>
          <button
            onClick={() => signIn("facebook", { callbackUrl: "/app" })} // Redireciona para /dashboard
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Entrar com Facebook
          </button>
        </div>

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-black text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-black text-sm font-medium">Senha</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="flex justify-between text-sm text-gray-600">
          <Link href="/register" className="hover:underline">
            Não tem conta? Cadastre-se
          </Link>
          <Link href="/forgot-password" className="hover:underline">
            Esqueci minha senha
          </Link>
        </div>
      </div>
    </div>
  );
}