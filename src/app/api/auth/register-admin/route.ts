// src/app/api/auth/register-admin/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ajuste o caminho se necessário, assume que @/lib/prisma está configurado
import bcrypt from 'bcryptjs';
// import { Role } from '@prisma/client'; // Prisma Client enums can be used if generated and imported

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, companyId } = body;

    if (!email || !password || !name || !companyId) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios: email, password, name, companyId.' }, { status: 400 });
    }

    // Validação adicional do tipo dos campos (exemplo básico)
    if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string' || typeof companyId !== 'string') {
      return NextResponse.json({ message: 'Tipos de dados inválidos para um ou mais campos.' }, { status: 400 });
    }

    // Verificar se a empresa (companyId) existe
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      return NextResponse.json({ message: 'Empresa não encontrada.' }, { status: 404 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Usuário com este email já existe.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN', // Usando string literal, Role.ADMIN se o enum estivesse importado
        companyId,
        emailVerified: new Date(), // Considerar email verificado no cadastro do admin
      },
    });

    // Remover a senha do objeto de usuário retornado
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error: any) {
    console.error('Erro no cadastro do admin:', error);
    // Tratar erros específicos do Prisma (ex: P2002 para unique constraint) se necessário
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return NextResponse.json({ message: 'Usuário com este email já existe (conflito de banco de dados).' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Erro interno do servidor.', error: error.message || 'Unknown error' }, { status: 500 });
  }
}
