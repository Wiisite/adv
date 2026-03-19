import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    );
  }
}
