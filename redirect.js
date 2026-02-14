export default function handler(req, res) {
  // Get the referrer from the request headers
  const referrer = req.headers.referer || req.headers.referrer || '';
  
  // Configuration
  const SKRO_DOMAIN = 'thenexthaul.com';
  const REAL_LINK = 'https://go.thenexthaul.com/click';
  const FAKE_LINK = 'https://pp4a.adj.st/?adj_t=1us8eizl_1uyfm9on';
  
  // Log for debugging (optional - remove in production)
  console.log('[Redirect API] Referrer:', referrer || 'None');
  
  // Check if referrer contains SKRO domain
  const isFromCloaker = referrer.toLowerCase().includes(SKRO_DOMAIN.toLowerCase());
  
  // Decide where to redirect
  let redirectUrl;
  if (isFromCloaker) {
    redirectUrl = REAL_LINK;
    console.log('[Redirect API] ✅ Legitimate traffic from cloaker → Redirecting to real link');
  } else {
    redirectUrl = FAKE_LINK;
    console.log('[Redirect API] 🔄 Direct/suspicious traffic → Redirecting to fake link');
  }
  
  // Set cache control headers to prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Perform 302 redirect
  res.writeHead(302, {
    Location: redirectUrl
  });
  res.end();
}
