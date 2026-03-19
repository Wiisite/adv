import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await query(`
      SELECT p.*, c.full_name as client_name 
      FROM processes p 
      LEFT JOIN clients c ON p.client_id = c.id 
      ORDER BY p.created_at DESC
    `);
    
    return Response.json(result.rows);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client_id, process_number, title, category, status, description } = body;

    const result = await query(
      'INSERT INTO processes (client_id, process_number, title, category, status, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [client_id, process_number, title, category, status, description]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, client_id, process_number, title, category, status, description } = body;

    const result = await query(
      'UPDATE processes SET client_id = $1, process_number = $2, title = $3, category = $4, status = $5, description = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [client_id, process_number, title, category, status, description, id]
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

    await query('DELETE FROM processes WHERE id = $1', [id]);

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
