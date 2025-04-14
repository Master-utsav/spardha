'use server';

import {
  QuizDetails,
  QuizQuestion,
  SanitizedQuizQuestion,
} from '@/constants/interface';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

export async function getAllQuizDetails(competition: string) {
  try {
    const client = await clientPromise;
    const db = client.db('spardha');
    const quizDetailsCollection = db.collection<QuizDetails>(
      `${competition}-quiz_details`
    );
    const quizDetails = await quizDetailsCollection.find().toArray();
    const allQuizDetails = quizDetails.map((quiz) => ({
      ...quiz,
      _id: quiz._id.toString(),
      createdAt: quiz.createdAt ? quiz.createdAt.toISOString() : null,
    }));
    return allQuizDetails;
  } catch (error) {
    console.error('Error fetching all quiz details:', error);
    return [];
  }
}

export async function getQuizIdDetails(competition: string, quizId: string) {
  try {
    const client = await clientPromise;
    const db = client.db('spardha');
    const quizDetailsCollection = db.collection(`${competition}-quiz_details`);
    const quizIdDetails = await quizDetailsCollection.findOne({ quizId });

    if (!quizIdDetails) return null;

    return {
      ...quizIdDetails,
      _id: quizIdDetails._id.toString(),
      createdAt: quizIdDetails.createdAt
        ? quizIdDetails.createdAt.toISOString()
        : null,
    };
  } catch (error) {
    console.error('Error fetching quiz details by ID:', error);
    return null;
  }
}
export async function getQuizIdDetailsByAdmin(
  competition: string,
  quizId: string
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return null;
  }
  const userId = session.user.id;

  try {
    const client = await clientPromise;
    const db = client.db('spardha');
    const quizDetailsCollection = db.collection<QuizDetails>(
      `${competition}-quiz_details`
    );
    const quizIdDetails = await quizDetailsCollection.findOne({
      quizId,
      createdBy: userId,
    });
    if (!quizIdDetails) {
      return null;
    }

    return {
      ...quizIdDetails,
      _id: quizIdDetails._id.toString(),
      createdAt: quizIdDetails.createdAt
        ? quizIdDetails.createdAt.toISOString()
        : null,
    };
  } catch (error) {
    return null;
  }
}

export async function getAllQuestionsOfQuiz(
  competition: string,
  quizId: string,
  language: string
): Promise<SanitizedQuizQuestion[] | null> {
  try {
    const client = await clientPromise;
    const db = client.db('spardha');
    const questionsCollection = db.collection<QuizQuestion>(
      `${competition}-questions`
    );
    const quizDetailsCollection = db.collection(`${competition}-quiz_details`);
    const userCollection = db.collection('users');

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return null;
    }

    const userId = session.user.id;

    const checkValidEnrolledUser = await userCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!checkValidEnrolledUser) {
      return null;
    }

    const checkEnrolledIn = checkValidEnrolledUser.enrolledIn.filter(
      (data: any) => data.quizId === quizId
    );
    const isUserEnrolled = checkEnrolledIn[0].isEnrolled;

    if (!isUserEnrolled) {
      return null;
    }

    const quizDetails = await quizDetailsCollection.findOne({ quizId: quizId });
    if (!quizDetails) {
      return null;
    }

    const isQuizDurationBased = quizDetails.isDurationBased;
    if (!isQuizDurationBased && checkEnrolledIn[0].attempts > 0) {
      return null;
    }

    await userCollection.updateOne(
      {
        _id: new ObjectId(userId),
        enrolledIn: {
          $elemMatch: { competition, quizId, isEnrolled: true },
        },
      },
      {
        $inc: { 'enrolledIn.$.attempts': 1 },
      }
    );

    const questions = await questionsCollection
      .find({ quizId, language })
      .toArray();

    const sanitizedQuestions: SanitizedQuizQuestion[] = questions.map(
      ({ _id, correctAnswer, createdAt, ...rest }) => ({
        _id: _id.toString(),
        createdAt: createdAt ? new Date(createdAt).toISOString() : null,
        ...rest,
      })
    );

    return sanitizedQuestions;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return [];
  }
}

