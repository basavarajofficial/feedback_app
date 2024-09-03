
import { NextResponse, NextRequest } from 'next/server'
// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt"

export { default } from "next-auth/middleware"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})
    const url = request.nextUrl;
    if(token && (
        url.pathname.startsWith('/signIn') ||
        url.pathname.startsWith('/signUp') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/')

    )){
        //* once u get the token with above mentioned paths, will redirect tyo dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    //* this will render on very first excution
  return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
//* these pages needs authentication
export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}
