/**
 * TikTok-Only Traffic Filter - Vercel Edge Middleware
 * 
 * This middleware ONLY allows traffic from TikTok's in-app browser.
 * All other traffic (mobile browsers, desktop, Instagram, etc.) is blocked with 304.
 * 
 * Place this file at the root of your repository.
 */

export const config = {
  matcher: '/:path*', // Apply to all routes
};

export default function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check if traffic is from TikTok in-app browser
  const isTikTok = detectTikTok(userAgent);
  
  if (isTikTok) {
    // Allow TikTok traffic to proceed
    return;
  }
  
  // Block all non-TikTok traffic with 304 response
  return new Response(null, {
    status: 304,
    statusText: 'Not Modified',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Blocked-Reason': 'Non-TikTok-Traffic',
      'X-User-Agent': userAgent, // Debug header
    },
  });
}

/**
 * Detect if traffic is from TikTok in-app browser
 * @param {string} userAgent - The User-Agent header string
 * @returns {boolean} - True if TikTok detected
 */
function detectTikTok(userAgent) {
  // Primary TikTok identifiers
  const tiktokPatterns = [
    /trill_/i,              // TikTok app identifier (e.g., trill_430104)
    /musical_ly_/i,         // TikTok app identifier (musical.ly was original name)
    /AppName\/trill/i,      // Explicit TikTok app name
    /AppName\/musical_ly/i, // Explicit TikTok app name
    /ByteLocale\//i,        // ByteDance locale identifier
    /\bTikTok\b/i,          // Direct TikTok mention (iOS)
  ];
  
  // Check if User-Agent matches any TikTok pattern
  return tiktokPatterns.some(pattern => pattern.test(userAgent));
}
