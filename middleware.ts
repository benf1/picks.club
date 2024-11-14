// middleware.ts (or middleware.js)
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the origin from the request
  const origin = request.headers.get('origin') || '';
  
  // Allow requests from Figma and local development
  if (origin.includes('figma.com') || origin.includes('localhost')) {
    const response = NextResponse.next();
    
    // Add the CORS headers
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  }
  
  // Block requests from other origins
  return new NextResponse(null, { status: 403 });
}

export const config = {
  matcher: '/api/:path*',
};
