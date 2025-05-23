
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const adminSessionCookie = request.cookies.get('admin-session');
  const { pathname } = request.nextUrl;

  // If trying to access /admin/login
  if (pathname.startsWith('/admin/login')) {
    if (adminSessionCookie?.value === 'true') {
      // User is logged in, redirect to admin dashboard
      // Or to redirectTo if it's an admin page and they somehow landed on login
      const redirectTo = request.nextUrl.searchParams.get('redirectTo');
      if (redirectTo && redirectTo.startsWith('/admin/')) {
        return NextResponse.redirect(new URL(redirectTo, request.url));
      }
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    // User is not logged in, allow access to login page
    return NextResponse.next();
  }

  // For any other /admin/* route
  if (pathname.startsWith('/admin/')) {
    if (!adminSessionCookie || adminSessionCookie.value !== 'true') {
      // User is not logged in, redirect to login page, passing current path as redirectTo
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // User is logged in, allow access
    return NextResponse.next();
  }

  // For all other routes, do nothing
  return NextResponse.next();
}

export const config = {
  // Matcher for all routes under /admin/ and the /admin/login page itself
  matcher: ['/admin/:path*', '/admin/login'],
};
