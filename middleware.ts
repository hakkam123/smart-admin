// import { clerkMiddleware } from '@clerk/nextjs/server';

// export default clerkMiddleware();

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Tentukan route yang perlu proteksi
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/api/private(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const res = NextResponse.next()

  // ✅ Tambahkan header CORS untuk semua endpoint API
  if (req.nextUrl.pathname.startsWith('/api')) {
    res.headers.set('Access-Control-Allow-Origin', '*')
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  // ✅ Proteksi route tertentu (gunakan await)
  if (isProtectedRoute(req)) {
    const session = await auth()
    if (!session.userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
  }

  return res
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
