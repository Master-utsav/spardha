import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    enrollmentNumber?: string | null;
    semester?: number | null;
  }

  interface Session {
    user: {
      isAdmin: boolean;
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      enrollmentNumber?: string | null;
      semester?: number | null;
    };
  }
}
