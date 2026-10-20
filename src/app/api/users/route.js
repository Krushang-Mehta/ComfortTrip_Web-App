import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/getCurrentUser';
import { getAdminUsersService } from '@/services/userService';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super-admin')) {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    const result = await getAdminUsersService({ page, limit, search, role }, session);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[/api/users GET Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}
