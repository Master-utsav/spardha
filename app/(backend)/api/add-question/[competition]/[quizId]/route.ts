import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';

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

    // Fixed template literals for collection names
    const questionsCollection = db.collection(
      `${params.competition}-questions`
    );
    const quizCollections = db.collection(`${params.competition}-quiz_details`);

    const body = await req.json();
    const {
      quizId,
      question,
      options,
      correctAnswer,
      marks,
      negativeMarks,
      isAdmin,
      language,
      correctSolution,
      fullHtml,
      htmlBoilerPlate,
      cssBoilerPlate,
    } = body;

    // Validate quizId match
    if (quizId !== params.quizId) {
      return NextResponse.json(
        {
          error: 'quizName does not match the API quizId param',
          success: false,
        },
        { status: 400 }
      );
    }

    // Validate Admin Privileges
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin Block: Only admins can add questions', success: false },
        { status: 403 }
      );
    }

    // Find quizzes created by this user
    const allQuiz = await quizCollections.findOne({
      quizId,
      createdBy: userId,
    });

    if (!allQuiz) {
      return NextResponse.json(
        { error: 'Unauthorized: No quiz found for this user', success: false },
        { status: 403 }
      );
    }

    // Ensure user has access to the specific quiz
    const isValidUser = allQuiz?.quizId === params.quizId;

    if (!isValidUser) {
      return NextResponse.json(
        {
          error: 'Unauthorized: You do not have access to modify this quiz',
          success: false,
        },
        { status: 403 }
      );
    }

    // Handle `code-clash` competition separately
    if (params.competition === 'code-clash') {
      await questionsCollection.insertOne({
        event: 'code-clash',
        quizId,
        question,
        options,
        correctAnswer,
        marks,
        language,
        negativeMarks,
        createdAt: new Date(),
        createdBy: userId,
      });

      return NextResponse.json({ success: true });
    } else if (params.competition === 'bug-bash') {
      await questionsCollection.insertOne({
        event: 'bug-bash',
        quizId,
        question,
        marks,
        language,
        correctSolution,
        negativeMarks,
        createdAt: new Date(),
        createdBy: userId,
      });
      return NextResponse.json({ success: true });
    } else if (params.competition === 'code-mirage') {
      if (!quizId || !fullHtml) {
        return NextResponse.json(
          { error: 'Missing quizId, HTML, or CSS', success: false },
          { status: 400 }
        );
      }

      const uniqueId = uuidv4();
      const iframeUrl = `${process.env.domain}/preview-pages/code-mirage-ui-pages/${uniqueId}`;

      await questionsCollection.insertOne({
        event: 'code-mirage',
        quizId,
        question,
        uniqueId,
        htmlBoilerPlate,
        cssBoilerPlate,
        createdAt: new Date(),
        createdBy: userId,
      });
      const htmlpageCollection = db.collection('htmlPages');
      await htmlpageCollection.insertOne({
        quizId,
        createdBy: userId,
        createdAt: new Date(),
        fullHtml,
        uniqueId,
      });

      return NextResponse.json({ iframeUrl, success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Invalid competition type', success: false },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error adding question:', error);
    return NextResponse.json(
      { error: 'Failed to add question', success: false },
      { status: 500 }
    );
  }
}
