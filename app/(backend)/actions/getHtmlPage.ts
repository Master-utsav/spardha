'use server';

import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

export async function getPreviewPage(uniqueId: string) {
  const client = await clientPromise;
  const db = client.db('spardha');
  const pageDetailsCollection = db.collection(`htmlPages`);

  const htmlPage = await pageDetailsCollection.findOne({ uniqueId: uniqueId });

  if (!htmlPage) {
    return null;
  }

  return {
    ...htmlPage,
    _id: htmlPage._id.toString(),
    submittedAt: htmlPage.submittedAt
      ? new Date(htmlPage.submittedAt).toISOString()
      : null,
  };
}

export async function getUniqueIdForCodeMiragePage(quizId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return null;
  }
  const userId = session.user.id;

  if (!userId) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db('spardha');
  const quizDetailsCollection = db.collection(`code-mirage-quiz_details`);
  const userCollection = db.collection('users');

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
        $elemMatch: { quizId, isEnrolled: true },
      },
    },
    {
      $inc: { 'enrolledIn.$.attempts': 1 },
    }
  );

  const questionsCollection = db.collection('code-mirage-questions');
  const questionData = await questionsCollection.findOne({ quizId: quizId });
  if (!questionData) {
    return null;
  }

  const uniqueId = questionData.uniqueId;
  if (!uniqueId) {
    return null;
  }

  return uniqueId;
}
