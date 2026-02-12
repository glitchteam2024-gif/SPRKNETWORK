/**
 * Desktop Blocker - Vercel Edge Middleware (FIXED)
 * 
 * This middleware completely blocks desktop traffic by returning
 * an empty HTML response instead of 304, preventing any content from loading.
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
    // Block desktop traffic with empty HTML response
    return new Response('', {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Blocked-Reason': 'Desktop-Traffic-Blocked',
      },
    });
  }
  
  // Allow mobile traffic to proceed
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
