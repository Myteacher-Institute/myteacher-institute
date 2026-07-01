import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Guest-only routes - accessible only when NOT authenticated
const GUEST_ROUTES = ['/get-started', '/otp-verification', '/create-account', '/instructor/login', '/instructor/apply', '/instructor/verify-otp', '/admin/login', '/admin/verify-otp', '/reset-password', '/admin/reset-password', '/instructor/reset-password'];

// Protected routes - require authentication
const PROTECTED_ROUTES = [
  '/student',
  '/instructor',
  '/admin',
  '/onboarding',
  '/profile',
  '/settings',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const userType = request.cookies.get('userType')?.value;

  const isAuthenticated = !!accessToken;

  // Check if current path is a guest-only route
  const isGuestRoute = GUEST_ROUTES.some(route => pathname.startsWith(route));

  // If it's a guest route, allow access (don't check protected routes)
  if (isGuestRoute) {
    // Redirect authenticated users away from guest routes (except if they're trying to access instructor login as an instructor)
    if (isAuthenticated) {
      // Allow authenticated instructors to access instructor login page
      if (pathname === '/instructor/login' && userType === 'instructor') {
        return NextResponse.next();
      }
      
      let redirectPath = '/student';
      
      if (userType === 'admin') {
        redirectPath = '/admin';
      } else if (userType === 'instructor') {
        redirectPath = '/instructor';
      }
      
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    
    // Allow unauthenticated users to access guest routes
    return NextResponse.next();
  }

  // Check if current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/get-started', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
