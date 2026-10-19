import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getActiveFleetService } from '@/services/carService';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

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
