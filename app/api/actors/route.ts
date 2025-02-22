import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const { name, portraitUrl } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Create the actor
    const actor = await prisma.actor.create({
      data: {
        name,
        portraitUrl,
      },
    });

    return NextResponse.json(actor, { status: 201 });
  } catch (error) {
    console.error('Error creating actor:', error);
    return NextResponse.json(
      { error: 'Error creating actor' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch all actors
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const actors = await prisma.actor.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        portraitUrl: true,
      },
    });

    console.log('[api/actors] actors get: ', actors);

    return NextResponse.json(actors, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error fetching actors:', error);
    return NextResponse.json(
      { error: 'Error fetching actors' },
      { status: 500 }
    );
  }
}
