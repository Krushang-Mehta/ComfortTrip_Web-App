import { NextResponse } from 'next/server';
import { getCurrentUser, getSession } from '@/lib/auth/getCurrentUser';

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated' },
        { status: 401 }
      );
    }

    const dbUser = await getCurrentUser();

    return NextResponse.json({
      success: true,
      user: dbUser || session.user,
    });
  } catch (error) {
    console.error('[/api/auth/me Error]', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
