'use client';

import dynamic from "next/dynamic";

// Dynamic Imports with SSR disabled for optimal LCP and main-thread health
const DRKCNAYActionHub = dynamic(() => import("@/components/UI/DRKCNAYActionHub").then(m => m.DRKCNAYActionHub), { ssr: false });
const FOMONotifier = dynamic(() => import("@/components/UI/FOMONotifier").then(m => m.FOMONotifier), { ssr: false });
const LocalDiscovery = dynamic(() => import("@/components/Layout/LocalDiscovery").then(m => m.LocalDiscovery), { ssr: false });
const CSAMFooter = dynamic(() => import("@/components/Core/CSAMFooter"), { ssr: false });
const CookieConsent = dynamic(() => import("@/components/Core/CookieConsent"), { ssr: false });

/**
 * DynamicPerformanceWrapper
 * Encapsulates all non-critical, client-side floating components to prevent
 * main thread blockage during initial page hydration.
 */
export function DynamicPerformanceWrapper() {
  return (
    <>
      <DRKCNAYActionHub />
      <FOMONotifier />
      <LocalDiscovery />
      <CSAMFooter />
      <CookieConsent />
    </>
  );
}
