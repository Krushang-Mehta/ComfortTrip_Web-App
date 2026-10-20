import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/getCurrentUser';
import { setUserActiveService, updateUserProfileService } from '@/services/userService';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    await connectToDatabase();

    // Toggle active status (admin only)
    if (typeof body.isActive === 'boolean') {
      const user = await setUserActiveService(id, body.isActive, session);
      return NextResponse.json({ success: true, user });
    }

    // Profile update
    const updated = await updateUserProfileService(id, body, session);
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('[/api/users/[id] PATCH Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}
