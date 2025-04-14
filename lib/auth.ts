import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import clientPromise from './db';
import { ObjectId } from 'mongodb';
import { aj } from './arcjet';
import { getRetryMessage } from './math';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    isAdmin: boolean;
    enrollmentNumber?: string | null;
    semester?: number | null;
    email: string;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    role: string;
    isAdmin: boolean;
    enrollmentNumber?: string | null;
    semester?: number | null;
    email: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email/Username/Enrollment', type: 'text' },
        password: { label: 'Password', type: 'password' },
        token: { label: 'Token', type: 'text', required: false },
        competition: { label: 'Competition', type: 'text', required: false },
      },
      async authorize(credentials, req) {
        try {
          const decision: any = await aj.protect(req);
          if (decision.isDenied()) {
            const remainingSeconds = Math.floor(decision.ttl % 60);
            const remainingMinutes = Math.floor(decision.ttl / 60);

            throw new Error(
              getRetryMessage(remainingMinutes, remainingSeconds)
            );
          }

          const client = await clientPromise;
          const db = client.db('spardha');
          const usersCollection = db.collection('users');

          if (credentials?.token && credentials.competition) {
            const quizDetailsCollection = db.collection(
              `${credentials.competition}-quiz_details`
            );
            const user = await usersCollection.findOne({
              token: { $elemMatch: { token: credentials.token } },
            });

            if (!user) {
              throw new Error('Invalid token');
            }

            const quizDetails = await quizDetailsCollection.findOne({
              quizId: {
                $in: user.enrolledIn.map((entry: any) => entry.quizId),
              },
            });

            if (!quizDetails) {
              throw new Error('Invalid token');
            }
            const userEnrolledIndetails = await usersCollection.findOne(
              {
                _id: new ObjectId(user._id),
                enrolledIn: {
                  $elemMatch: {
                    competition: credentials.competition,
                    quizId: quizDetails.quizId,
                  },
                },
              },
              { projection: { enrolledIn: 1, _id: 0 } }
            );

            if (
              !quizDetails.isDurationBased &&
              userEnrolledIndetails?.attempts > 0
            ) {
              throw new Error('You have already attempted this quiz.');
            }

            return {
              id: user._id.toString(),
              email: user.email,
              name: user.username,
              role: user.role || 'user',
              isAdmin: user.isAdmin ?? false,
              enrollmentNumber: user.enrollmentNumber || null,
              semester: user.semester || null,
            };
          } else if (credentials?.identifier && credentials?.password) {
            const user = await usersCollection.findOne({
              $or: [
                { email: credentials.identifier.trim().toLowerCase() },
                { username: credentials.identifier.trim().toLowerCase() },
                { enrollmentNumber: credentials.identifier.trim() },
              ],
            });

            if (!user) {
              throw new Error('No user found with this identifier');
            }

            const isPasswordValid = await compare(
              credentials.password,
              user.password
            );
            if (!isPasswordValid) {
              throw new Error('Invalid password');
            }

            return {
              id: user._id.toString(),
              email: user.email,
              name: user.username,
              role: user.role || 'user',
              isAdmin: user.isAdmin ?? false,
              enrollmentNumber: user.enrollmentNumber || null,
              semester: user.semester || null,
            };
          } else {
            throw new Error('Missing credentials');
          }
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
        token.isAdmin = user.isAdmin ?? false;
        token.enrollmentNumber = user.enrollmentNumber || null;
        token.semester = user.semester || null;
        token.name = user.name || 'user';
        token.email = user.email || 'default@gmail.com';
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          role: token.role as string,
          isAdmin: token.isAdmin as boolean,
          enrollmentNumber: token.enrollmentNumber as string | null,
          semester: token.semester as number | null,
          name: token.name as string,
          email: token.email as string,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Create a wrapper for API routes to apply Arcjet protection
export async function withArcjet(req: any, res: any, handler: Function) {
  try {
    // Apply Arcjet protection
    const decision: any = await aj.protect(req);

    // Handle rate limiting
    if (decision.status === 'REJECT') {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: decision.retryAfter,
      });
    }

    // Continue with the handler
    return await handler(req, res);
  } catch (error) {
    console.error('Arcjet error:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}
