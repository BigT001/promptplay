import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const authSession = request.cookies.get('auth_session')
  
  // Paths that require authentication
  const protectedPaths = ['/dashboard', '/profile']
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
  
  if (isProtectedPath && !authSession) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Prevent authenticated users from accessing auth page
  if (request.nextUrl.pathname === '/auth' && authSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}