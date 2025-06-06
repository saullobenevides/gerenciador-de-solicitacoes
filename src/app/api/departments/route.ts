// src/app/api/departments/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Ajuste o caminho se necessário
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id || !session.user.companyId) {
      // Adicionando checagem de session.user.id por segurança, embora companyId seja o principal aqui.
      return NextResponse.json({ message: 'Não autorizado ou ID da empresa não encontrado na sessão.' }, { status: 401 });
    }

    const companyId = session.user.companyId;

    const departments = await prisma.department.findMany({
      where: {
        companyId: companyId,
      },
      orderBy: {
        name: 'asc', // Ordenar por nome para consistência
      },
      select: { // Selecionar apenas os campos necessários para o frontend
        id: true,
        name: true,
      }
    });

    if (departments.length === 0) {
        // Pode ser útil para o frontend saber se não há departamentos em vez de um array vazio genérico
        // Isso não é um erro do cliente nem do servidor, apenas um estado.
        return NextResponse.json([], { status: 200 }); // Ou { message: 'Nenhum departamento encontrado para esta empresa.', data: [] }
    }

    return NextResponse.json(departments, { status: 200 });

  } catch (error: any) {
    console.error('Erro ao buscar departamentos:', error);
    // Evitar vazar detalhes do erro para o cliente em produção
    return NextResponse.json({ message: 'Erro interno do servidor ao buscar departamentos.' }, { status: 500 });
  }
}
