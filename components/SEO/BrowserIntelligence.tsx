"use client";

import { useEffect } from 'react';
import { siteConfig } from '@/config/site';

/**
 * 🧛‍♂️ DRKCNAY BROWSER INTELLIGENCE (v2.0)
 * Handles high-intent cookie tracking, user behavior synchronization, passive scroll telemetry,
 * and dynamic conversion UI triggers with full memory leak safety.
 */
export function BrowserIntelligence() {
  useEffect(() => {
    // 🛡️ 1. USER INTENT FINGERPRINTING
    const trackIntent = () => {
      const visitCount = parseInt(localStorage.getItem('drkcnay_visits') || '0');
      localStorage.setItem('drkcnay_visits', (visitCount + 1).toString());
      
      // Set a persistent high-intent cookie if it's a return visitor
      if (visitCount > 0) {
        document.cookie = "drkcnay_intent=high; path=/; max-age=31536000; SameSite=Lax";
      }
    };

    // 🛡️ 2. CONVERSION PIXEL
    // Tracks if user has clicked WhatsApp on any of our domains
    const checkConversion = () => {
      const hasConverted = document.cookie.includes('drkcnay_converted=true');
      if (hasConverted) {
        // Apply "VIP Mode" UI adjustments globally
        document.documentElement.classList.add('drkcnay-vip-user');
      }
    };

    // 🛡️ 3. ANTI-BOT / HUMAN VALIDATION
    const validateHuman = () => {
      const moveHandler = () => {
        document.cookie = "drkcnay_human=true; path=/; max-age=86400; SameSite=Lax";
        window.removeEventListener('mousemove', moveHandler);
      };
      window.addEventListener('mousemove', moveHandler, { passive: true });
      return moveHandler;
    };

    // 🛡️ 4. PASSIVE SCROLL TELEMETRY (JANK-FREE)
    let scrollLogged = false;
    const handleScroll = () => {
      if (scrollLogged) return;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollPercent = (window.scrollY / scrollHeight) * 100;

      // When user scrolls past 30%, register engaged session & trigger conversion visibility
      if (scrollPercent >= 30) {
        document.cookie = "drkcnay_engaged=true; path=/; max-age=3600; SameSite=Lax";
        const stickyCta = document.getElementById("sticky-conversion-trigger");
        if (stickyCta) {
          stickyCta.classList.add("visible");
        }
        scrollLogged = true;
      }
    };

    // 🛡️ 5. CROSS-DOMAIN WARMUP (PRE-FETCHING)
    const warmupSatellites = () => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = siteConfig.cdnUrl;
      document.head.appendChild(link);
    };

    // 🛡️ 6. COMPETITOR DE-SHIELD & ANTI-COPY ARMOR
    const preventInspection = (e: MouseEvent) => {
      e.preventDefault();
    };

    const preventCopy = (e: Event) => {
      e.preventDefault();
    };

    const preventKeys = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's' || e.key === 'A' || e.key === 'a'))
      ) {
        e.preventDefault();
      }
    };

    trackIntent();
    checkConversion();
    const moveHandler = validateHuman();
    warmupSatellites();

    // Register passive event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Register security armor listeners
    document.addEventListener('contextmenu', preventInspection);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('selectstart', preventCopy);
    window.addEventListener('keydown', preventKeys);

    // Cleanup functions to prevent memory leaks
    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('contextmenu', preventInspection);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('selectstart', preventCopy);
      window.removeEventListener('keydown', preventKeys);
    };
  }, []);

  return null; // Hidden component
}
