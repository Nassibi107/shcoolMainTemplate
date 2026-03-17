import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/'];

const ROLE_PATHS: Record<string, string[]> = {
  ADMIN:     ['/admin'],
  ASSISTANT: ['/assistant'],
  TEACHER:   ['/teacher'],
  STUDENT:   ['/student'],
  PARENT:    ['/parent'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p)) {
    if (accessToken) {
      // Already authenticated, redirect to home
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Require auth for protected paths
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
