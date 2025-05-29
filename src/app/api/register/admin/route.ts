// app/api/register/admin/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { companyName, adminName, adminEmail, adminPassword } = await request.json();

    // ⚠️ SEGURANÇA CRÍTICA: VERIFIQUE SE JÁ EXISTE ALGUM ADMIN OU EMPRESA NO DB
    // Se a aplicação já tiver um admin, esta rota NÃO DEVE PERMITIR NOVOS CADASTROS.
    // Isso evita que alguém mal-intencionado crie um admin após o setup inicial.
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    // Se já existe um admin, negue o acesso a esta rota de cadastro inicial
    if (existingAdmin) {
      return new NextResponse(JSON.stringify({ message: 'Setup inicial já concluído. Por favor, faça login.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // Validação básica
    if (!companyName || !adminName || !adminEmail || !adminPassword) {
      return new NextResponse(JSON.stringify({ message: 'Missing required fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Verificar se o e-mail do admin já está em uso (improvável aqui, mas bom ter)
    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingUser) {
      return new NextResponse(JSON.stringify({ message: 'Email already in use.' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    }

    // Hashear a senha do admin
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Crie a Empresa primeiro (se você tiver um modelo Company)
    // model Company {
    //   id          String    @id @default(cuid())
    //   name        String    @unique
    //   adminUserId String    @unique // Link para o ID do primeiro admin
    //   users       User[]    @relation("CompanyUsers") // Se usuários pertencerem a empresas
    // }
    //
    // const newCompany = await prisma.company.create({
    //   data: {
    //     name: companyName,
    //   },
    // });

    // Crie o usuário admin
    const newAdmin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        passwordHash: hashedPassword,
        role: 'ADMIN', // Atribui o papel de ADMIN
        emailVerified: new Date(),
        // companyId: newCompany.id, // Se o usuário pertencer a uma empresa
      },
    });

    // Atualize a empresa com o adminUserId se você tiver essa ligação
    // await prisma.company.update({
    //   where: { id: newCompany.id },
    //   data: { adminUserId: newAdmin.id },
    // });

    return NextResponse.json({ message: 'Company and Admin created successfully' }, { status: 201 });

  } catch (error) {
    console.error('Error in admin registration:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}