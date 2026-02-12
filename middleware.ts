/**
 * Vercel Edge Middleware - Traffic Detection and Blocking (TypeScript)
 * 
 * This middleware detects and blocks emulator and desktop traffic
 * by analyzing User-Agent headers and returning 304 responses.
 * 
 * Place this file at the root of your repository.
 */

import type { NextRequest } from 'next/server';

export const config = {
  matcher: '/:path*', // Apply to all routes
};

export default function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Detect emulator traffic
  const isEmulator = detectEmulator(userAgent);
  
  // Detect desktop traffic
  const isDesktop = detectDesktop(userAgent);
  
  // Block emulator and desktop traffic with 304 response
  if (isEmulator || isDesktop) {
    return new Response(null, {
      status: 304,
      statusText: 'Not Modified',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Blocked-Reason': isEmulator ? 'Emulator-Detected' : 'Desktop-Detected',
      },
    });
  }
  
  // Allow mobile traffic to proceed
  return;
}

/**
 * Detect if the traffic is coming from an emulator
 * @param userAgent - The User-Agent header string
 * @returns True if emulator detected
 */
function detectEmulator(userAgent: string): boolean {
  const emulatorPatterns = [
    // Android Emulators
    /Android.*Build\/.*Emulator/i,
    /Android.*Build\/.*SDK/i,
    /Android.*Build\/.*Simulator/i,
    /Android.*generic/i,
    /Android.*Genymotion/i,
    /Android.*BlueStacks/i,
    /Android.*NoxPlayer/i,
    /Android.*MEmu/i,
    /Android.*LDPlayer/i,
    
    // iOS Simulators
    /iPhone.*Simulator/i,
    /iPad.*Simulator/i,
    /iPod.*Simulator/i,
    
    // Generic emulator indicators
    /\bEmulator\b/i,
    /\bSimulator\b/i,
    /\bVirtual\b/i,
    
    // Chrome DevTools mobile emulation (harder to detect, but some patterns)
    // Note: This is difficult as DevTools mimics real devices closely
    
    // Android x86 (often used in emulators)
    /Android.*x86/i,
    /Android.*i686/i,
  ];
  
  return emulatorPatterns.some(pattern => pattern.test(userAgent));
}

/**
 * Detect if the traffic is coming from a desktop browser
 * @param userAgent - The User-Agent header string
 * @returns True if desktop detected
 */
function detectDesktop(userAgent: string): boolean {
  // Check for desktop operating systems
  const desktopOS = [
    /Windows NT/i,
    /Macintosh/i,
    /Mac OS X/i,
    /Linux/i,
    /X11/i,
    /CrOS/i, // Chrome OS
  ];
  
  // Check for mobile indicators (to exclude from desktop detection)
  const mobileIndicators = [
    /Mobile/i,
    /Android/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /webOS/i,
    /IEMobile/i,
    /Opera Mini/i,
  ];
  
  // If it has desktop OS but no mobile indicators, it's desktop
  const hasDesktopOS = desktopOS.some(pattern => pattern.test(userAgent));
  const hasMobileIndicator = mobileIndicators.some(pattern => pattern.test(userAgent));
  
  return hasDesktopOS && !hasMobileIndicator;
}
