import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import clientPromise from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { ajEmail } from '@/lib/arcjet';

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password, role, enrollmentNumber, semester } =
      body;

    // Validate required fields
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidEmail = (identity: string) => emailRegex.test(identity);

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email', success: false },
        { status: 400 }
      );
    }

    const decision = await ajEmail.protect(req, {
      email: email,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: 'Email status not confirmed', success: false },
        { status: 404 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('spardha');
    const usersCollection = db.collection('users');
    const otpCollection = db.collection('otps');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }, { enrollmentNumber }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or username already exists', success: false },
        { status: 409 }
      );
    }

    // Additional validation for college students
    if (role === 'college' && (!enrollmentNumber || !semester)) {
      return NextResponse.json(
        {
          error:
            'Enrollment number and semester are required for college students',
          success: false,
        },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes

    // Store OTP in database
    await otpCollection.insertOne({
      email,
      otp,
      expiry: otpExpiry,
      verified: false,
      userData: {
        email,
        username,
        password: await hash(password, 12),
        role: role || 'outsider',
        isAdmin: false,
        enrollmentNumber,
        semester: semester ? parseInt(semester) : null,
        createdAt: new Date(),
        enrolledIn: [],
      },
    });

    // Send verification email
    await sendVerificationEmail(email, otp);

    return NextResponse.json(
      { message: 'OTP sent to email for verification', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration', success: false },
      { status: 500 }
    );
  }
}
