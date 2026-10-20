import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/getCurrentUser';
import {
  submitReviewService,
  getPublicTestimonialsService,
  getAdminReviewsDeskService,
  toggleReviewPublicService,
} from '@/services/reviewService';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
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
      const limit = parseInt(searchParams.get('limit') || '20', 10);
      const search = searchParams.get('search') || '';
      const rating = searchParams.get('rating') ? parseInt(searchParams.get('rating'), 10) : undefined;
      const isPublic = searchParams.get('isPublic') !== null && searchParams.get('isPublic') !== ''
        ? searchParams.get('isPublic') === 'true'
        : undefined;

      const result = await getAdminReviewsDeskService(
        { page, limit, search, rating, isPublic },
        session
      );
      return NextResponse.json({ success: true, ...result });
    }

    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const reviews = await getPublicTestimonialsService(limit);
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('[/api/reviews GET Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Please sign in to submit a review.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    await connectToDatabase();

    const result = await submitReviewService(body, session);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your feedback! 5 reward points have been added to your wallet.',
        review: result.review,
        rewardPointsAwarded: result.rewardPointsAwarded,
        newBalance: result.newBalance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[/api/reviews POST Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession();
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super-admin')) {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, isPublic } = body;
    if (!id || typeof isPublic !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Review ID and isPublic boolean are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const review = await toggleReviewPublicService(id, isPublic, session);

    return NextResponse.json({
      success: true,
      message: `Review visibility set to ${isPublic ? 'Public' : 'Hidden'}`,
      review,
    });
  } catch (error) {
    console.error('[/api/reviews PATCH Error]', error);
    const formatted = formatErrorResponse(error);
    return NextResponse.json(formatted.body, { status: formatted.status });
  }
}
