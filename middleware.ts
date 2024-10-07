import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/signIn', '/signUp', '/', '/verify/:path*', '/dashboard/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  console.log("token: ", token);

  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith('/signIn') ||
      url.pathname.startsWith('/signUp') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.rewrite(new URL('/dashboard', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/signIn', request.url));
  }

  return NextResponse.next();
}
