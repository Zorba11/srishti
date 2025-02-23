import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import { GPT4_MODEL_ID } from '@/constants/AIModels';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { movieId, userPrompt, systemPrompt } = await req.json();

    // Get the movie with actor and selected idea details
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(movieId) },
      include: {
        actor: true,
        ideaSelected: {
          orderBy: { id: 'desc' },
          take: 1,
        },
      },
    });

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    // Enhance user prompt with actor information and selected idea if available
    const enhancedUserPrompt = `
      ${
        movie.actor
          ? `Here's the user prompt: This script should For a 30 second ad movie starring ${movie.actor.name},`
          : ''
      }
      Based on this movie idea: ${userPrompt}
    `.trim();

    // Get the AI model configuration
    const aiModel = await prisma.aIModel.findUnique({
      where: { id: GPT4_MODEL_ID },
    });

    if (!aiModel || !aiModel.isActive) {
      throw new Error('AI model not found or inactive');
    }

    // Call GPT-4 to generate script
    const completion = await openai.chat.completions.create({
      model: aiModel.name,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: enhancedUserPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const scriptContent = JSON.parse(
      completion.choices[0].message.content || '{}'
    ).script;

    // Calculate costs based on input and output tokens separately
    const inputTokens = completion.usage?.prompt_tokens || 0;
    const outputTokens = completion.usage?.completion_tokens || 0;

    const inputCost = (inputTokens * (aiModel.inputTokenCost || 0)) / 1_000_000;
    const outputCost =
      (outputTokens * (aiModel.outputTokenCost || 0)) / 1_000_000;
    const totalCostInDollars = inputCost + outputCost;

    // Update movie with new prompts
    await prisma.movie.update({
      where: { id: parseInt(movieId) },
      data: {
        scriptAgentSystemPrompt: systemPrompt,
        selectedIdea: userPrompt,
        selectedScript: scriptContent,
      },
    });

    // Store first script draft
    const storedScript = await prisma.firstScriptDraft.create({
      data: {
        movieId: parseInt(movieId),
        scriptContent: scriptContent,
        modelId: GPT4_MODEL_ID,
      },
    });

    // Store inference cost
    await prisma.inferenceCost.create({
      data: {
        movieId: parseInt(movieId),
        modelId: GPT4_MODEL_ID,
        inferenceDuration: completion.usage?.total_tokens || 0,
        costInDollars: Math.ceil(totalCostInDollars * 100), // Convert to cents and round up
      },
    });

    return NextResponse.json({ script: scriptContent }, { status: 200 });
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: 'Error generating script' },
      { status: 500 }
    );
  }
}
