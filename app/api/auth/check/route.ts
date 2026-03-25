import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return Response.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const user = verifyToken(token.value);

    if (!user) {
      return Response.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    return Response.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Auth check error:', error);
    return Response.json(
      { error: 'Erro ao verificar autenticação' },
      { status: 401 }
    );
  }
}
