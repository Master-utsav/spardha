import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { aiCheckSolutionResponse } from '@/lib/aiCheck';
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

  if (params.competition === 'code-clash') {
    try {
      const body = await req.json();
      const { language, answers, timeSpent } = body;

      const client = await clientPromise;
      const db = client.db('spardha');
      const submissionsCollection = db.collection(
        `${params.competition}-quiz_submissions`
      );
      const userCollection = db.collection('users');

      const getDetails = await userCollection.findOne(
        {
          _id: new ObjectId(userId),
          enrolledIn: {
            $elemMatch: {
              competition: params.competition,
              quizId: params.quizId,
            },
          },
        },
        { projection: { enrolledIn: 1, _id: 0 } }
      );

      if (!getDetails) {
        return NextResponse.json(
          { error: 'Failed to validate the user' },
          { status: 500 }
        );
      }

      const filteredEnrollment = getDetails.enrolledIn.find(
        (enrollment: any) =>
          enrollment.competition === params.competition &&
          enrollment.quizId === params.quizId
      );

      const attemptCount = filteredEnrollment.attempts;

      const questionsCollection = db.collection(
        `${params.competition}-questions`
      );

      const questions = await questionsCollection
        .find({ language, quizId: params.quizId })
        .toArray();

      let score = 0;
      questions.forEach((question: any) => {
        const userAnswer = answers[question._id];
        if (userAnswer === question.correctAnswer) {
          score += question.marks;
        } else if (userAnswer !== undefined) {
          score -= question.negativeMarks;
        }
      });

      await submissionsCollection.insertOne({
        userId,
        quizId: params.quizId,
        language,
        answers,
        score,
        timeSpent,
        attemptCount,
        submittedAt: new Date(),
      });

      return NextResponse.json({ success: true, score });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      return NextResponse.json(
        { error: 'Failed to submit quiz' },
        { status: 500 }
      );
    }
  } else if (params.competition === 'bug-bash') {
    try {
      const body = await req.json();
      const { language, userSolutions, timeSpent } = body;

      const client = await clientPromise;
      const db = client.db('spardha');
      const submissionsCollection = db.collection(
        `${params.competition}-quiz_submissions`
      );
      const userCollection = db.collection('users');

      const getDetails = await userCollection.findOne(
        {
          _id: new ObjectId(userId),
          enrolledIn: {
            $elemMatch: {
              competition: params.competition,
              quizId: params.quizId,
            },
          },
        },
        { projection: { enrolledIn: 1, _id: 0 } }
      );

      if (!getDetails) {
        return NextResponse.json(
          { error: 'Failed to validate the user' },
          { status: 500 }
        );
      }

      const filteredEnrollment = getDetails.enrolledIn.find(
        (enrollment: any) =>
          enrollment.competition === params.competition &&
          enrollment.quizId === params.quizId
      );

      const attemptCount = filteredEnrollment.attempts;

      const questionsCollection = db.collection(
        `${params.competition}-questions`
      );

      const questions = await questionsCollection
        .find({ language, quizId: params.quizId })
        .toArray();

      let score = 0;
      let correctnessReview: {
        questionId: string;
        isCorrect: boolean;
      }[] = [];

      for (const question of questions) {
        const userSolutionOfQuestion = userSolutions[question._id.toString()];
        // Assuming aiCheckSolutionResponse is an async function that returns an object

        if (userSolutionOfQuestion !== undefined) {
          const isCorrect = await aiCheckSolutionResponse(
            question.question.problem,
            question.question.buggySolution,
            language,
            userSolutionOfQuestion
          );

          correctnessReview.push({
            questionId: question._id.toString(),
            isCorrect: isCorrect,
          });
          if (isCorrect) {
            score += question.marks;
          } else if (!isCorrect && userSolutionOfQuestion !== undefined) {
            score -= question.negativeMarks;
          }
        }
      }

      await submissionsCollection.insertOne({
        userId,
        quizId: params.quizId,
        language,
        userSolutions: userSolutions,
        correctnessReview: correctnessReview,
        score,
        timeSpent,
        attemptCount,
        submittedAt: new Date(),
      });

      return NextResponse.json({ success: true, score });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      return NextResponse.json(
        { error: 'Failed to submit quiz' },
        { status: 500 }
      );
    }
  } else if (params.competition === 'code-mirage') {
    try {
      const body = await req.json();
      const { fullHtml, timeSpent } = body;

      const client = await clientPromise;
      const db = client.db('spardha');
      const submissionsCollection = db.collection(
        `${params.competition}-quiz_submissions`
      );
      const userCollection = db.collection('users');
      const htmlpageCollection = db.collection('htmlPages');

      const getDetails = await userCollection.findOne(
        {
          _id: new ObjectId(userId),
          enrolledIn: {
            $elemMatch: {
              competition: params.competition,
              quizId: params.quizId,
            },
          },
        },
        { projection: { enrolledIn: 1, _id: 0 } }
      );

      if (!getDetails) {
        return NextResponse.json(
          { error: 'Failed to validate the user' },
          { status: 500 }
        );
      }

      const filteredEnrollment = getDetails.enrolledIn.find(
        (enrollment: any) =>
          enrollment.competition === params.competition &&
          enrollment.quizId === params.quizId
      );

      const attemptCount = filteredEnrollment.attempts;

      const uniqueId = uuidv4();

      await submissionsCollection.insertOne({
        userId,
        quizId: params.quizId,
        fullHtml,
        isScored: false,
        uniqueId,
        score: 0,
        timeSpent,
        attemptCount,
        submittedAt: new Date(),
      });

      await htmlpageCollection.insertOne({
        quizId: params.quizId,
        createdBy: userId,
        createdAt: new Date(),
        fullHtml,
        uniqueId,
      });
      return NextResponse.json({ success: true, uniqueId });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      return NextResponse.json(
        { error: 'Failed to submit quiz' },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
