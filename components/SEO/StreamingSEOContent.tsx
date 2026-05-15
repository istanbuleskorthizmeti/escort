
import { Suspense } from 'react';
import { generateGodModeContent } from "@/lib/seo-content";
import { SecureHTML } from "@/components/SecureHTML";

interface StreamingSEOContentProps {
  city: string;
  district?: string;
  neighborhood?: string;
  category?: string;
  host: string;
  cityName: string;
}

async function SEOContentLoader({ city, district, neighborhood, category, host, cityName }: StreamingSEOContentProps) {
  try {
    const aiContent = await generateGodModeContent({ city, district, neighborhood, category, host });
    
    if (!aiContent?.html) return null;

    return (
      <article className="relative glass-card p-16 md:p-24 rounded-[5rem] overflow-hidden group border-rose-600/10 hover:border-rose-600/30 transition-all duration-1000">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="text-[11px] font-black uppercase tracking-[0.6em] text-zinc-800 mb-16 border-b border-zinc-900/50 pb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="italic">DRKCNAY ELITE SUMMARY // {cityName.toUpperCase()} ANALYSIS</span>
          <span className="text-rose-600 bg-rose-600/10 px-4 py-1.5 rounded-full border border-rose-600/20">VERIFIED DATA v16.0</span>
        </div>
        
        <div className="prose prose-invert max-w-none prose-p:text-zinc-500 prose-p:leading-relaxed prose-p:italic prose-p:text-2xl prose-strong:text-rose-600 prose-headings:text-white prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter">
          <SecureHTML html={aiContent.html} />
        </div>
      </article>
    );
  } catch (error) {
    console.error("❌ Streaming SEO Content Failed:", error);
    return null;
  }
}

export function StreamingSEOContent(props: StreamingSEOContentProps) {
  return (
    <div className="max-w-7xl mx-auto mb-40 px-6 min-h-[400px]">
      <Suspense fallback={
        <div className="glass-card p-24 rounded-[5rem] animate-pulse flex flex-col gap-8">
          <div className="h-4 w-1/3 bg-zinc-900 rounded-full" />
          <div className="h-12 w-full bg-zinc-900 rounded-2xl" />
          <div className="h-64 w-full bg-zinc-900/50 rounded-3xl" />
          <div className="space-y-4">
             <div className="h-4 w-full bg-zinc-900 rounded-full" />
             <div className="h-4 w-5/6 bg-zinc-900 rounded-full" />
             <div className="h-4 w-4/6 bg-zinc-900 rounded-full" />
          </div>
        </div>
      }>
        <SEOContentLoader {...props} />
      </Suspense>
    </div>
  );
}
