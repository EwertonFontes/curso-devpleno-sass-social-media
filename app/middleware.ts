import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl
  const url = request.nextUrl.clone()

  let slug = hostname
  if(hostname.indexOf('.insitedev.com') || hostname.indexOf('.smb-local')) {
    slug = hostname.split('.')[0]
  }
  if(hostname === 'localhost') {
    slug = 'meutenant'
  }


  url.pathname = '/' + slug +  '' + pathname


  
  if (!(pathname.startsWith('/app') || pathname.startsWith('/api'))) {
    return NextResponse.rewrite(url)
  }
 
}