// src/app/auth/signin/page.tsx
"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link"; // Import Link for navigation

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Get callbackUrl from query parameters, default to /dashboard
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam) {
      switch (errorParam) {
        case "CredentialsSignin":
          setError("Email ou senha inválidos. Por favor, tente novamente.");
          break;
        case "OAuthSignin":
        case "OAuthCallback":
        case "OAuthCreateAccount":
        case "EmailCreateAccount":
        case "Callback":
        case "OAuthAccountNotLinked":
        // TODO: Add more specific messages for these OAuth errors if desired
          setError("Erro durante o login com provedor OAuth. Tente novamente ou use outro método.");
          break;
        case "Default":
        default:
          setError("Ocorreu um erro desconhecido durante o login.");
          break;
      }
    }
  }, [errorParam]);

  useEffect(() => {
    // If user is already authenticated, redirect them
    if (status === "authenticated") {
      router.replace(callbackUrl); // Use replace to avoid adding to history stack
    }
  }, [status, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn("credentials", {
      redirect: false, // We handle redirection manually based on the result
      email,
      password,
      // callbackUrl is not needed here if redirect: false, but signIn will use it if redirect becomes true
    });

    if (result?.error) {
      // Error messages are now handled by the useEffect for errorParam
      // but we can set a generic one here if needed, or specific based on result.error
      if (result.error === "CredentialsSignin") {
         setError("Email ou senha inválidos.");
      } else {
         setError(`Erro: ${result.error}`); // Display other errors directly
      }
    } else if (result?.ok) {
      // Successful sign-in
      router.replace(callbackUrl); // Use replace for better UX
    }
  };

  // Show loading state while session status is being determined
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  // If already authenticated, don't show login form (though useEffect should redirect)
  if (status === "authenticated") {
     return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Sua senha"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Entrar
          </button>
        </form>
        <hr className="my-6 border-gray-300" />
        <div className="space-y-4">
           <button
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center"
          >
            {/* Substitua por um ícone do Google se tiver um componente de ícone */}
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l0.002-0.002l6.19,5.238C39.709,34.391,44,29.891,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
            Entrar com Google
          </button>
          {/* <button
            onClick={() => signIn("facebook", { callbackUrl })}
            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center"
          >
            Entrar com Facebook
          </button> */}
        </div>
         <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
                Voltar para a página inicial
            </Link>
        </div>
      </div>
    </div>
  );
}