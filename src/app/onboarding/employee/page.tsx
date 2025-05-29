// app/onboarding/employee/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function EmployeeOnboardingPage() {
  const [adminEmail, setAdminEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/register/employee/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erro ao enviar convite.');
        return;
      }

      setMessage('Convite enviado com sucesso! Seu administrador será notificado.');
      setAdminEmail(''); // Limpa o campo
    } catch (err) {
      console.error('Erro ao enviar convite:', err);
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Acesso de Funcionário</h1>

      <p className="text-xl text-gray-700 mb-6 max-w-2xl">
        Bem-vindo! Para acessar esta plataforma, sua empresa precisa ter uma conta e um administrador deve te cadastrar.
      </p>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Se você já sabe quem é o administrador da sua empresa aqui, pode nos informar o e-mail dele(a) para que possamos enviar um lembrete para te cadastrar.
      </p>

      <form onSubmit={handleSendInvite} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">E-mail do Administrador da sua Empresa</label>
          <input
            id="adminEmail"
            type="email"
            required
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            placeholder="admin@suaempresa.com"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="text-green-600 text-sm">
            {message}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Enviando..." : "Enviar Convite ao Administrador"}
        </button>
      </form>

      <div className="mt-8 text-gray-600">
        <p>Já tem uma conta? <Link href="/auth/signin" className="text-blue-500 hover:underline">Faça login aqui.</Link></p>
      </div>
    </div>
  );
}