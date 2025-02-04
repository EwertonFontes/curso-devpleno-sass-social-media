import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  let slug = hostname.split(':')[0]
  if(hostname.indexOf('.insitedev.com') >= 0 || hostname.indexOf('.smb-local') >= 0) {
    slug = hostname.split('.')[0]
  }
  if(hostname === 'localhost') {
    slug = 'meutenant'
  }



  url.pathname = '/' + slug +  '' + pathname

  if(hostname !== 'localhost:3000') {
     return NextResponse.rewrite(url)
  }
  
  if (!(pathname.startsWith('/app') || pathname.startsWith('/api'))) {
    return NextResponse.rewrite(url)
  }
 
}