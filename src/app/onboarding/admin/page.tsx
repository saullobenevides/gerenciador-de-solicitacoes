// app/onboarding/admin/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // Para logar o admin automaticamente após o cadastro

export default function AdminOnboardingPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/register/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, adminName, adminEmail, adminPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erro ao cadastrar empresa e administrador.');
        return;
      }

      // Se o cadastro for bem-sucedido, loga o admin automaticamente
      const result = await signIn('credentials', {
        email: adminEmail,
        password: adminPassword,
        redirect: false,
      });

      if (result?.error) {
        setError('Administrador cadastrado, mas o login falhou. Tente novamente pela tela de login.');
        router.push('/auth/signin');
      } else {
        // Redireciona para o painel de administração após login bem-sucedido
        router.push('/admin/dashboard');
      }

    } catch (err) {
      console.error('Erro na requisição:', err);
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-center">Cadastrar Empresa e Administrador</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos da Empresa */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium">Nome da Empresa</label>
            <input
              id="companyName"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
          </div>

          {/* Campos do Administrador */}
          <div>
            <label htmlFor="adminName" className="block text-sm font-medium">Seu Nome (Administrador)</label>
            <input
              id="adminName"
              type="text"
              required
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label htmlFor="adminEmail" className="block text-sm font-medium">Seu E-mail (Administrador)</label>
            <input
              id="adminEmail"
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label htmlFor="adminPassword" className="block text-sm font-medium">Criar Senha (Administrador)</label>
            <input
              id="adminPassword"
              type="password"
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
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
            {isLoading ? "Cadastrando..." : "Cadastrar e Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}