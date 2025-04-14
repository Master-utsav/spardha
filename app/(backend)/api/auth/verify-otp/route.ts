import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required', success: false },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('spardha');
    const otpCollection = db.collection('otps');
    const usersCollection = db.collection('users');

    // Find the OTP record
    const otpRecord = await otpCollection.findOne({
      email,
      otp,
      verified: false,
      expiry: { $gt: new Date() }, // Check if OTP is not expired
    });
    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP', success: false },
        { status: 400 }
      );
    }
    await otpCollection.updateOne(
      { _id: otpRecord._id },
      { $set: { verified: true } }
    );

    // Create user account
    await usersCollection.insertOne(otpRecord.userData);

    return NextResponse.json(
      { message: 'Email verified successfully', success: true },
      { status: 200 }
    );
  } catch (error) {
    // Mark OTP as verified
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred during verification', success: false },
      { status: 500 }
    );
  }
}
