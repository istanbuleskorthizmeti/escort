"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export interface DRKCNAYIntent {
  referrer: string;
  utmSource: string | null;
  utmTerm: string | null;
  utmMedium: string | null;
  entryPage: string;
  timestamp: string;
}

export function useDRKCNAYTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only track on the first entry of the session
    if (typeof window !== "undefined" && !sessionStorage.getItem("DRKCNAY_intent")) {
      const intent: DRKCNAYIntent = {
        referrer: document.referrer || "Doğrudan (Direct)",
        utmSource: searchParams.get("utm_source"),
        utmTerm: searchParams.get("utm_term"),
        utmMedium: searchParams.get("utm_medium"),
        entryPage: window.location.pathname,
        timestamp: new Date().toISOString()
      };

      sessionStorage.setItem("DRKCNAY_intent", JSON.stringify(intent));
    }
  }, [searchParams]);

  return null; // Renderless component
}

export function getDRKCNAYIntent(): DRKCNAYIntent | null {
  if (typeof window !== "undefined") {
    const data = sessionStorage.getItem("DRKCNAY_intent");
    if (data) {
      try {
        return JSON.parse(data) as DRKCNAYIntent;
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}
