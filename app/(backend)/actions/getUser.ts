import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

export async function getUserEnrolledInData(
  competition: string,
  quizId: string
) {
  try {
    const client = await clientPromise;
    const db = client.db('spardha');
    const userCollection = db.collection('users');

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return null;
    }

    const userId = session.user.id;

    const getDetails = await userCollection.findOne(
      {
        _id: new ObjectId(userId),
        enrolledIn: {
          $elemMatch: {
            competition: competition,
            quizId: quizId,
          },
        },
      },
      { projection: { enrolledIn: 1, _id: 0 } }
    );

    if (!getDetails || !getDetails.enrolledIn) {
      return null;
    }

    const filteredEnrollment = getDetails.enrolledIn.find(
      (enrollment: any) =>
        enrollment.competition === competition && enrollment.quizId === quizId
    );

    return { enrolledIn: filteredEnrollment || null };
  } catch (error) {
    console.error('Error fetching user enrollment data:', error);
    return null;
  }
}
