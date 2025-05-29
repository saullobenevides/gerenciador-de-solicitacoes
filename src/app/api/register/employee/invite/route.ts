// app/api/register/employee/invite/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// Importe sua biblioteca de envio de e-mail (ex: nodemailer, sendgrid)
// import nodemailer from 'nodemailer'; // Exemplo

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { adminEmail } = await request.json();

    if (!adminEmail) {
      return new NextResponse(JSON.stringify({ message: 'E-mail do administrador é obrigatório.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // 1. Opcional: Verificar se o adminEmail pertence a um admin existente
    // ou se ele corresponde a um usuário que *deveria* ser admin de uma empresa existente.
    const targetAdmin = await prisma.user.findUnique({
      where: { email: adminEmail, role: 'ADMIN' }, // Busca apenas admins
    });

    if (!targetAdmin) {
      // Se o e-mail não corresponde a um admin existente, ainda podemos enviar o convite,
      // mas a mensagem pode ser "Não encontramos um admin com este e-mail", ou aceitar
      // e o admin receberá um e-mail que não faz sentido para ele.
      // Depende do seu fluxo desejado. Para este exemplo, vamos permitir.
      console.warn(`Convite para e-mail admin não encontrado no DB: ${adminEmail}`);
    }

    // 2. Lógica para ENVIAR O E-MAIL
    // Isso usaria uma biblioteca de e-mail como Nodemailer, SendGrid, Mailgun, etc.
    // Exemplo com Nodemailer (requer configuração de transportador):
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail', // ou smtp.seudominio.com
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: 'Seu Funcionário Deseja Acesso à Plataforma!',
      html: `<p>Olá Administrador,</p>
             <p>Um de seus funcionários (e-mail: ${adminEmail} - você pode adicionar o e-mail do funcionário aqui se coletar) deseja acessar a plataforma.</p>
             <p>Por favor, acesse seu painel de administração e cadastre-o.</p>
             <p><a href="${process.env.NEXTAUTH_URL}/admin/users">Ir para o Painel de Usuários</a></p>`
    });
    */

    console.log(`Convite enviado (simulado) para ${adminEmail}`);
    return NextResponse.json({ message: 'Convite enviado com sucesso.' }, { status: 200 });

  } catch (error) {
    console.error('Error sending invite:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}