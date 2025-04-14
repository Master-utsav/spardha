import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

export async function getLeaderBoardResult(
  competition: string,
  quizId: string,
  attempt: number
) {
  try {
    const client = await clientPromise;
    const db = client.db('spardha');
    const userCollection = db.collection('users');
    const submissionsCollection = db.collection(
      `${competition}-quiz_submissions`
    );

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return null;
    }

    const userId = session.user.id;
    const userDetails = await userCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!userDetails) return null;

    const enrolledQuiz = userDetails.enrolledIn.find(
      (enroll: any) => enroll.quizId === quizId
    );

    if (!enrolledQuiz || enrolledQuiz.attempts < attempt) return null;

    if (attempt <= 0) {
      throw new Error('Attempt number must be greater than 0.');
    }

    // Fetch all submissions for the given quizId
    const userSubmissions: any = await submissionsCollection
      .aggregate([
        { $match: { quizId: String(quizId), attemptCount: Number(attempt) } }, // Ensure quizId is a string
        {
          $lookup: {
            from: 'users',
            let: { userIdStr: { $toString: '$userId' } }, // Convert userId to string
            pipeline: [
              {
                $match: {
                  $expr: { $eq: [{ $toString: '$_id' }, '$$userIdStr'] },
                },
              }, // Match with _id
            ],
            as: 'userDetail',
          },
        },
        { $unwind: { path: '$userDetail', preserveNullAndEmptyArrays: true } }, // Preserve even if no user found
        {
          $project: {
            _id: 1,
            userId: 1,
            submittedAt: 1,
            language: 1,
            score: 1,
            timeSpent: 1,
            isScored: 1,
            uniqueId: 1,
            name: { $ifNull: ['$userDetail.username', 'Unknown'] }, // Prevent null values
            isCollegeStudent: { $eq: ['$userDetail.role', 'college'] },
            email: '$userDetail.email',
            enrollmentNumber: '$userDetail.enrollmentNumber',
            semester: '$userDetail.semester',
          },
        },
        { $sort: { score: -1, submittedAt: 1 } },
      ])
      .toArray();

    return userSubmissions;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return null;
  }
}

export async function getQuizResult(
  competition: string,
  quizId: string,
  userId: string
) {
  try {
    const client = await clientPromise;
    const db = client.db('spardha');
    const submissionsCollection = db.collection(
      `${competition}-quiz_submissions`
    );

    const result = await submissionsCollection.findOne(
      { userId: userId, quizId: quizId },
      { sort: { submittedAt: -1 } }
    );

    if (!result) {
      return null;
    }

    return {
      ...result,
      _id: result._id.toString(),
      submittedAt: result.submittedAt
        ? new Date(result.submittedAt).toISOString()
        : null,
    };
  } catch (error) {
    return null;
  }
}
