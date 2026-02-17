import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Get the referrer from request headers
  const referrer = req.headers.referer || req.headers.referrer || '';
  
  // Configuration
  const ALLOWED_DOMAIN = 'thenexthaul.com';
  const BLOCK_URL = 'https://www.google.com';
  
  // Get the requested page from query parameter
  const pageName = req.query.page || '';
  
  // Log for debugging
  console.log('[Page Protection] Page:', pageName);
  console.log('[Page Protection] Referrer:', referrer || 'NONE');
  
  // Check if referrer contains allowed domain
  const isFromCloaker = referrer.toLowerCase().includes(ALLOWED_DOMAIN.toLowerCase());
  
  if (!isFromCloaker) {
    // Block access - redirect to Google
    console.log('[Page Protection] 🚫 BLOCKED - Redirecting to Google');
    
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.status(302);
    res.setHeader('Location', BLOCK_URL);
    res.end();
    return;
  }
  
  // Allow access - serve the HTML file
  console.log('[Page Protection] ✅ ALLOWED - Serving page');
  
  try {
    // Read the HTML file
    const htmlPath = path.join(process.cwd(), `${pageName}.html`);
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Serve the HTML with cache prevention
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200);
    res.send(htmlContent);
  } catch (error) {
    console.error('[Page Protection] Error reading file:', error);
    res.status(404).send('Page not found');
  }
}
