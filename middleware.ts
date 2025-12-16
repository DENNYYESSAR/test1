import { NextRequest, NextResponse } from 'next/server';

// Middleware disabled - app uses Firebase authentication with client-side checks
// The Supabase middleware was causing redirect issues for Firebase-authenticated users

export async function middleware(request: NextRequest) {
  // Simply pass through - auth is handled client-side via AuthContext
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
  ],
};
