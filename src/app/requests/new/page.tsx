// src/app/requests/new/page.tsx
"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link

interface Department {
  id: string;
  name: string;
}

export default function NewRequestPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Combined loading state
  const [isFetchingDepartments, setIsFetchingDepartments] = useState(true); // Specific for initial department fetch
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsFetchingDepartments(true);
      setError(null);
      try {
        const response = await fetch('/api/departments');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao buscar departamentos');
        }
        const data = await response.json();
        setDepartments(data);
        if (data.length === 0) {
            setError('Nenhum departamento disponível para seleção. Contate o administrador.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido ao buscar departamentos');
        setDepartments([]); // Garante que não haja departamentos selecionáveis em caso de erro
      } finally {
        setIsFetchingDepartments(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!departmentId) {
      setError("Por favor, selecione um departamento.");
      return;
    }
    if (!title.trim() || !description.trim()) {
        setError("Título e descrição são obrigatórios.");
        return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, departmentId }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Falha ao criar solicitação');
      }

      setSuccessMessage('Solicitação criada com sucesso! Redirecionando...');
      setTitle('');
      setDescription('');
      setDepartmentId('');

      setTimeout(() => {
        router.push('/dashboard'); // ou para uma página de visualização da solicitação
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao criar solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Criar Nova Solicitação</h2>

      {isFetchingDepartments && <p className="text-gray-600 text-center">Carregando departamentos...</p>}

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md text-sm mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 bg-green-100 p-3 rounded-md text-sm mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isLoading || isFetchingDepartments}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isLoading || isFetchingDepartments}
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">Departamento:</label>
          <select
            id="department"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={isLoading || isFetchingDepartments || departments.length === 0}
          >
            <option value="">
              {isFetchingDepartments ? 'Carregando...' : (departments.length === 0 ? 'Nenhum departamento disponível' : 'Selecione um departamento')}
            </option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || isFetchingDepartments || departments.length === 0}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Enviando...' : 'Criar Solicitação'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-500">
            Voltar para o Dashboard
        </Link>
      </div>
    </div>
  );
}