import { QuizDetails } from '@/constants/interface';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/db';
import {
  sendTokenToTheUserEmail,
  sendUserTokenForEnrolledQuiz,
} from '@/lib/mail';
import { generateRandomPassword, generateToken } from '@/lib/math';
import { hash } from 'bcryptjs';
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
    const quizDetailsCollectionAsPerId = db.collection(
      `${params.competition}-quiz_details`
    );
    const userCollection = db.collection('users');

    const userQuizzes = await quizDetailsCollectionAsPerId.findOne({
      createdBy: userId,
      quizId: params.quizId,
    });
    if (!userQuizzes) {
      return NextResponse.json(
        {
          message: 'user cant add the local students in this group',
          success: false,
        },
        { status: 404 }
      );
    }
    const body = await req.json();
    const { email, username, enrollmentNumber, semester } = body;

    if (!email || !username || !enrollmentNumber || !semester) {
      return NextResponse.json(
        {
          message: 'Please fill all the fields',
          success: false,
        },
        { status: 404 }
      );
    }

    const userCheck = await userCollection.findOne({
      $or: [
        { email: email },
        { username: username },
        { enrollmentNumber: enrollmentNumber },
      ],
    });

    const isSameUserCreating =
      userCheck &&
      userCheck.email === email &&
      userCheck.username === username &&
      enrollmentNumber === enrollmentNumber;

    if (userCheck && !isSameUserCreating) {
      return NextResponse.json(
        {
          message: 'User already exists',
          success: false,
        },
        { status: 404 }
      );
    }

    const enrolledIn = {
      competition: params.competition,
      quizId: params.quizId,
      isEnrolled: true,
      attempts: 0,
    };

    const token = generateToken(username, enrollmentNumber);
    const tokenData = {
      tokenFor: params.quizId,
      token: token,
    };
    const password = generateRandomPassword(username, enrollmentNumber);
    const hashedPassword = await hash(password, 12);

    if (isSameUserCreating) {
      const user = await userCollection.findOneAndUpdate(
        { email },
        {
          $addToSet: {
            token: tokenData,
            enrolledIn: enrolledIn,
          },
        },
        { upsert: true, returnDocument: 'after' }
      );

      if (!user) {
        return NextResponse.json(
          { message: 'Failed to create the user', success: false },
          { status: 404 }
        );
      }

      await sendUserTokenForEnrolledQuiz(
        email,
        username,
        userQuizzes.quizName,
        token,
      );
    } else {
      const user = await userCollection.findOneAndUpdate(
        { email },
        {
          $setOnInsert: {
            username,
            role: 'college',
            enrollmentNumber,
            password: hashedPassword,
            semester,
            isAdmin: false,
          },
          $addToSet: {
            token: tokenData,
            enrolledIn: enrolledIn,
          },
        },
        { upsert: true, returnDocument: 'after' }
      );

      if (!user) {
        return NextResponse.json(
          { message: 'Failed to create the user', success: false },
          { status: 404 }
        );
      }
      await sendTokenToTheUserEmail(
        email,
        token,
        userQuizzes.quizName,
        password,
        username
      );
    }

    return NextResponse.json(
      { message: 'token send to the user', success: true },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add user', success: false },
      { status: 500 }
    );
  }
}
