import { NewEnrollmentInterface } from '@/constants/interface';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/db';
import { sendUserTokenForEnrolledQuiz } from '@/lib/mail';
import { generateToken } from '@/lib/math';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { competition: string; quizId: string } }
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

    const client = await clientPromise;
    const db = client.db('spardha');
    const userDetailsCollection = db.collection('users');
    const quizCollections = db.collection(`${params.competition}-quiz_details`);

    const quizDetails = await quizCollections.findOne({
      quizId: params.quizId,
    });
    if (!quizDetails)
      return NextResponse.json(
        { error: 'Quiz not found', success: false },
        { status: 404 }
      );

    if (quizDetails.entryFee > 0) {
      return NextResponse.json(
        {
          error: `Entry Fee is ${quizDetails.entryFee} contact the quiz organizer`,
          success: false,
        },
        { status: 404 }
      );
    }

    // Fetch user details
    const userDetails = await userDetailsCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!userDetails) {
      return NextResponse.json(
        { error: 'User not found', success: false },
        { status: 404 }
      );
    }

    const enrolledInData: NewEnrollmentInterface[] =
      userDetails.enrolledIn || []; // Ensure it's an array

    // Check if already enrolled
    const isAlreadyEnrolled = enrolledInData.some(
      (enrollment: {
        competition: string;
        quizId: string;
        isEnrolled: boolean;
      }) =>
        enrollment.competition === params.competition &&
        enrollment.quizId === params.quizId &&
        enrollment.isEnrolled === true
    );

    if (isAlreadyEnrolled) {
      return NextResponse.json(
        { success: false, error: 'Already enrolled' },
        { status: 404 }
      );
    }

    // Enrollment object
    const newEnrollment: NewEnrollmentInterface = {
      competition: params.competition,
      quizId: params.quizId,
      isEnrolled: true,
      attempts: 0,
    };

    const iterableToken = userDetails.token || [];
    const token = generateToken(
      userDetails.username,
      userDetails.enrollmentNumber ?? userDetails.email
    );
    const tokenData = {
      tokenFor: params.quizId,
      token: token,
    };

    // Push to the enrolledIn array
    await userDetailsCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          enrolledIn: [...enrolledInData, newEnrollment],
          token: [...iterableToken, tokenData],
        },
      }
    );

    await sendUserTokenForEnrolledQuiz(
      userDetails.email,
      userDetails.username,
      quizDetails.quizName,
      token
    );

    return NextResponse.json(
      { success: true, message: 'Successfully enrolled' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error enrolling user:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
