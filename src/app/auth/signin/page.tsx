// app/auth/signin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link'; // Se quiser um link de "voltar para home" ou "esqueci senha"

export default function SignInPage() { // Renomeado para SignInPage
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redireciona para o dashboard geral se autenticado
    // Se precisar de redirecionamento específico por role, faça aqui
    if (status === "authenticated") {
      if (session.user?.role === 'ADMIN') {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard"); // Para FUNCIONARIO/ATENDENTE
      }
    }
  }, [status, router, session]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou senha inválidos.");
    }
    setIsLoading(false);
  };

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(true);
    setError(null);
    // Redireciona para o dashboard geral, o useEffect cuidará do redirecionamento específico por role
    await signIn(provider, { callbackUrl: "/dashboard" });
    // isLoading será resetado na próxima renderização/redirecionamento
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Entrar na Plataforma</h1>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleOAuthLogin("google")}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
            disabled={isLoading}
          >
            Entrar com Google
          </button>
          <button
            onClick={() => handleOAuthLogin("facebook")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            disabled={isLoading}
          >
            Entrar com Facebook
          </button>
        </div>

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
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
            <label htmlFor="password" className="block text-sm font-medium">Senha</label>
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

        <div className="mt-4 text-center">
            <Link href="/auth/forgot-password" className="text-sm text-blue-500 hover:underline">
              Esqueci minha senha
            </Link>
        </div>
        <div className="mt-2 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}