import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ModelType, UnitType } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      type,
      provider,
      inputTokenCost,
      outputTokenCost,
      costPerUnit,
      unitType,
      contextWindowSize,
      version,
      isActive,
    } = body;

    const model = await prisma.aIModel.create({
      data: {
        name,
        type: type as ModelType,
        provider,
        inputTokenCost,
        outputTokenCost,
        costPerUnit,
        unitType: unitType as UnitType,
        contextWindowSize,
        version,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json(
      { error: 'Error creating model' },
      { status: 500 }
    );
  }
}
