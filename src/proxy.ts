import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Only protect the specific routes we want to restrict to verified users
  const protectedRoutes = ['/trips/new', '/dashboard', '/dashboard/host', '/trips']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  
  if (isProtectedRoute) {
    // Check if the auth cookie exists. Supabase auth uses sb-[project_id]-auth-token
    const hasAuthCookie = request.cookies.getAll().some(cookie => cookie.name.includes('-auth-token'))
    
    if (!hasAuthCookie) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
