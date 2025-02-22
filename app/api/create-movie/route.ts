import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createMovieSchema } from '@/lib/validations/movie';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user in database
    const user = await prisma.user.upsert({
      where: { userId: clerkUserId },
      update: {},
      create: {
        userId: clerkUserId,
        email: 'placeholder@email.com', // You'll need to get this from Clerk
        firstName: 'placeholder', // You'll need to get this from Clerk
        lastName: 'placeholder', // You'll need to get this from Clerk
      },
    });

    const body = await req.json();
    const validatedData = createMovieSchema.parse(body);

    // Create a new movie record using the database user ID
    const newMovie = await prisma.movie.create({
      data: {
        userId: user.id, // Now using the integer ID from our database
        prompt: validatedData.moviePrompt,
        promptCharacterCount: validatedData.promptCharacterCount,
        promptCharacterCountLimit: validatedData.promptCharacterCountLimit,
        storyStructureStyle: validatedData.storyStructureStyle,
        animationStyle: validatedData.animationStyle,
        title: `Movie ${Date.now()}`,
        isAllAssetReady: false,
      },
    });

    console.log('[create-movie] new movie created: ', newMovie);

    return NextResponse.json(newMovie);
  } catch (error: any) {
    console.error('Error creating movie:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
