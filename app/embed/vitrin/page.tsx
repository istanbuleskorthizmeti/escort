import { headers } from "next/headers";
import { siteConfig } from "@/config/site";
import { getDomainConfig } from "@/config/domains";
import { DorukVitrin } from "@/components/SEO/DorukVitrin";
import { ShieldCheck } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "VIP Escort Vitrini (Embed)",
    robots: "noindex, nofollow", // Prevent direct indexing of the embed page
  };
}

export default async function EmbedVitrinPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; limit?: string }>;
}) {
  const host = (await headers()).get("host") || siteConfig.domain;
  const domainConfig = getDomainConfig(host);
  const resolvedParams = await searchParams;
  
  const district = resolvedParams.city 
    ? resolvedParams.city 
    : (domainConfig?.targetDistrict || "İSTANBUL");
  
  // Custom layout for iframe embedding:
  // Zero padding, pure transparent background, seamless for Google Sites
  return (
    <div className="w-full min-h-screen bg-transparent m-0 p-0">
      <DorukVitrin city={district} isEmbed={true} host={host} />
    </div>
  );
}
