import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Star, Image as ImageIcon, CheckCircle2, Crown } from "lucide-react";
import { siteConfig } from "../../../config/site";
import Navbar from "../../../components/UI/Navbar";
import { UltraFooter } from "../../../components/SEO/UltraFooter";
import { generateUltraGraphSchema } from "../../../lib/seo-schema";
import { SEOContentEngine } from "../../../components/SEO/SEOContentEngine";
import { VIPBridge } from "../../../components/UI/VIPBridge";
import { vitrinImages } from "../../../lib/vitrin-images";
import { slugify, turkishToUpper } from "../../../lib/utils";
import { getCanonicalHost } from "../../../lib/site-context";
import { prisma } from "../../../lib/prisma";
import { omniAI } from "../../../lib/ai-provider";

export const revalidate = 3600; // Cache as static HTML, regenerate in background (ISR)
export const dynamicParams = true;

async function getProfileBio(slug: string, host: string, name: string, district: string): Promise<string> {
  const dbSlug = `profile-bio-${slug}-${host}`;
  try {
    const cached = await prisma.pageContent.findFirst({
      where: { slug: dbSlug }
    });
    if (cached && cached.content) {
      return cached.content;
    }
  } catch (dbErr) {
    console.warn("⚠️ Database check failed for profile bio cache:", dbErr);
  }

  // Fallback synonyms if AI fails
  const fallbackBio = `${name}, ${district} bölgesinin en seçkin vip escort bayan modellerinden biridir. ${district} kaporasız escort buluşmalarında %100 güvenli, elden ödemeli ve doğrulanmış görsellerle lüks ve ayrıcalıklı bir refakatçi deneyimi sunar.`;

  const systemPrompt = `
    Sen bir Lüks Yaşam Kültürü Yazarı ve Black Hat SEO Uzmanısın.
    Görevin, VIP partner/model olan "${name}" için ${district} bölgesinde özel refakatçi hizmetlerini (otel ve eve gelen vip escort arayışını) öven, son derece akıcı, zengin, LSI anahtar kelimeleri içeren bir biyografi ve inceleme yazmaktır.
    İçerik tamamen doğal, akıcı ve C-Level beylere hitap eden elit bir tonda olmalıdır.
    İçerikte "kaporasız", "elden ödemeli", "VIP partner", "doğrulanmış fotoğraflar" gibi LSI kelimeleri doğal olarak geçir.
    Sadece paragraflar (p) halinde, toplamda 120-150 kelime arasında yaz. HTML dışında markdown, başlık veya json kullanma.
  `;
  const userPrompt = `Lütfen ${district} bölgesinde hizmet veren model ${name} için vip eskort temalı bir biyografi yazısı oluştur.`;

  try {
    const generated = await omniAI.generate(userPrompt, {
      model: 'gemini-2.0-flash',
      systemPrompt,
      temperature: 0.75,
      max_tokens: 500
    });
    
    let cleanText = generated.trim();
    if (cleanText.includes('```html')) {
      cleanText = cleanText.split('```html')[1].split('```')[0].trim();
    } else if (cleanText.includes('```')) {
      cleanText = cleanText.split('```')[1].trim();
    }

    try {
      await prisma.pageContent.create({
        data: {
          slug: dbSlug,
          title: `${name} Biyografi`,
          content: cleanText,
          siteId: null
        }
      });
    } catch (dbSaveErr) {
      console.warn("⚠️ Failed caching profile bio to DB:", dbSaveErr);
    }
    return cleanText;
  } catch (err) {
    console.error("❌ Failed generating bio via OmniAI:", err);
    return fallbackBio;
  }
}

