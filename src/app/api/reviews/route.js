import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getSession } from '@/lib/auth/getCurrentUser';
import { submitReviewService, getPublicTestimonialsService } from '@/services/reviewService';
import { formatErrorResponse } from '@/lib/utils/formatApiError';

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
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
