import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_SUBDOMAINS = new Set(['www', 'doksy']) // add any you want to ignore

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const host = req.headers.get('host') || ''
  const isAsset = url.pathname.startsWith('/_next') || url.pathname.startsWith('/api') || url.pathname === '/favicon.ico'

  if (isAsset) return NextResponse.next()

  // Only act on *.doksy.site
  if (!host.endsWith('.doksy.site')) return NextResponse.next()

  const sub = host.slice(0, -'.doksy.site'.length).split('.')[0] // first label
  if (!sub || PUBLIC_SUBDOMAINS.has(sub)) return NextResponse.next()

  // 1) If hitting the root, send to /docs
  if (url.pathname === '/') {
    const to = url.clone()
    to.pathname = '/docs'
    return NextResponse.rewrite(to)
  }

  // 2) When user visits /docs or any nested doc path, inject the project slug from subdomain
  if (url.pathname.startsWith('/docs')) {
    const to = url.clone()
    // /docs            -> /docs/{sub}
    // /docs/intro      -> /docs/{sub}/intro
    to.pathname = url.pathname.replace(/^\/docs/, `/docs/${sub}`)
    return NextResponse.rewrite(to)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}