export default async function ProfilePage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = await paramsPromise;
  const { slug } = params;

  const hostHeader = (await headers()).get("host") || siteConfig.domain;
  const host = getCanonicalHost(hostHeader);
  const domainPrefix = host.split('.')[0];

  const name = turkishToUpper(slug.charAt(0)) + slug.slice(1);
  const city = "İstanbul";
  
  let charSum = 0;
  const hashString = slug + host;
  for (let i = 0; i < hashString.length; i++) {
    charSum += hashString.charCodeAt(i);
  }

  const getSeoImageUrl = (srcPath: string) => {
    if (!srcPath) return "";
    if (srcPath.startsWith('http')) return srcPath;
    const filename = srcPath.split('/').pop() || '';
    if (filename.startsWith('vip-profil-')) {
      const match = filename.match(/vip-profil-(\d+)\.webp/);
      if (match) {
        return `/${slugify(city)}-vip-escort-ilan-${match[1]}.webp`;
      }
    }
    return srcPath;
  };

  const profileData = vitrinImages.find(v => v.title && v.title.toLowerCase().includes(slug.toLowerCase()));
  
  let mainImageSrc = '';
  let gallerySources: string[] = [];

  if (profileData && profileData.gallery && profileData.gallery.length > 0) {
    const startIdx = charSum % profileData.gallery.length;
    mainImageSrc = profileData.gallery[startIdx];
    gallerySources = [...profileData.gallery.slice(startIdx), ...profileData.gallery.slice(0, startIdx)].slice(0, 4);
  } else {
    const mainImageIdx = charSum % vitrinImages.length;
    mainImageSrc = vitrinImages[mainImageIdx].src;
    for (let i = 1; i <= 4; i++) {
       const gIdx = (charSum * i + 7) % vitrinImages.length;
       gallerySources.push(vitrinImages[gIdx].src);
    }
  }

  const bioContent = await getProfileBio(slug, host, name, city);

  const schema = generateUltraGraphSchema({
    locationName: name,
    city: city,
    description: `${name} ${city} bölgesinde sarışın escort, rus model ve üniversiteli escort hizmeti sunan seçkin bir modeldir. %100 gerçek görseller.`,
    url: `https://${host}/profile/${slug}`,
    categoryTitle: "VIP Galeri v8.0"
  });

  return (
    <main className="min-h-screen bg-black text-white antialiased selection:bg-rose-600/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navbar />
      
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
             
             {/* 📸 MAIN PROFILE IMAGE */}
             <div className="relative rounded-[3rem] overflow-hidden border border-zinc-900 shadow-[0_0_50px_rgba(225,29,72,0.15)] aspect-3/4.5 group transition-all duration-700 hover:border-rose-600/30">
                <Image 
                  src={getSeoImageUrl(mainImageSrc)} 
                  alt={`${domainPrefix.toUpperCase()} ${name} ${city} Escort - %100 Gerçek ve Onaylı Profil`}
                  title={`${domainPrefix.toUpperCase()} ${name} ${city} VIP`}
                  fill
                  unoptimized={true}
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  priority
                />
                <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-xl px-6 py-2 rounded-full border border-rose-600/30 text-rose-600 text-[10px] font-black tracking-[0.2em] flex items-center gap-3">
                   <Crown size={14} className="animate-pulse" /> VIP ELITE SELECTION
                </div>
             </div>

             {/* 📝 ELITE PROFILE INTEL */}
             <div className="flex flex-col gap-10">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex gap-1 text-rose-600">
                      {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] italic border-l border-zinc-800 pl-4">ONAYLI PROFİL</span>
                  </div>
                  
                  <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6 text-white">
                     {name}
                  </h1>
                  <div className="text-2xl font-black text-rose-600 uppercase tracking-widest italic opacity-80">
                     {city.toUpperCase()} {"//"} DRKCNAY ELITE
                  </div>
                </div>

                <div 
                  className="text-zinc-400 text-lg md:text-xl leading-relaxed font-medium italic border-l-4 border-rose-600 pl-8 max-w-2xl"
                  dangerouslySetInnerHTML={{ __html: bioContent }}
                />

                {/* 🔱 VISUAL GALLERY */}
                <div className="border-t border-zinc-900/50 pt-10">
                   <h3 className="text-[11px] font-black text-white uppercase mb-8 flex items-center gap-4 tracking-[0.3em] italic">
                     <ImageIcon size={18} className="text-rose-600" /> ÖZEL GÖRSEL GALERİSİ
                   </h3>
                     <div className="grid grid-cols-4 gap-4 md:gap-6">
                       {gallerySources.map((src, idx) => {
                         const lsiNiches = ["elit", "üniversiteli", "rus", "sınırsız", "anal", "kaporasız", "vip", "gecelik", "otele gelen", "özel konsept"];
                         const domainLsi = lsiNiches[(charSum + idx) % lsiNiches.length];

                         return (
                           <div 
                             key={idx} 
                             className="relative aspect-square rounded-3xl overflow-hidden border border-zinc-900 group cursor-zoom-in transition-transform duration-300 hover:scale-105"
                           >
                             <Image 
                               src={getSeoImageUrl(src)} 
                               alt={`${domainPrefix} ${name} ${city} Escort Galeri Görseli ${idx + 1} - ${domainLsi}`}
                               title={`${domainPrefix} ${name} ${domainLsi}`}
                               fill
                               unoptimized={true}
                               className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                             />
                           </div>
                         )
                       })}
                     </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 mt-6">
                   <Link 
                      href={profileData && profileData.phone 
                        ? `https://wa.me/${profileData.phone}?text=Merhaba ${name}, seni ${domainPrefix.toUpperCase()} ELITE profilinde gördüm, randevu almak istiyorum.` 
                        : `/whatsapp?text=Merhaba ${name}, seni ${domainPrefix.toUpperCase()} ELITE profilinde gördüm, randevu almak istiyorum.`}
                      className="bg-rose-600 hover:bg-white text-white hover:text-black px-10 py-6 rounded-3xl font-black text-xl uppercase italic flex items-center justify-center gap-4 transition-all duration-500 shadow-[0_0_50px_rgba(225,29,72,0.2)] group"
                   >
                      <MessageCircle size={24} className="group-hover:scale-110 transition-transform" /> WHATSAPP İLE RANDEVU AL
                   </Link>

                   <div className="bg-zinc-950/50 backdrop-blur-xl border border-zinc-900 px-8 py-6 rounded-3xl flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 italic">
                      <CheckCircle2 size={20} className="text-emerald-500" /> %100 GİZLİLİK GARANTİSİ
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="glass-card p-6 rounded-2xl border border-zinc-900/50 bg-zinc-950/30">
                        <div className="text-[10px] font-black text-rose-600 uppercase mb-2 tracking-widest">HİZMET ALANI</div>
                        <div className="text-sm font-bold">EVE & OTELE SERVİS</div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-zinc-900/50 bg-zinc-950/30">
                        <div className="text-[10px] font-black text-rose-600 uppercase mb-2 tracking-widest">ÇALIŞMA SAATİ</div>
                        <div className="text-sm font-bold">7/24 AKTİF</div>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* 🔱 VIP TRANSITION BRIDGE */}
      <VIPBridge />

      {/* 🔱 AGGRESSIVE SEO ENGINE: CONTENT & TAGS */}
      <SEOContentEngine cityName={city} host={host} />

      <UltraFooter host={host} cityName={city} />
    </main>
  );
}
