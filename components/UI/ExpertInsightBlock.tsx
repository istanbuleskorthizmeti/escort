import { experts } from "@/lib/experts";
import { getStitchedContent } from "@/lib/obsidian-fragments";
import Link from "next/link";

function cyrb128(str: string) {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h2 >>> 19), 2716044179);
  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
}

const highTrafficNodes = [
  "besiktas", "sisli", "kadikoy", "beyoglu", "atasehir", "bakirkoy", "sariyer",
  "cankaya", "konak", "karsiyaka", "muratpasa", "lara", "nilufer"
];

interface ExpertInsightBlockProps {
  location: string;
  district?: string;
  city?: string;
}

export function ExpertInsightBlock({ location, district, city }: ExpertInsightBlockProps) {
  const seed = cyrb128(location.toLowerCase());
  const expertIndex = seed % experts.length;
  const expert = experts[expertIndex];
  
  const isHighTraffic = highTrafficNodes.includes(district?.toLowerCase() || "") || 
                        highTrafficNodes.includes(location.toLowerCase());
                        
  const wordCount = isHighTraffic ? 3100 : 800; // Aiming for 3000+ for high traffic
  const content = getStitchedContent(seed, wordCount);
  
  const schemaData = expert.schemaType === "Physician" ? {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": expert.name,
    "jobTitle": expert.title,
    "description": expert.bio,
    "image": `https://vipescorthizmeti.com${expert.image}`,
    "medicalSpecialty": expert.specialty,
    "knowsAbout": ["Sexual Health", "Bio-hacking", "Performance Optimization"]
  } : {
    "@context": "https://schema.org",
    "@type": "HealthSpecialist",
    "name": expert.name,
    "jobTitle": expert.title,
    "description": expert.bio,
    "image": `https://vipescorthizmeti.com${expert.image}`,
    "knowsAbout": ["Psychosexology", "Relationship Dynamics", "Intimacy Alchemy"]
  };

  return (
    <section className="my-32 relative group">
      {/* JSON-LD for Search Engine Authority */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="absolute -inset-1 bg-linear-to-r from-rose-600/20 to-rose-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>
      
      <div className="bg-black/80 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <header className="flex flex-col md:flex-row gap-12 items-start md:items-center mb-16 border-b border-zinc-900 pb-12">
          <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-4xl border-2 border-rose-600/30 bg-zinc-950 flex items-center justify-center text-rose-600 text-6xl font-serif italic overflow-hidden shadow-glow">
            {expert.name[0]}
          </div>

          <div className="flex-1 space-y-6">
            <div className="inline-block bg-rose-600/10 text-rose-600 text-[10px] font-black tracking-[0.4em] uppercase px-6 py-2 rounded-full border border-rose-600/20">
              ABSOLUTE AUTHORITY // {location.toUpperCase()} PROTOCOL
            </div>
            
            <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white font-serif leading-[0.8]">
              {expert.name} <br />
              <span className="text-rose-600">IN-DEPTH INSIGHT</span>
            </h2>
            <div className="text-xl font-bold text-zinc-500 uppercase tracking-widest italic">
              {expert.title} — Specialist in {expert.specialty}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div className="prose prose-invert max-w-none prose-p:text-zinc-400 prose-p:text-xl md:prose-p:text-2xl prose-p:leading-relaxed prose-p:italic prose-p:font-medium prose-headings:text-white prose-headings:italic prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tighter prose-strong:text-rose-600">
              {/* Dynamic Ultra-Bold Header */}
              <h3 className="text-4xl md:text-6xl mb-12 border-l-8 border-rose-600 pl-8">
                Cinselliğin Mutlak Kodları: {location} İncelemesi
              </h3>
              
              <div 
                className="whitespace-pre-wrap selection:bg-rose-600 selection:text-white"
                dangerouslySetInnerHTML={{ __html: content.replace(/\n\n/g, '<br/><br/>') }} 
              />
            </div>

            <div className="mt-20 flex flex-wrap gap-8">
               <Link href={`/experts/${expert.slug}`} className="bg-rose-600 text-white font-black py-4 px-12 rounded-full uppercase tracking-widest italic hover:bg-white hover:text-black transition-all shadow-glow">
                  UZMAN PROTOKOLÜNÜ KEŞFET →
               </Link>
               <Link href="/ansiklopedi/iliski-simyasi" className="border border-zinc-800 text-zinc-500 font-black py-4 px-12 rounded-full uppercase tracking-widest italic hover:border-rose-600 hover:text-rose-600 transition-all">
                  ANSİKLOPEDİYE GİT
               </Link>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-12">
            <div className="bg-zinc-950/50 border border-zinc-900 rounded-4xl p-8 space-y-6">
              <h4 className="text-rose-600 font-black tracking-widest uppercase italic text-xs">Authority Metadata</h4>
              <ul className="space-y-4 text-zinc-400 text-sm font-medium italic">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                  Trust Score: 9.8/10 (Expert Verified)
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                  Node Context: {city || "National"}
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                  NLP Semantic Density: High (Prestij Range)
                </li>
              </ul>
            </div>

            <div className="bg-zinc-950/50 border border-zinc-900 rounded-4xl p-8 space-y-6 relative overflow-hidden">
               <div className="absolute inset-0 bg-linear-to-br from-rose-600/5 to-transparent"></div>
               <h4 className="text-white font-black tracking-widest uppercase italic text-xs relative z-10">VIP Secrets Access</h4>
               <p className="text-zinc-500 text-sm italic relative z-10">
                 Bu içerik, &ldquo;Prestij Protocol&rdquo; çerçevesinde yüksek rütbeli üyeler için hazırlanmıştır. 
                 Sıfır-iz (Tam Gizlilik) politikası tüm seanslarda geçerlidir.
                 <Link href="/terms" className="block mt-4 text-rose-600/50 hover:text-rose-600 underline">Legal Protocol v4.0 (AVG/GDPR)</Link>
               </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
