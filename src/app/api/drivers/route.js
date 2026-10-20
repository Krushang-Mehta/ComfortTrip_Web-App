import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/getCurrentUser';
import {
  findAvailableDrivers,
  findAllDriversAdmin,
  createDriver,
} from '@/repositories/driverRepository';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const availableOnly = searchParams.get('availableOnly') === 'true';

    if (availableOnly) {
      const drivers = await findAvailableDrivers();
      return NextResponse.json({ success: true, drivers });
    }

    // Admin paginated search
    if (session.user.role !== 'admin' && session.user.role !== 'super-admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const result = await findAllDriversAdmin({ page, limit, search, status });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[/api/drivers GET Error]', error);
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
    if (!body.fullName || !body.phone || !body.licenseNumber) {
      return NextResponse.json(
        { success: false, message: 'Full name, phone, and license number are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const driver = await createDriver({
      fullName: body.fullName.trim(),
      phone: body.phone.trim(),
      licenseNumber: body.licenseNumber.trim().toUpperCase(),
      experienceYears: Number(body.experienceYears) || 3,
      rating: 5.0,
      totalRides: 0,
      status: body.status || 'Available',
    });

    return NextResponse.json(
      { success: true, message: 'Chauffeur registered successfully.', driver },
      { status: 201 }
    );
  } catch (error) {
    console.error('[/api/drivers POST Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}
