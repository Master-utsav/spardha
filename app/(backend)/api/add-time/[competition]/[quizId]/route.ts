import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/db';
import { getDurationCalculation } from '@/lib/math';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { competition: string; quizId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Unauthorized: User not logged in', success: false },
      { status: 401 }
    );
  }
  const userId = session.user.id;

  try {
    const client = await clientPromise;
    const db = client.db('spardha');
    const quizCollections = db.collection(`${params.competition}-quiz_details`);

    const quiz = await quizCollections.findOne({ quizId: params.quizId });
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found', success: false },
        { status: 404 }
      );
    }

    if (quiz.createdBy !== userId) {
      return NextResponse.json(
        { error: 'You are not the creator of this quiz', success: false },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { startDate, startTime, endDate, endTime, duration } = body;

    if ((!startDate || !startTime || !endDate || !endTime) && !duration) {
      return NextResponse.json(
        {
          error:
            'Missing required fields (startDate, startTime, endDate, endTime , duration)',
          success: false,
        },
        { status: 400 }
      );
    }
    let durationSet: string = '';
    let isDurationBased: boolean = false;

    if (duration) {
      durationSet = duration;
      isDurationBased = true;
    } else {
      durationSet = getDurationCalculation(
        startDate,
        startTime,
        endDate,
        endTime
      );
    }

    const result = await quizCollections.updateOne(
      { quizId: params.quizId },
      {
        $set: {
          startDate,
          startTime,
          endDate,
          endTime,
          duration: durationSet,
          isDurationBased,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        {
          message: 'No changes made. Quiz details might already be the same.',
          success: true,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Timer set successfully and quiz updated',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error setting timer:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
