import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * Edge Proxy & Route Guard for Comfort Trip Car Rentals
 * Built using NextAuth `withAuth` to enforce strict RBAC boundaries.
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    // 1. Guard /admin routes (except /admin/login)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      const role = token?.role;
      const isAdmin = role === 'admin' || role === 'super-admin';

      if (!token) {
        const loginUrl = new URL('/admin/login', req.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (!isAdmin) {
        const unauthorizedUrl = new URL('/Login', req.url);
        unauthorizedUrl.searchParams.set('error', 'AccessDeniedAdminOnly');
        return NextResponse.redirect(unauthorizedUrl);
      }
    }

    // 2. Redirect authenticated users away from Login and Register pages
    if (pathname === '/Login' || pathname === '/Register' || pathname === '/admin/login') {
      if (token) {
        const isAdmin = token.role === 'admin' || token.role === 'super-admin';
        const destination = isAdmin ? '/admin' : '/';
        return NextResponse.redirect(new URL(destination, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public pages and static assets
        if (
          pathname === '/' ||
          pathname.startsWith('/about-us') ||
          pathname.startsWith('/Services') ||
          pathname.startsWith('/Cars') ||
          pathname.startsWith('/Bookings') ||
          pathname.startsWith('/api/auth') ||
          pathname === '/Login' ||
          pathname === '/Register' ||
          pathname === '/admin/login' ||
          pathname.startsWith('/_next') ||
          pathname.includes('.')
        ) {
          return true;
        }

        // Customer private area
        if (pathname.startsWith('/profile') || pathname.startsWith('/my-bookings')) {
          return !!token;
        }

        // Admin area
        if (pathname.startsWith('/admin')) {
          return !!token && (token.role === 'admin' || token.role === 'super-admin');
        }

        return true;
      },
    },
    pages: {
      signIn: '/Login',
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/my-bookings/:path*',
    '/Login',
    '/Register',
  ],
};
