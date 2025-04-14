import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Define protected routes
  const protectedRoutes = ['/spardha'];

  // Check if the path starts with any protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if trying to access protected route without being logged in
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if trying to access auth pages while logged in
  if ((pathname === '/login' || pathname.startsWith('/signup')) && token) {
    return NextResponse.redirect(new URL('/spardha', request.url));
  }

  if (pathname.startsWith('/admin')) {
    if (!token || !token.isAdmin) {
      return NextResponse.redirect(new URL('/spardha', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/spardha/:path*',
    '/login',
    '/signup-as-outsider',
    '/signup-as-college',
    '/admin/:path*',
  ],
};
