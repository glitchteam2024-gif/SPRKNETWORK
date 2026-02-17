export default function handler(req, res) {
  const referrer = req.headers.referer || req.headers.referrer || '';
  const SKRO_DOMAIN = 'thenexthaul.com';
  const REAL_LINK = 'https://go.thenexthaul.com/click';
  const FAKE_LINK = 'https://pp4a.adj.st/?adj_t=1us8eizl_1uyfm9on';
  
  console.log('[Redirect API] Referrer:', referrer || 'None' );
  
  const isFromCloaker = referrer.toLowerCase().includes(SKRO_DOMAIN.toLowerCase());
  let redirectUrl = isFromCloaker ? REAL_LINK : FAKE_LINK;
  
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('X-Timestamp', Date.now().toString());
  
  res.status(302);
  res.setHeader('Location', redirectUrl);
  res.end();
}
