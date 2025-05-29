// app/requests/new/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Definir tipos para os departamentos (simplificado)
interface Department {
  id: string;
  name: string;
}

export default function CreateRequestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(''); // ID do departamento
  const [selectedPriority, setSelectedPriority] = useState('MEDIA'); // Default para MEDIA
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redireciona se não estiver autenticado ou não for FUNCIONARIO
  useEffect(() => {
    if (status === 'loading') return; // Espera a sessão carregar
    if (!session || (session.user?.role !== 'FUNCIONARIO' && session.user?.role !== 'ATENDENTE' && session.user?.role !== 'ADMIN')) {
      router.push('/auth/signin'); // Redireciona para login se não autenticado ou sem permissão
    }
  }, [session, status, router]);

  // Carregar departamentos da empresa do usuário
  useEffect(() => {
    async function fetchDepartments() {
      if (status === 'authenticated' && session.user?.companyId) {
        try {
          const response = await fetch(`/api/departments?companyId=${session.user.companyId}`);
          if (!response.ok) {
            throw new Error('Falha ao carregar departamentos');
          }
          const data = await response.json();
          setDepartments(data);
          if (data.length > 0) {
            setSelectedDepartment(data[0].id); // Seleciona o primeiro por padrão
          }
        } catch (err) {
          console.error('Erro ao carregar departamentos:', err);
          setError('Não foi possível carregar os departamentos.');
        }
      }
    }
    fetchDepartments();
  }, [session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!session || !session.user?.id || !session.user?.companyId) {
      setError('Sessão inválida. Por favor, faça login novamente.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          departmentId: selectedDepartment,
          priority: selectedPriority,
          companyId: session.user.companyId, // Passa o companyId da sessão
          requesterId: session.user.id, // Passa o ID do usuário logado
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar solicitação.');
      }

      setSuccess('Solicitação criada com sucesso!');
      setTitle('');
      setDescription('');
      // Mantém o departamento selecionado se houver, ou limpa
      // setSelectedDepartment(departments.length > 0 ? departments[0].id : '');
      setSelectedPriority('MEDIA');

      router.push('/dashboard'); // Redireciona para o dashboard de solicitações após o sucesso

    } catch (err: any) {
      console.error('Erro na submissão:', err);
      setError(err.message || 'Ocorreu um erro inesperado ao criar a solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Carregando...</p>
      </div>
    );
  }

  // Se não tem permissão e status não é 'loading', redireciona
  if (!session || (session.user?.role !== 'FUNCIONARIO' && session.user?.role !== 'ATENDENTE' && session.user?.role !== 'ADMIN')) {
    return null; // ou um componente de "acesso negado"
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Criar Nova Solicitação</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título da Solicitação</label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição Detalhada</label>
            <textarea
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={1000}
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Departamento Responsável</label>
            <select
              id="department"
              required
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {departments.length === 0 ? (
                <option value="">Carregando departamentos...</option>
              ) : (
                departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Prioridade</label>
            <select
              id="priority"
              required
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {Object.values(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Erro:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Sucesso:</strong>
              <span className="block sm:inline ml-2">{success}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-sm disabled:opacity-50 transition duration-150 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? "Enviando Solicitação..." : "Enviar Solicitação"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            Voltar para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}