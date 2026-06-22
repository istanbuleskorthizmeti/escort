import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/UI/Navbar";
import { PanicButton } from "@/components/UI/ConciergeSuite";
import { experts } from "@/lib/experts";
import { getStitchedContent } from "@/lib/obsidian-fragments";
import { SmartImage } from "@/components/UI/SmartImage";
import { siteConfig } from "@/config/site";
import { BreadcrumbSchema } from "@/components/SEO/JsonLd";
import { headers } from "next/headers";
import { prisma } from "../../../lib/prisma";
import { omniAI } from "../../../lib/ai-provider";
import { getPersonaForHost, PERSONAS } from "../../../lib/persona-engine";
import { getSiteId, getCanonicalHost } from "../../../lib/site-context";
import { getDomainConfig } from "../../../config/domains";
import { toTitleCaseTR } from "../../../lib/utils";

export const dynamic = "force-dynamic";

async function getEncyclopediaContent(slug: string, host: string, siteId: string | null, entry: any, anchorText: string) {
  const dbSlug = `ansiklopedi-${slug}`;
  
  // Strict unique per-site content check to avoid duplicate PBN footprint
  let page = null;
  if (siteId) {
    page = await prisma.pageContent.findFirst({
      where: {
        slug: dbSlug,
        siteId: siteId
      }
    });
  }

  if (page && page.content) {
    return page.content;
  }

  const personaKey = getPersonaForHost(host);
  const persona = PERSONAS[personaKey];
  
  const systemPrompt = `
    [GEMINI ELITE CORE - PERSONA-BASED UNDETECTABLE AI & ACADEMIC EEAT]
    Görevin: "${entry.title}" konusunu derinlemesine ve son derece akademik/yaşam kültürü kalitesinde ele alan elit bir makale yazmaktır.
    
    Yazım Tonu: ${persona.tone}
    Odak Noktaları: ${persona.focus}
    Duygu Durumu: ${persona.emotional_state}
    Yazım Ritmi (Burstiness): Kısa ve keskin cümleler ile uzun betimleme cümlelerinin bir arada kullanıldığı son derece insansı ve akıcı bir tempo.
    Kelimeler: ${persona.vocabulary.join(', ')}
    
    KURALLAR:
    - Yapay zeka bağlaçları ("Sonuç olarak", "Öncelikle", "Bununla birlikte") KESİNLİKLE YASAKTIR.
    - Metni zengin H2, H3 alt başlıkları ve HTML paragrafları ile oluştur.
    - Yazının uzunluğu en az 1200 kelime olmalıdır.
    - Metin içinde şu 2 linki dofollow olarak ekle:
      1. <a href="https://istanbulescort.blog">https://istanbulescort.blog</a> (Anchor: "kaporasız eskort bayanlar")
      2. <a href="https://${host}">https://${host}</a> (Anchor: "${anchorText}")
  `;

  const userPrompt = `Konu: ${entry.title}. Lütfen bu konuya dair, okuyucuya en lüks dergi kalitesini hissettiren derinlikte, ${personaKey} üslubuna tam uyumlu bir makale gövdesi oluştur. Sadece HTML etiketlerini (p, h2, h3, strong) kullanarak yanıtla. JSON veya markdown kod bloğu kullanma.`;

  try {
    let htmlContent = await omniAI.generate(userPrompt, { systemPrompt, temperature: 0.75, max_tokens: 3000 });
    
    if (htmlContent.includes('```html')) {
      htmlContent = htmlContent.split('```html')[1].split('```')[0].trim();
    } else if (htmlContent.includes('```')) {
      htmlContent = htmlContent.split('```')[1].trim();
    }

    // Cache content asynchronously
    await prisma.pageContent.create({
      data: {
        slug: dbSlug,
        siteId: siteId,
        title: entry.title,
        content: htmlContent,
      }
    });

    return htmlContent;
  } catch (err: any) {
    console.error("⚠️ Dynamic article generation failed, falling back to spintax:", err.message);
    return getStitchedContent(slug.length * 100, 2000).replace(/\n\n/g, '<br/><br/>');
  }
}

