import Link from "next/link";
import { experts } from "@/lib/experts";

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

export function ExpertInsight({ location, type = "neighborhood" }: { location: string; type?: "district" | "neighborhood" }) {
  // Deterministic expert selection based on location string
  const seed = cyrb128(location);
  const expertIndex = seed % experts.length;
  const expert = experts[expertIndex];
  const moduleIndex = seed % expert.modules.length;
  const selectedModule = expert.modules[moduleIndex];

  return (
    <div className="my-16 bg-Prestij border border-zinc-900 rounded-3xl p-8 md:p-12 relative overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.5)]">
       <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-gold/10 transition-colors"></div>
       
       <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
          <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full border-2 border-gold/30 bg-zinc-950 flex items-center justify-center text-gold text-4xl font-serif italic overflow-hidden">
             {expert.name[0]}
          </div>

          <div className="flex-1 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest uppercase text-gold bg-zinc-950 px-3 py-1 rounded-full border border-gold/20">
                   Elit EXPERT INSIGHT // {location.toUpperCase()}
                </span>
             </div>
             
             <h3 className="text-2xl md:text-3xl font-black italic uppercase font-serif text-zinc-100">
                {expert.name} Says:
             </h3>
             <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{expert.title}</h4>
             
             <p className="text-zinc-300 text-lg md:text-xl leading-relaxed italic border-l-2 border-gold/30 pl-6">
                &ldquo;{type === "neighborhood" 
                  ? `${location} bölgesindeki VIP etkileşimlerde en önemli unsur, ${selectedModule.title} disiplinidir. Bölgenin yüksek profiline uygun bir deneyim için bu kodun şifrelerini bilmek fark yaratır.` 
                  : `${location} genelindeki randevularda, ${selectedModule.title} yaklaşımını uygulamak, standartları sarsılmaz kılar.`}&rdquo;
             </p>

             <div className="pt-6 mt-6 border-t border-zinc-900/50">
                <Link href={`/experts/${expert.slug}`} className="inline-flex items-center gap-3 text-gold hover:text-white transition-colors text-xs font-black tracking-widest uppercase">
                   TÜM PROTOKOLÜ İNCELE <span className="text-lg">→</span>
                </Link>
             </div>
          </div>
       </div>
    </div>
  );
}
