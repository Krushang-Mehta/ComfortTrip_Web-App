import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/getCurrentUser';
import { getCarByIdService, updateCarService, deleteCarService } from '@/services/carService';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const car = await getCarByIdService(id);
    return NextResponse.json({ success: true, car });
  } catch (error) {
    console.error('[/api/cars/[id] GET Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}

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

    const updated = await updateCarService(id, body, session);
    return NextResponse.json({ success: true, car: updated });
  } catch (error) {
    console.error('[/api/cars/[id] PATCH Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super-admin')) {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    await connectToDatabase();

    const car = await deleteCarService(id, session);
    return NextResponse.json({
      success: true,
      message: `Vehicle ${car.brand} ${car.model} removed from fleet.`,
    });
  } catch (error) {
    console.error('[/api/cars/[id] DELETE Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}
