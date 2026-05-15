"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site";

/**
 * 🕵️‍♂️ HYDRA INTELLIGENCE TRACKER (CLIENT-SIDE GHOST MODE)
 * Intercepts WhatsApp clicks and reports active user sessions to Telegram.
 */
export function WhatsAppIntelligence() {
  useEffect(() => {
    // 1. Report Page View (Optional but useful for "VIP Elite" visibility)
    const reportSession = async () => {
      try {
        await fetch("/api/track-redirect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            domain: window.location.hostname,
            slug: window.location.pathname,
            title: document.title,
            type: "SESSION_START"
          }),
        });
      } catch (e) {
        // Silent fail to avoid affecting UX
      }
    };

    // Only report session once per page load
    reportSession();

    // 2. Global Click Interceptor for WhatsApp
    const handleGlobalClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href") || "";
        const isWhatsApp = href.includes("wa.me") || 
                           href.includes("whatsapp") || 
                           href.includes("bit.ly");

        if (isWhatsApp) {
          try {
            // Signal intelligence hub before navigation
            await fetch("/api/track-redirect", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                domain: window.location.hostname,
                slug: window.location.pathname,
                title: "WhatsApp Button Clicked",
                type: "LEAD_CLICK"
              }),
              keepalive: true, // Critical: ensures request finishes even if page unloads
            });
          } catch (err) {
            // No-op
          }
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  return null; // Invisible component
}
