import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM clients ORDER BY created_at DESC'
    );
    
    return Response.json(result.rows);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, phone, cpf, address } = body;

    const result = await query(
      'INSERT INTO clients (full_name, email, phone, cpf, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [full_name, email, phone, cpf, address]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, full_name, email, phone, cpf, address } = body;

    const result = await query(
      'UPDATE clients SET full_name = $1, email = $2, phone = $3, cpf = $4, address = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [full_name, email, phone, cpf, address, id]
    );

    return Response.json(result.rows[0]);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await query('DELETE FROM clients WHERE id = $1', [id]);

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
