import { query } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await query(
      'SELECT id, email, password_hash, full_name, role FROM users WHERE email = $1',
      ['admin@sistema.com']
    );

    if (result.rows.length === 0) {
      return Response.json({
        status: 'error',
        message: 'Usuário admin@sistema.com NÃO ENCONTRADO no banco',
        suggestion: 'Execute o SQL para criar o usuário'
      });
    }

    const user = result.rows[0];
    const testPassword = 'admin123';
    const isValid = await verifyPassword(testPassword, user.password_hash);

    return Response.json({
      status: 'success',
      userFound: true,
      userEmail: user.email,
      userName: user.full_name,
      userRole: user.role,
      passwordHashInDb: user.password_hash.substring(0, 20) + '...',
      passwordTest: testPassword,
      passwordValid: isValid,
      message: isValid 
        ? '✅ Senha correta! Login deve funcionar.' 
        : '❌ Senha incorreta! Hash no banco está errado.'
    });
  } catch (error: any) {
    return Response.json({
      status: 'error',
      message: 'Erro ao testar login',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
