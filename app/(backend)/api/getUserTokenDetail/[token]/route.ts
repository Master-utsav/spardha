import clientPromise from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    // Get token from query parameters
    const token = params.token;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required', success: false },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('spardha');
    const userCollection = db.collection('users');

    // Fetch user token details
    const getUserTokenForQuizId = await userCollection.findOne(
      {
        token: {
          $elemMatch: { token },
        },
      },
      { projection: { token: 1, _id: 0 } }
    );

    if (!getUserTokenForQuizId) {
      return NextResponse.json(
        { error: 'Token not found', success: false },
        { status: 404 }
      );
    }

    // Extract tokenFor field from the nested token array
    const tokenFor = String(
      getUserTokenForQuizId.token.find((t: any) => t.token === token)?.tokenFor
    );

    return NextResponse.json({ tokenFor, success: true }, { status: 200 });
  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
