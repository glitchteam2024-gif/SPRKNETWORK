/**
 * Ultimate DevTools Blocker with Cache Clearing
 * 
 * This script:
 * 1. Detects Chrome DevTools mobile emulation
 * 2. Clears all cached content
 * 3. Blocks access immediately
 * 4. Prevents any HTML from being visible
 * 
 * Add to your HTML: <script src="/devtools-blocker.js"></script>
 * OR copy the inline version into your <head> tag
 */

(function() {
  'use strict';
  
  /**
   * Clear all browser caches
   */
  function clearAllCaches() {
    try {
      // Clear localStorage
      if (window.localStorage) {
        window.localStorage.clear();
      }
      
      // Clear sessionStorage
      if (window.sessionStorage) {
        window.sessionStorage.clear();
      }
      
      // Clear cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Clear Cache API if available
      if ('caches' in window) {
        caches.keys().then(function(names) {
          names.forEach(function(name) {
            caches.delete(name);
          });
        });
      }
    } catch (e) {
      // Silently fail if clearing fails
    }
  }
  
  /**
   * Detect if Chrome DevTools device emulation is active
   */
  function isDevToolsEmulation() {
    // Method 1: Desktop screen size but mobile User-Agent
    if (screen.width > 1024 || screen.height > 1024) {
      if (/Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return true;
      }
    }
    
    // Method 2: Desktop platform but mobile User-Agent
    var platform = navigator.platform || '';
    var isDesktopPlatform = /Win|Mac|Linux/i.test(platform);
    var isMobileUA = /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isDesktopPlatform && isMobileUA) {
      return true;
    }
    
    // Method 3: Check screen properties
    if (window.devicePixelRatio && window.devicePixelRatio > 1) {
      if (screen.width > 1024 && /Mobile/i.test(navigator.userAgent)) {
        return true;
      }
    }
    
    // Method 4: Available screen size check
    if (screen.availWidth > 1024 || screen.availHeight > 1024) {
      if (/Mobile|Android|iPhone/i.test(navigator.userAgent)) {
        return true;
      }
    }
    
    // Method 5: Check for desktop-only properties
    // Real mobile devices don't have these screen dimensions
    if ((screen.width >= 1280 || screen.height >= 1280) && /Mobile/i.test(navigator.userAgent)) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Block access completely
   */
  function blockAccess() {
    // Clear all caches first
    clearAllCaches();
    
    // Remove all page content
    if (document.body) {
      document.body.innerHTML = '';
      document.body.style.display = 'none';
    }
    
    if (document.head) {
      document.head.innerHTML = '<title></title>';
    }
    
    // Clear the entire document
    document.open();
    document.write('<!DOCTYPE html><html><head><title></title></head><body></body></html>');
    document.close();
    
    // Stop all script execution
    if (window.stop) {
      window.stop();
    }
    
    // Prevent any further loading
    window.addEventListener('DOMContentLoaded', function(e) {
      e.stopImmediatePropagation();
    }, true);
    
    window.addEventListener('load', function(e) {
      e.stopImmediatePropagation();
    }, true);
  }
  
  /**
   * Run detection
   */
  function runDetection() {
    if (isDevToolsEmulation()) {
      blockAccess();
      return true;
    }
    return false;
  }
  
  // Run detection immediately (before anything loads)
  if (runDetection()) {
    return; // Already blocked, stop execution
  }
  
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDetection);
  }
  
  // Monitor for DevTools toggling
  window.addEventListener('orientationchange', function() {
    setTimeout(runDetection, 50);
  });
  
  window.addEventListener('resize', function() {
    setTimeout(runDetection, 50);
  });
  
  // Continuous monitoring (check every 500ms)
  setInterval(runDetection, 500);
  
})();
