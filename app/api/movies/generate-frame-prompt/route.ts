import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const {
      movieId,
      frameIndex,
      shotDescription,
      nextShotDescription,
      script,
    } = await req.json();
    // Dummy generation algorithm for base scene prompt:
    const prompt = `Frame ${
      Number(frameIndex) + 1
    }\nCurrent Shot: ${shotDescription}\nNext Shot: ${nextShotDescription}\nScene Script: ${script}\nGenerate a base image prompt for this scene.`;
    return NextResponse.json({ prompt });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    );
  }
}
