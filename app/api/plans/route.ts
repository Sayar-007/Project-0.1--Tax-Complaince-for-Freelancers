import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const savePlanSchema = z.object({
  planContent: z.string().min(1, 'Plan content cannot be empty'),
  sourceData: z.record(z.string(), z.any()), // Assuming sourceData is a generic JSON object
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { planContent, sourceData } = savePlanSchema.parse(body);

    const savedPlan = await prisma.compliancePlan.create({
      data: {
        userId: session.user.id,
        planContent: planContent,
        sourceData: sourceData,
      },
    });

    return NextResponse.json(
      { message: 'Plan saved successfully', planId: savedPlan.id },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input for saving plan', errors: error.errors },
        { status: 400 }
      );
    }
    console.error('Error saving plan:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to fetch user's plans
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const planId = req.nextUrl.searchParams.get('id');

    if (planId) {
      const singlePlan = await prisma.compliancePlan.findUnique({
        where: {
          id: planId,
          userId: session.user.id, // Ensure plan belongs to the logged-in user
        },
      });

      if (!singlePlan) {
        return NextResponse.json({ message: 'Plan not found or unauthorized' }, { status: 404 });
      }
      return NextResponse.json({ plan: singlePlan }, { status: 200 });
    }

    const userPlans = await prisma.compliancePlan.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ plans: userPlans }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
