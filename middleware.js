export const config = {
  matcher: '/:path*',
};

export default function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Detect mobile devices
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Block all non-mobile traffic
  if (!isMobile) {
    return new Response('', {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Blocked-Reason': 'Desktop-Traffic-Not-Allowed',
      },
    });
  }
  
  // Allow mobile traffic through
  return;
}
