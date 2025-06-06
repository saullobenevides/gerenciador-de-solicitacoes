// src/app/api/requests/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Ajuste o caminho se for diferente
import { prisma } from '@/lib/prisma';
// import { RequestStatus } from '@prisma/client'; // Descomente se o enum estiver disponível e configurado
import { type NextRequest } from 'next/server'; // Para tipar req na função GET

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id || !session.user.companyId) {
      return NextResponse.json({ message: 'Não autorizado. Sessão inválida ou dados do usuário ausentes.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, departmentId } = body;

    if (!title || !description || !departmentId) {
      return NextResponse.json({ message: 'Título, descrição e ID do departamento são obrigatórios.' }, { status: 400 });
    }

    if (typeof title !== 'string' || typeof description !== 'string' || typeof departmentId !== 'string') {
        return NextResponse.json({ message: 'Tipos de dados inválidos para um ou mais campos.' }, { status: 400 });
    }

    const userId = session.user.id;
    const companyId = session.user.companyId;

    // Validar se o departamento existe e pertence à empresa do usuário
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return NextResponse.json({ message: 'Departamento não encontrado.' }, { status: 404 });
    }

    if (department.companyId !== companyId) {
      return NextResponse.json({ message: 'Este departamento não pertence à sua empresa.' }, { status: 403 }); // 403 Forbidden é mais apropriado
    }

    const newRequest = await prisma.request.create({
      data: {
        title,
        description,
        status: 'OPEN', // Ou RequestStatus.OPEN se o enum estiver importado
        createdById: userId,
        departmentId,
        companyId, // companyId da sessão do usuário
      },
      include: { // Opcional: incluir dados relacionados no retorno, se útil para o frontend
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        department: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json(newRequest, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao criar solicitação:', error);

    if (error.name === 'JsonWebTokenError') { // Especificamente para erros de token JWT
        return NextResponse.json({ message: 'Token inválido ou expirado.' }, { status: 401 });
    }
    // Adicionar mais tratamentos de erro específicos do Prisma se necessário
    // Ex: PrismaClientKnownRequestError, etc.

    return NextResponse.json({ message: 'Erro interno do servidor ao criar solicitação.', errorDetails: error.message }, { status: 500 });
  }
}

// GET function for listing requests will be added here in a future subtask.
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id || !session.user.companyId || !session.user.role) {
      return NextResponse.json({ message: 'Não autorizado ou dados da sessão incompletos.' }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role;
    const userCompanyId = session.user.companyId;
    const userDepartmentId = session.user.departmentId; // Pode ser null/undefined

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const departmentFilter = searchParams.get('departmentId'); // Usado pelo Admin
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    let whereClause: any = {
      companyId: userCompanyId,
    };

    // Filtragem baseada no papel do usuário
    if (userRole === 'EMPLOYEE') {
      whereClause.createdById = userId;
    } else if (userRole === 'ATTENDANT') {
      if (!userDepartmentId) {
        return NextResponse.json({ message: 'Atendente sem departamento associado.' }, { status: 400 });
      }
      whereClause.departmentId = userDepartmentId;
    } else if (userRole === 'ADMIN') {
      if (departmentFilter) {
        // Adicional: Validar se o departmentFilter pertence à userCompanyId
        const deptToFilter = await prisma.department.findFirst({
          where: {
            id: departmentFilter,
            companyId: userCompanyId,
          }
        });
        if (!deptToFilter) {
          return NextResponse.json({ message: 'Departamento de filtro inválido ou não pertence à sua empresa.' }, { status: 400 });
        }
        whereClause.departmentId = departmentFilter;
      }
      // Admin sem departmentFilter vê todos os da empresa
    } else {
      return NextResponse.json({ message: 'Papel de usuário desconhecido.' }, { status: 403 });
    }

    // Aplicar filtro de status se fornecido
    if (status) {
      // Idealmente, validar se 'status' é um valor válido do enum RequestStatus
      // Ex: const validStatuses = Object.values(RequestStatus); if (!validStatuses.includes(status as RequestStatus)) { ... }
      whereClause.status = status;
    }

    const validSortByFields = ['createdAt', 'updatedAt', 'title', 'status']; // Adicionar mais campos se necessário
    const orderByField = validSortByFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderByDirection = sortOrder === 'asc' ? 'asc' : 'desc';

    const requests = await prisma.request.findMany({
      where: whereClause,
      include: {
        department: {
          select: { name: true },
        },
        createdBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: {
        [orderByField]: orderByDirection,
      },
      // Considerar adicionar take e skip para paginação no futuro
      // take: parseInt(searchParams.get('pageSize') || '10'),
      // skip: parseInt(searchParams.get('page') || '0') * parseInt(searchParams.get('pageSize') || '10'),
    });

    // Para paginação, também seria útil retornar o total de registros
    // const totalRequests = await prisma.request.count({ where: whereClause });
    // return NextResponse.json({ data: requests, total: totalRequests }, { status: 200 });

    return NextResponse.json(requests, { status: 200 });

  } catch (error: any) {
    console.error('Erro ao buscar solicitações:', error);
    return NextResponse.json({ message: 'Erro interno do servidor ao buscar solicitações.', errorDetails: error.message }, { status: 500 });
  }
}
