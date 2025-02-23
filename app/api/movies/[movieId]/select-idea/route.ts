import { GPT4_MODEL_ID } from '@/constants/AIModels';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { movieId: string } }
) {
  try {
    const { idea } = await request.json();
    const movieId = parseInt(params.movieId);

    // Update the movie with the selected idea
    const updatedMovie = await prisma.movie.update({
      where: { id: movieId },
      data: {
        ideaSelected: {
          create: {
            selectedIdea: idea,
            modelId: GPT4_MODEL_ID, // Replace with actual model ID
          },
        },
        selectedIdea: idea,
      },
    });

    return NextResponse.json(updatedMovie);
  } catch (error) {
    console.error('Error selecting idea:', error);
    return NextResponse.json(
      { error: 'Failed to select idea' },
      { status: 500 }
    );
  }
}
