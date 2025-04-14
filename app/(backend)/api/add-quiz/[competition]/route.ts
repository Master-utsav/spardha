import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { competition: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: User not logged in', success: false },
        { status: 401 }
      );
    }
    const userId = session.user.id;
    const userName = session.user.name;

    const body = await req.json();
    const {
      quizName,
      languages,
      description,
      rules,
      entryFee,
      prizeMoney,
      difficulty,
    } = body;

    if (
      !Array.isArray(languages) ||
      !Array.isArray(rules) ||
      !Array.isArray(prizeMoney)
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid input: languages, rules and prizeMoney must be arrays',
          success: false,
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('spardha');
    const quizDetailsCollection = db.collection(
      `${params.competition}-quiz_details`
    );

    // Generate a unique quizId
    const quizId = quizName.toLowerCase().trim().replace(/\s+/g, '-');

    // Check if quiz already exists
    const existingQuiz = await quizDetailsCollection.findOne({ quizId });
    if (existingQuiz) {
      return NextResponse.json(
        { error: 'Quiz Name already exists', success: false },
        { status: 400 }
      );
    }

    // Insert new quiz
    await quizDetailsCollection.insertOne({
      event: params.competition,
      quizId,
      quizName,
      entryFee,
      difficulty,
      prizeMoney,
      createdBy: userId,
      authorName: userName,
      languages,
      description,
      rules,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { success: true, message: 'Quiz created successfully', quizId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    );
  }
}
