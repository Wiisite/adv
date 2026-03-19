import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await query(`
      SELECT d.*, p.title as process_title, p.process_number
      FROM documents d 
      LEFT JOIN processes p ON d.process_id = p.id 
      ORDER BY d.created_at DESC
    `);
    
    return Response.json(result.rows);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { process_id, title, file_type } = body;

    const result = await query(
      'INSERT INTO documents (process_id, title, file_type) VALUES ($1, $2, $3) RETURNING *',
      [process_id, title, file_type]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await query('DELETE FROM documents WHERE id = $1', [id]);

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