export async function getMirageQuestion(competition: string, quizId: string) {
  try {
    const client = await clientPromise;
    const db = client.db('spardha');
    const questionsCollection = db.collection(`${competition}-questions`);
    const quizDetailsCollection = db.collection(`${competition}-quiz_details`);
    const userDetails = db.collection('users');

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return null;
    }
    const userId = session.user.id;

    if (!userId) {
      return null;
    }

    const checkValidEnrolledUser = await userDetails.findOne({
      _id: new ObjectId(userId),
    });

    if (!checkValidEnrolledUser) {
      return null;
    }

    const checkEnrolledIn = checkValidEnrolledUser.enrolledIn.filter(
      (data: any) => data.quizId === quizId
    );
    const isUserEnrolled = checkEnrolledIn[0].isEnrolled;

    if (!isUserEnrolled) {
      return null;
    }

    const quizDetails = await quizDetailsCollection.findOne({ quizId: quizId });
    if (!quizDetails) {
      return null;
    }

    const isQuizDurationBased = quizDetails.isDurationBased;
    if (!isQuizDurationBased && checkEnrolledIn[0].attempts > 0) {
      return null;
    }

    const questions = await questionsCollection.find({ quizId }).toArray();

    const sanitizedQuestions = questions.map((question) => ({
      ...question,
      _id: question._id.toString(),
      createdAt: question.createdAt
        ? new Date(question.createdAt).toISOString()
        : null,
    }));
    return sanitizedQuestions;
  } catch (error) {
    console.error('Error fetching mirage question:', error);
    return [];
  }
}

export async function getAllQuestionsOfQuizForResult(
  competition: string,
  quizId: string,
  language: string
) {
  try {
    const client = await clientPromise;
    const db = client.db('spardha');
    const questionsCollection = db.collection<QuizQuestion>(
      `${competition}-questions`
    );
    const quizDetailsCollection = db.collection(`${competition}-quiz_details`);
    const userDetails = db.collection('users');

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return null;
    }
    const userId = session.user.id;

    if (!userId) {
      return null;
    }

    const checkValidEnrolledUser = await userDetails.findOne({
      _id: new ObjectId(userId),
    });

    if (!checkValidEnrolledUser) {
      return null;
    }

    const checkEnrolledIn = checkValidEnrolledUser.enrolledIn.filter(
      (data: any) => data.quizId === quizId
    );
    const isUserEnrolled = checkEnrolledIn[0].isEnrolled;

    if (!isUserEnrolled) {
      return null;
    }

    const quizDetails = await quizDetailsCollection.findOne({ quizId: quizId });
    if (!quizDetails) {
      return null;
    }

    const isQuizDurationBased = quizDetails.isDurationBased;
    if (!isQuizDurationBased && checkEnrolledIn[0].attempts > 0) {
      return null;
    }

    const questions = await questionsCollection
      .find({ quizId, language })
      .toArray();

    const sanitizedQuestions = questions.map((question) => ({
      ...question,
      _id: question._id.toString(),
      createdAt: question.createdAt
        ? new Date(question.createdAt).toISOString()
        : null,
    }));
    return sanitizedQuestions;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return [];
  }
}

export async function geTimeOfQuiz(competition: string, quizId: string) {
  try {
    const client = await clientPromise;
    const db = client.db('spardha');
    const quizCollections = db.collection(`${competition}-quiz_details`);

    const quiz = await quizCollections.findOne({ quizId });
    if (!quiz) {
      return null;
    }

    const timerData = quiz.timeData;

    if (
      !timerData ||
      !timerData.startDate ||
      !timerData.startTime ||
      !timerData.endDate ||
      !timerData.endTime
    ) {
      return null;
    }

    // Parse start time (DD-MM-YYYY & HH:mm)
    const [startDay, startMonth, startYear] = timerData.startDate
      .split('-')
      .map(Number);
    const [startHours, startMinutes] = timerData.startTime
      .split(':')
      .map(Number);
    const startTimeInMs = new Date(
      startYear,
      startMonth - 1,
      startDay,
      startHours,
      startMinutes
    ).getTime();

    // Parse end time (DD-MM-YYYY & HH:mm)
    const [endDay, endMonth, endYear] = timerData.endDate
      .split('-')
      .map(Number);
    const [endHours, endMinutes] = timerData.endTime.split(':').map(Number);
    const endTimeInMs = new Date(
      endYear,
      endMonth - 1,
      endDay,
      endHours,
      endMinutes
    ).getTime();

    return { startTime: startTimeInMs, endTime: endTimeInMs };
  } catch (error) {
    return null;
  }
}
