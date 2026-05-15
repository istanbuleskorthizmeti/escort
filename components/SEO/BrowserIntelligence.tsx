
"use client";

import { useEffect } from 'react';
import { siteConfig } from '@/config/site';

/**
 * 🧛‍♂️ DRKCNAY BROWSER INTELLIGENCE (v1.0)
 * Handles high-intent cookie tracking, user behavior synchronization, and conversion triggers.
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

    // 🛡️ 2. CONVERSION PIXEL (PSEUDO)
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
      window.addEventListener('mousemove', moveHandler);
    };

    // 🛡️ 4. CROSS-DOMAIN WARMUP (PRE-FETCHING)
    const warmupSatellites = () => {
      // Pre-connect to our central CDN
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = siteConfig.cdnUrl;
      document.head.appendChild(link);
    };

    trackIntent();
    checkConversion();
    validateHuman();
    warmupSatellites();

  }, []);

  return null; // Hidden component
}
