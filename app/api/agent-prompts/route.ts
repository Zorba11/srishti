import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const { name, content } = await request.json();

    // Validate the input
    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      );
    }

    // Create new agent prompt
    const agentPrompt = await prisma.agentPrompts.create({
      data: {
        name,
        content,
      },
    });

    return NextResponse.json(agentPrompt, { status: 201 });
  } catch (error) {
    console.error('Error creating agent prompt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const { id, name, content } = await request.json();

    // Validate the input
    if (!id || (!name && !content)) {
      return NextResponse.json(
        { error: 'ID and at least one field (name or content) are required' },
        { status: 400 }
      );
    }

    // Check if the prompt exists
    const existingPrompt = await prisma.agentPrompts.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPrompt) {
      return NextResponse.json(
        { error: 'Agent prompt not found' },
        { status: 404 }
      );
    }

    // Update the agent prompt
    const updatedPrompt = await prisma.agentPrompts.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(content && { content }),
      },
    });

    return NextResponse.json(updatedPrompt, { status: 200 });
  } catch (error) {
    console.error('Error updating agent prompt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the name from the URL search params
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { error: 'Name parameter is required' },
        { status: 400 }
      );
    }

    // Find the prompt by name
    const prompt = await prisma.agentPrompts.findFirst({
      where: { name },
      select: {
        content: true,
      },
    });

    if (!prompt) {
      return NextResponse.json(
        { error: 'Agent prompt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(prompt, { status: 200 });
  } catch (error) {
    console.error('Error fetching agent prompt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