const encyclopediaData: Record<string, { title: string, expertId: string, description: string }> = {
  "fantezi-arkeolojisi": {
    title: "Fantezi Arkeolojisi: Arzunun Derinlikleri",
    expertId: "eda-nur",
    description: "İnsan zihninin karanlık ve arzulu labirentlerini haritalandıran, BDSM ve rol-play psikolojisine giriş."
  },
  "biyo-performans": {
    title: "Biyo-Performans: Tanrısal Kondisyon",
    expertId: "dorukcan-ay",
    description: "Hormonal egemenlik, testosteron optimizasyonu ve hücresel enerji bio-hacking standartları."
  },
  "iliski-simyasi": {
    title: "İlişki Simyası: Yakınlık ve Bağ",
    expertId: "eda-nur",
    description: "Dirty Talk linguistiği ve GFE (Girlfriend Experience) psikolojisi üzerine bilimsel bir inceleme."
  },
  "seks-teknolojileri": {
    title: "Modern Seks Teknolojileri",
    expertId: "dorukcan-ay",
    description: "2026 vizyonu ile cinsel sağlığı destekleyen modern teknolojiler ve vazo-dilatasyon cihazları."
  },
  "cinsel-saglik-ve-guvenlik": {
    title: "Cinsel Sağlık ve Güvenlik: Sıfır-İz",
    expertId: "dorukcan-ay",
    description: "Elit-Grade güvenlik standartları ve elit korunma kültürü."
  },
  "gizlilik-matrisi": {
    title: "Gizlilik Matrisi: VIP Anonimlik Stratejileri",
    expertId: "dorukcan-ay",
    description: "Kriptografik iletişimden fiziksel sıfır-iz standartlarıne kadar elitlerin gizlilik anayasası."
  },
  "erotik-linguistik": {
    title: "Erotik Dilbilim: Kelimelerin Gücü",
    expertId: "eda-nur",
    description: "Dirty Talk sanatının nöro-biyolojik etkileri ve zihinsel uyarılma mekanizmaları."
  },
  "metropol-lojistigi": {
    title: "Metropol Lojistiği: Tam Gizlilik Transferler",
    expertId: "dorukcan-ay",
    description: "Büyük şehirlerde VIP güvenliğini sağlayan operasyonel transfer ve lokasyon yönetimi."
  },
  "etik-hedonizm": {
    title: "Etik Hedonizm: 2026'da Haz Sanatı",
    expertId: "eda-nur",
    description: "Karşılıklı rıza ve yüksek saygı temelinde, yetişkin haz dünyasının modern felsefi incelemesi."
  },
  "biyo-hacking": {
    title: "Biyo-Hacking: VIP Performans Zirvesi",
    expertId: "dorukcan-ay",
    description: "Mitokondriyal enerji yönetimi ve stres kontrolü ile kesintisiz güç standartları."
  },
  "ulser-nasil-gecer": {
    title: "Ülser Nasıl Geçer: Modern Mide Sağlığı Tedavisi",
    expertId: "dorukcan-ay",
    description: "Sindirim sistemi sağlığı, ülser nedenleri, belirtileri ve en güncel tedavi yaklaşımları."
  },
  "kortizon-kullanimi": {
    title: "Kortizon Kullananların Yorumları ve Dikkat Edilmesi Gerekenler",
    expertId: "dorukcan-ay",
    description: "Kortizon tedavisinin vücut üzerindeki etkileri, yan etkileri ve iyileşme süreci analizleri."
  },
  "cinsellikte-oglak-burcu": {
    title: "Cinsellikte Oğlak Burcu: İlişki ve Haz Uyumu",
    expertId: "eda-nur",
    description: "Astrolojik haritada Oğlak burcunun cinsel karakteri, partner uyumu ve gizli haz noktaları."
  },
  "cinsellikte-beden-dili": {
    title: "Cinsellikte Beden Dili: Arzularınızı Sözsüz İfade Etmenin Yolları",
    expertId: "eda-nur",
    description: "Partnerinizle sözsüz iletişim kurarak yakınlığı ve heyecanı artırmanın psikolojik metotları."
  },
  "istanbul-seks-hikayeleri": {
    title: "İstanbul Erotik Hikayeler: Şehir Yaşamının Gizli Anları",
    expertId: "eda-nur",
    description: "Metropol yaşamının gizli, heyecanlı ve tutkulu anlarından derlenen ilişki hikayeleri."
  },
  "cinsel-isteksizlik-nedenleri": {
    title: "Cinsel İsteksizlik Nedenleri ve Çözüm Yolları",
    expertId: "eda-nur",
    description: "İlişkilerde cinsel soğukluk, nedenleri, psikolojik faktörler ve heyecanı geri kazanma yolları."
  },
  "erken-bosalma-cozumleri": {
    title: "Erken Boşalma Önleme Yöntemleri ve Egzersizleri",
    expertId: "dorukcan-ay",
    description: "Erkeklerde kontrol ve kondisyon artırıcı egzersizler, nefes teknikleri ve biyolojik kontrol metotları."
  },
  "seksin-faydalari": {
    title: "Düzenli Cinsel İlişkinin Sağlığa ve Psikolojiye Faydaları",
    expertId: "eda-nur",
    description: "Biyolojik ve hormonal açılardan cinsel hayatın kalp sağlığına, strese ve bağışıklık sistemine faydaları."
  },
  "afrodizyak-besinler": {
    title: "Afrodizyak Etkili Besinler: Gücü ve Tutkuyu Artıran Gıdalar",
    expertId: "dorukcan-ay",
    description: "Kan akışını hızlandıran, libidoyu artıran ve performansı optimize eden doğal gıdalar ve beslenme rehberi."
  },
  "iliski-sonrasi-temizlik": {
    title: "Cinsel İlişki Sonrası Temizlik ve Sağlık Kuralları",
    expertId: "dorukcan-ay",
    description: "İlişki sonrasında enfeksiyon riskini önlemek için yapılması gereken kişisel hijyen ve sağlık pratikleri."
  },
  "cinsel-guc-artirici": {
    title: "Doğal Performans Artırıcı Yöntemler ve Bitkisel Çözümler",
    expertId: "dorukcan-ay",
    description: "Herhangi bir kimyasal maddeye ihtiyaç duymadan, doğal performans artırıcı formüller ve yaşam tarzı değişiklikleri."
  },
  "vip-yasanti-ve-kultur": {
    title: "VIP Yaşam Kültürü: Elit Bir Sosyal Hayatın Şifreleri",
    expertId: "dorukcan-ay",
    description: "Metropollerde lüks yaşam standartları, kaliteli sosyalleşme pratikleri ve elit bir hayat tarzının anahtarları."
  }
};

