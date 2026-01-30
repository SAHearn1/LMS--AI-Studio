import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/courses/new',
  '/lessons/new',
  '/lessons/generate',
  '/assignments',
  '/progress',
  '/students',
  '/admin',
  '/teacher',
  '/student',
  '/parent',
]

// Routes that are only for unauthenticated users
const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password']

// Role-based route access
const roleRoutes: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/teacher': ['ADMIN', 'TEACHER'],
  '/student': ['STUDENT'],
  '/parent': ['PARENT'],
  '/courses/new': ['ADMIN', 'TEACHER'],
  '/lessons/new': ['ADMIN', 'TEACHER'],
  '/lessons/generate': ['ADMIN', 'TEACHER'],
}

// Default redirect after login based on role
const roleRedirects: Record<string, string> = {
  ADMIN: '/admin',
  TEACHER: '/teacher',
  STUDENT: '/student',
  PARENT: '/parent',
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = !!token
  const userRole = token?.role as string | undefined

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Check if current path is auth-only (login, signup, etc.)
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    const redirectUrl = userRole ? roleRedirects[userRole] || '/dashboard' : '/dashboard'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  if (isAuthenticated && userRole) {
    for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
      if (pathname === route || pathname.startsWith(route + '/')) {
        if (!allowedRoles.includes(userRole)) {
          // Redirect to appropriate dashboard
          const redirectUrl = roleRedirects[userRole] || '/dashboard'
          return NextResponse.redirect(new URL(redirectUrl, request.url))
        }
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
