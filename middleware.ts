
export const config = {
  matcher: '/:path*', // Apply to all routes
};

export default function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check if it's mobile traffic
  const isMobile = detectMobile(userAgent);
  
  if (!isMobile) {
    // Definitely desktop - block immediately
    return new Response(null, {
      status: 304,
      statusText: 'Not Modified',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Blocked-Reason': 'Desktop-Traffic-Blocked',
      },
    });
  }
  
  // It claims to be mobile, but we need client-side check for DevTools emulation
  // The client-side script will handle DevTools detection
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
