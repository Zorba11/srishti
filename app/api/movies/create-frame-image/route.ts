import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { movieId, frameIndex, imagePrompt } = await req.json();
    // Dummy image creation: Using a placeholder image URL with the frame number
    const imageUrl = `https://via.placeholder.com/600x400?text=Frame+${
      Number(frameIndex) + 1
    }`;
    return NextResponse.json({ imageUrl });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create image' },
      { status: 500 }
    );
  }
}
