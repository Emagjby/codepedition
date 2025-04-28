import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all paths that need authentication checking or redirection
     */
    '/dashboard',
    '/dashboard/:path*',
    '/profile/:path*',
    '/account/:path*',
    '/courses/:path*',
    '/settings/:path*',
    '/auth/login',
    '/auth/register',
    '/auth/confirm',
    '/auth/verified'
  ],
}