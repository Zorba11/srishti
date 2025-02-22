import { prisma } from '@/lib/prisma';
import { isAuthorized } from '@/utils/data/user/isAuthorized';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Add cache configuration
export const revalidate = 30; // Revalidate every 30 seconds

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId || !(await isAuthorized(clerkUserId))) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user from database based on Clerk user ID
    const dbUser = await prisma.user.findUnique({
      where: {
        userId: clerkUserId,
      },
    });

    if (!dbUser) {
      return new NextResponse('User not found', { status: 404 });
    }

    const movies = await prisma.movie.findMany({
      where: {
        userId: dbUser.id,
      },
      orderBy: {
        id: 'desc',
      },
    });

    console.log('[get-movies] movies: ', movies);

    // Cache the response
    return NextResponse.json(movies, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('[MOVIES_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
