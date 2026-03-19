import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await query(`
      SELECT a.*, c.full_name as client_name
      FROM appointments a 
      LEFT JOIN clients c ON a.client_id = c.id 
      ORDER BY a.appointment_date DESC
    `);
    
    return Response.json(result.rows);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client_id, title, description, appointment_date, status } = body;

    const result = await query(
      'INSERT INTO appointments (client_id, title, description, appointment_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [client_id, title, description, appointment_date, status]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, client_id, title, description, appointment_date, status } = body;

    const result = await query(
      'UPDATE appointments SET client_id = $1, title = $2, description = $3, appointment_date = $4, status = $5 WHERE id = $6 RETURNING *',
      [client_id, title, description, appointment_date, status, id]
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

    await query('DELETE FROM appointments WHERE id = $1', [id]);

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
