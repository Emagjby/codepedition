import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - Static files (_next/static)
     * - Image optimization files (_next/image)
     * - Favicon and other media files
     * - Public routes that don't need authentication
     * - API routes that handle their own authentication
     * - Root path (landing page)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/public|public|landing|$|pricing|about|contact|invited|terms|privacy|cookies|auth/*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}