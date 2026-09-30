import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that require login
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings', '/events/create'];

// Routes only for guests (redirect to dashboard if logged in)
const GUEST_ONLY_ROUTES = ['/login', '/register', '/forgot-password'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth_token')?.value;
  const isLoggedIn = !!authToken;

  // If trying to access a protected route without a token → redirect to login
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // preserve intended destination
    return NextResponse.redirect(loginUrl);
  }

  // Admin/VCO protection for /dashboard
  if (pathname.startsWith('/dashboard') && isLoggedIn && authToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
      const { payload } = await jwtVerify(authToken, secret);
      const role = payload.role as string;
      
      if (role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch (error) {
      // Token is invalid, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If already logged in and visiting guest-only pages → redirect to homepage
  const isGuestOnly = GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route));
  if (isGuestOnly && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on these path patterns (skip static files & API routes)
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.jpg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
