import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/getCurrentUser';
import {
  getActiveFleetService,
  createCarService,
  getAdminFleetService,
} from '@/services/carService';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const adminMode = searchParams.get('adminMode') === 'true';

    if (adminMode) {
      const session = await getSession();
      if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super-admin')) {
        return NextResponse.json(
          { success: false, message: 'Forbidden. Admin access required.' },
          { status: 403 }
        );
      }
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '30', 10);
      const search = searchParams.get('search') || '';
      const status = searchParams.get('status') || '';

      const result = await getAdminFleetService({ page, limit, search, status, category }, session);
      return NextResponse.json({ success: true, ...result });
    }

    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    const cars = await getActiveFleetService(filter);
    return NextResponse.json({ success: true, cars });
  } catch (error) {
    console.error('[/api/cars GET Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super-admin')) {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    await connectToDatabase();

    const car = await createCarService(body, session);
    return NextResponse.json(
      { success: true, message: 'Vehicle added to fleet successfully.', car },
      { status: 201 }
    );
  } catch (error) {
    console.error('[/api/cars POST Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}
