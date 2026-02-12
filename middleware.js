/**
 * Ultimate Desktop Blocker - Vercel Edge Middleware
 * 
 * This middleware:
 * 1. Blocks all desktop traffic completely
 * 2. Prevents caching with aggressive headers
 * 3. Returns empty response so no HTML is visible
 * 4. Only allows genuine mobile devices through
 * 
 * Place this file at the root of your repository.
 */

export const config = {
  matcher: '/:path*', // Apply to all routes
};

export default function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check if it's mobile traffic
  const isMobile = detectMobile(userAgent);
  
  if (!isMobile) {
    // Block desktop traffic with empty response and aggressive cache prevention
    return new Response('<!DOCTYPE html><html><head><title></title></head><body></body></html>', {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'X-Blocked-Reason': 'Desktop-Traffic-Blocked',
      },
    });
  }
  
  // Allow mobile traffic to proceed normally
  return;
}

/**
 * Detect if traffic is from a mobile device
 * @param {string} userAgent - The User-Agent header string
 * @returns {boolean} - True if mobile device detected
 */
function detectMobile(userAgent) {
  // Mobile device patterns
  const mobilePatterns = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /Mobile/i,
    /IEMobile/i,
    /Opera Mini/i,
  ];
  
  // Check if User-Agent matches any mobile pattern
  return mobilePatterns.some(pattern => pattern.test(userAgent));
}