import { SecureHTML } from "@/components/SecureHTML";

export async function generateStaticParams() {
  return Object.keys(encyclopediaData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = encyclopediaData[slug];
  
  let host = siteConfig.domain;
  try {
    const headersList = await headers();
    const hostHeader = headersList.get("host") || siteConfig.domain;
    host = getCanonicalHost(hostHeader);
  } catch (e) {}

  if (!entry) {
    const formattedSlug = slug.replace(/-/g, ' ').toUpperCase();
    return { title: `📚 ${formattedSlug} | ELİT ANSİKLOPEDİ | DRKCNAY ${new Date().getFullYear()}` };
  }

  return {
    title: `🛡️ ${entry.title} | Elit Ansiklopedi`,
    description: entry.description,
    alternates: {
      canonical: `https://${host}/ansiklopedi/${slug}`,
    }
  };
}

export default async function EncyclopediaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = encyclopediaData[slug as string];
  if (!entry) notFound();

  const hostHeader = (await headers()).get("host") || siteConfig.domain;
  const host = getCanonicalHost(hostHeader);
  const siteId = await getSiteId(host);

  const config = getDomainConfig(host);
  const targetLoc = config.targetDistrict || config.targetCity || "istanbul";
  const anchorText = `${toTitleCaseTR(targetLoc)} Escort`;

  const expert = experts.find(e => e.id === entry.expertId);
  const content = await getEncyclopediaContent(slug, host, siteId, entry, anchorText);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <BreadcrumbSchema 
        items={[
          { name: "Ana Sayfa", item: "https://istanbulescort.blog" },
          { name: "Ansiklopedi", item: "https://istanbulescort.blog/ansiklopedi" },
          { name: entry.title.split(":")[0], item: `https://istanbulescort.blog/ansiklopedi/${slug}` },
        ]}
      />
      <Navbar />

      <main className="max-w-5xl mx-auto py-24 px-6 md:px-12">
        <header className="mb-24 relative space-y-8">
           <div className="absolute -top-40 -left-20 w-[500px] h-[500px] bg-rose-600/5 blur-[200px] rounded-full -z-10"></div>
           
           <div className="w-full h-80 relative mb-16 overflow-hidden rounded-[3rem] border border-rose-600/10 shadow-glow-zinc">
              <SmartImage 
                src={`/images/encyclopedia/${slug}.png`}
                fallbackUrl="/og-premium.png"
                alt={entry.title}
                fill
                className="object-cover opacity-60"
                glowEffect="rose"
                 luxuryBorder
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>
           </div>
           <div className="inline-block bg-zinc-950 border border-zinc-900 text-rose-600 text-[10px] font-black uppercase tracking-[0.5em] px-6 py-2 rounded-full">
             Elit ENCYCLOPEDIA // AUTHORITATIVE SOURCE
           </div>
           
           <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter leading-[0.8] italic uppercase font-serif">
             {entry.title.split(":")[0]} <br />
             <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 via-rose-400 to-rose-600">
                {entry.title.split(":")[1] || "ABSOLUTE CODE"}
             </span>
           </h1>

           <p className="text-zinc-400 text-2xl md:text-4xl font-medium max-w-4xl border-l-8 border-rose-600 pl-12 py-4 italic">
             {entry.description}
           </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-40">
           <div className="lg:col-span-8 space-y-12">
              <SecureHTML 
                className="prose prose-invert max-w-none prose-p:text-xl md:prose-p:text-2xl prose-p:leading-relaxed prose-p:italic prose-p:font-medium prose-p:text-zinc-300 prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-white prose-strong:text-rose-600"
                html={content.replace(/\n\n/g, '<br/><br/>')}
              />
           </div>

           <aside className="lg:col-span-4 space-y-12 h-fit sticky top-32">
              {expert && (
                <div className="bg-zinc-950/50 border border-zinc-900 rounded-[3rem] p-10 space-y-8 backdrop-blur-3xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-linear-to-br from-rose-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   
                   <div className="relative z-10 space-y-6">
                      <div className="w-24 h-24 rounded-2xl border-2 border-rose-600/30 bg-black flex items-center justify-center text-rose-600 text-4xl font-serif italic shadow-glow">
                        {expert.name[0]}
                      </div>
                      <div>
                        <h4 className="text-white font-black text-2xl italic uppercase tracking-tighter">{expert.name}</h4>
                        <p className="text-rose-600 font-bold text-xs uppercase tracking-widest">{expert.title}</p>
                      </div>
                      <p className="text-zinc-500 text-sm italic leading-relaxed">
                        {expert.bio.slice(0, 150)}...
                      </p>
                      <Link href={`/experts/${expert.slug}`} className="inline-flex items-center gap-3 text-white hover:text-rose-600 transition-colors text-xs font-black tracking-widest uppercase">
                         PROFİLİ İNCELE <span>→</span>
                      </Link>
                   </div>
                </div>
              )}

              <div className="bg-zinc-950/50 border border-zinc-900 rounded-[3rem] p-10 space-y-6">
                 <h4 className="text-zinc-500 font-black text-xs tracking-widest uppercase">DİĞER KONULAR</h4>
                 <nav className="flex flex-col gap-4">
                    {Object.entries(encyclopediaData).map(([s, data]) => (
                      s !== slug && (
                        <Link key={s} href={`/ansiklopedi/${s}`} className="text-zinc-400 hover:text-rose-600 transition-colors font-black italic uppercase tracking-tighter text-lg">
                          {data.title.split(":")[0]}
                        </Link>
                      )
                    ))}
                 </nav>
              </div>

              <div className="bg-zinc-950/50 border border-zinc-900 rounded-[3rem] p-10 space-y-6">
                 <h4 className="text-zinc-500 font-black text-xs tracking-widest uppercase">OTORİTE BÖLGELERİ</h4>
                 <nav className="flex flex-col gap-4">
                    {[
                      { name: "Şişli Escort", path: "/istanbul/sisli" },
                      { name: "Beşiktaş Escort", path: "/istanbul/besiktas" },
                      { name: "Kadıköy Escort", path: "/istanbul/kadikoy" },
                      { name: "Bakırköy Escort", path: "/istanbul/bakirkoy" },
                      { name: "Beylikdüzü Escort", path: "/istanbul/beylikduzu" },
                      { name: "Sefaköy Escort", path: "/istanbul/kucukcekmece/sefakoy" }
                    ].map((loc, idx) => (
                      <Link key={idx} href={loc.path} className="text-zinc-400 hover:text-rose-500 transition-colors font-black italic uppercase tracking-tighter text-lg">
                        {loc.name}
                      </Link>
                    ))}
                 </nav>
              </div>
           </aside>
        </section>

        <section className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-rose-600 to-transparent"></div>
           <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-widest mb-8 font-serif">
             Bilimsel Temelli <span className="text-rose-600">Elit</span> Yaklaşımı
           </h2>
           <p className="text-zinc-500 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed italic">
             EscortVIP Ansiklopedisi, sadece bir rehbet değil, aynı zamanda cinsel sağlığınızı ve yaşam standartlarınızı optimize eden bir bilgi merkezidir. Her içerik, uzmanlarımızın onayından geçerek en saf haliyle size sunulur.
           </p>
        </section>
      </main>

      <PanicButton />
      <footer className="py-20 border-t border-zinc-900 bg-black text-center px-10">
        <div className="text-[10px] font-black tracking-[1em] text-zinc-900 uppercase italic mb-4">
          Prestij ORACLE PROTOCOL // ESTABLISHED 2026
        </div>
        <Link href="/terms" className="text-rose-600/30 hover:text-rose-600 text-[10px] font-black tracking-widest uppercase transition-colors">
          LEGAL PROTOCOL (AVG/GDPR COMPLIANT)
        </Link>
      </footer>
    </div>
  );
}
