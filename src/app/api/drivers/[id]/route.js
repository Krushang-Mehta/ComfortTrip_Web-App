import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/getCurrentUser';
import { updateDriver, updateDriverStatus } from '@/repositories/driverRepository';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super-admin')) {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    await connectToDatabase();

    let updated;
    if (body.status && Object.keys(body).length === 1) {
      updated = await updateDriverStatus(id, body.status);
    } else {
      updated = await updateDriver(id, body);
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Driver not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, driver: updated });
  } catch (error) {
    console.error('[/api/drivers/[id] PATCH Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}
