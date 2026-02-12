/**
 * Chrome DevTools Device Emulation Blocker
 * 
 * This script detects if someone is using Chrome DevTools device emulation
 * (Inspect Element > Mobile Mode) and blocks access.
 * 
 * Works on Windows, Mac, and Linux.
 * 
 * Add to your HTML: <script src="/devtools-blocker.js"></script>
 */

(function() {
  'use strict';
  
  /**
   * Detect if Chrome DevTools device emulation is active
   */
  function isDevToolsEmulation() {
    // Detection Method 1: Desktop screen size but mobile User-Agent
    // Real mobile devices have small screens (< 1024px width)
    // DevTools emulation runs on desktop screens (> 1024px)
    if (screen.width > 1024 || screen.height > 1024) {
      // Large screen detected
      if (/Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // But User-Agent claims to be mobile = DevTools emulation
        return true;
      }
    }
    
    // Detection Method 2: Desktop platform but mobile User-Agent
    // navigator.platform shows the real OS (can't be spoofed easily)
    const platform = navigator.platform || '';
    const isDesktopPlatform = /Win|Mac|Linux/i.test(platform);
    const isMobileUA = /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isDesktopPlatform && isMobileUA) {
      // Desktop platform but mobile User-Agent = DevTools emulation
      return true;
    }
    
    // Detection Method 3: Check for suspicious screen properties
    // Real mobile devices have devicePixelRatio between 1-4
    // But screen.width should still be small
    if (window.devicePixelRatio && window.devicePixelRatio > 1) {
      if (screen.width > 1024 && /Mobile/i.test(navigator.userAgent)) {
        return true;
      }
    }
    
    // Detection Method 4: Check if running in desktop browser with mobile UA
    // Real mobile browsers don't have certain desktop-only features
    if (screen.availWidth > 1024 || screen.availHeight > 1024) {
      if (/Mobile|Android|iPhone/i.test(navigator.userAgent)) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Block access to the page
   */
  function blockAccess() {
    // Clear all page content
    document.open();
    document.write('');
    document.close();
    
    // Stop all script execution
    if (window.stop) {
      window.stop();
    }
  }
  
  /**
   * Run detection immediately
   */
  function runDetection() {
    if (isDevToolsEmulation()) {
      blockAccess();
    }
  }
  
  // Run detection as early as possible
  runDetection();
  
  // Also run on DOM ready in case script loads late
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDetection);
  }
  
  // Monitor for orientation changes (when DevTools is toggled)
  window.addEventListener('orientationchange', function() {
    setTimeout(runDetection, 100);
  });
  
  // Monitor for resize events (when DevTools device size is changed)
  window.addEventListener('resize', function() {
    setTimeout(runDetection, 100);
  });
  
})();
