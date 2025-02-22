import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { movieId: string } }
) {
  try {
    console.log('[MOVIE_SELECT_ACTOR] Request received');
    const { userId } = await auth();
    console.log('[MOVIE_SELECT_ACTOR] Authenticated user ID:', userId);
    if (!userId) {
      console.error('[MOVIE_SELECT_ACTOR] Unauthorized access attempt');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { movieId } = await params;

    const body = await req.json();
    console.log('[MOVIE_SELECT_ACTOR] Request body:', body);
    const { actorId } = body;

    if (!actorId) {
      console.error(
        '[MOVIE_SELECT_ACTOR] Actor ID is required but not provided'
      );
      return new NextResponse('Actor ID is required', { status: 400 });
    }

    // Get the user's ID from the database
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      console.error('[MOVIE_SELECT_ACTOR] User not found in the database');
      return new NextResponse('User not found', { status: 404 });
    }

    // Update the movie with the selected actor
    const updatedMovie = await prisma.movie.update({
      where: {
        id: parseInt(movieId),
        userId: user.id,
      },
      data: {
        actorId: actorId,
      },
    });

    console.log('[MOVIE_SELECT_ACTOR] Movie updated with actor ID:', actorId);
    return NextResponse.json(updatedMovie);
  } catch (error) {
    console.error('[MOVIE_SELECT_ACTOR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
