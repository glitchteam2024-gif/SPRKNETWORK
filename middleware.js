export const config = {
  matcher: '/:path*',
};

export default function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  
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
  
  const isMobile = mobilePatterns.some(pattern => pattern.test(userAgent));
  
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
  
  return;
}
