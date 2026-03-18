import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/'];

const ROLE_PREFIXES: Record<string, string> = {
  ADMIN: '/admin',
  ASSISTANT: '/assistant',
  TEACHER: '/teacher',
  STUDENT: '/student',
  PARENT: '/parent',
};

function decodeJwtPayload(token: string): { role?: string } | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as { role?: string };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  if (PUBLIC_PATHS.some((p) => pathname === p)) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = decodeJwtPayload(accessToken);
  const role = payload?.role as keyof typeof ROLE_PREFIXES | undefined;
  const allowedPrefix = role ? ROLE_PREFIXES[role] : null;

  const sharedPaths = ['/notifications', '/dashboard'];
  const isSharedPath = sharedPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (allowedPrefix && !isSharedPath) {
    const isAllowed = pathname.startsWith(allowedPrefix);
    if (!isAllowed) {
      return NextResponse.redirect(new URL(allowedPrefix, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
