import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes only unauthenticated users can access.
// Authenticated users visiting these are redirected to their dashboard.
const GUEST_ONLY_ROUTES = [
  '/get-started',
  '/otp-verification',
  '/create-account',
  '/reset-password',
];

// Role-specific auth pages (login, apply, verify-otp, reset-password).
// Unauthenticated users can always reach these.
// Authenticated users are redirected to their own dashboard.
// IMPORTANT: checked BEFORE the broad /instructor and /admin guards.
const ROLE_AUTH_ROUTES: Record<string, 'instructor' | 'admin'> = {
  '/instructor/login': 'instructor',
  '/instructor/apply': 'instructor',
  '/instructor/verify-otp': 'instructor',
  '/instructor/reset-password': 'instructor',
  '/admin/login': 'admin',
  '/admin/verify-otp': 'admin',
  '/admin/reset-password': 'admin',
};

function getDashboard(role: 'user' | 'instructor' | 'admin'): string {
  if (role === 'admin') return '/admin';
  if (role === 'instructor') return '/instructor';
  return '/student';
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The proxy runs on the edge — it has NO access to localStorage.
  // Zustand persist uses localStorage, so auth-storage is NOT readable here.
  //
  // The only reliable auth signal is the pair of cookies that auth.store.ts
  // explicitly sets via setAuthCookies() on every login:
  //   - accessToken  (cleared on logout)
  //   - userType     (cleared on logout)
  //
  // A valid session requires BOTH. A lone accessToken with no userType (or
  // vice-versa) is treated as unauthenticated to prevent redirect loops from
  // stale / partially-cleared cookies.
  const accessToken = request.cookies.get('accessToken')?.value;
  const userType = request.cookies.get('userType')?.value as
    | 'user'
    | 'instructor'
    | 'admin'
    | undefined;

  const isAuthenticated = !!accessToken && !!userType;
  const role = isAuthenticated ? userType! : null;

  // -- 1. Pure guest-only routes --------------------------------------------
  if (GUEST_ONLY_ROUTES.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(getDashboard(role!), request.url));
    }
    return NextResponse.next();
  }

  // -- 2. Role-specific auth pages ------------------------------------------
  const matchedAuthRoute = Object.keys(ROLE_AUTH_ROUTES).find(route =>
    pathname.startsWith(route)
  );
  if (matchedAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(getDashboard(role!), request.url));
    }
    // Not authenticated — allow through (covers mid-flow states like OTP entry)
    return NextResponse.next();
  }

  // -- 3. Student dashboard -------------------------------------------------
  if (pathname.startsWith('/student')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/get-started', request.url));
    }
    if (role !== 'user') {
      return NextResponse.redirect(new URL(getDashboard(role!), request.url));
    }
    return NextResponse.next();
  }

  // -- 4. Instructor protected pages ----------------------------------------
  // /instructor/login etc. are already handled above in section 2.
  if (pathname.startsWith('/instructor')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/instructor/login', request.url));
    }
    if (role !== 'instructor') {
      return NextResponse.redirect(new URL(getDashboard(role!), request.url));
    }
    return NextResponse.next();
  }

  // -- 5. Admin protected pages ---------------------------------------------
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL(getDashboard(role!), request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
