import { NextRequest,NextResponse } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token=await getToken({req:request});//always use curly brackets { } while specifying its datatype
    const url=request.nextUrl;
    // if(token && (
    //   Url.pathname.startsWith('/sign-in') ||  
    //   Url.pathname.startsWith('/') ||  
    //   Url.pathname.startsWith('/verify') ||  
    //   Url.pathname.startsWith('/sign-up') 
    // )){
    //     return NextResponse.redirect(new URL('/dashboard', request.url))
    // }// If no token, redirect to home
    // if (!token) {
    //     return NextResponse.redirect(new URL('/', request.url));
    // }

        // If the user is authenticated and trying to access auth pages, redirect to dashboard
    if (token) {
        if (url.pathname === '/sign-in' || url.pathname === '/sign-up' || url.pathname === '/verify') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } else {
        // If the user is not authenticated and tries to access protected routes, redirect to sign-in
        if (url.pathname.startsWith('/verify')) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    }

    // // Allow access if token exists and path is not restricted
    return NextResponse.next();
}
 
// See "Matching Paths" below to learn more --> pages where middleware functions should run
export const config = {
  matcher: [
    '/',
    '/sign-up',
    '/sign-in',
    '/verify',
    '/dashboard'
    ]
}