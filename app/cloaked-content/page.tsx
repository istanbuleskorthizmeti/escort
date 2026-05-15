import React from 'react';
import { headers } from 'next/headers';
import { getDomainConfig } from '@/config/domains';

export const dynamic = 'force-dynamic';

export default async function CloakedContentPage() {
  let host = "";
  try {
    const headersList = await headers();
    host = headersList.get("host") || "";
  } catch (e) {}

  const config = getDomainConfig(host);
  const location = config?.targetDistrict 
    ? `${config.targetDistrict.charAt(0).toUpperCase() + config.targetDistrict.slice(1)}` 
    : config?.targetCity 
      ? `${config.targetCity.charAt(0).toUpperCase() + config.targetCity.slice(1)}` 
      : 'İstanbul';

  return (
    <main className="w-full bg-white text-zinc-900 min-h-screen font-serif">
      <header className="bg-zinc-100 p-8 text-center border-b border-zinc-200">
        <h1 className="text-4xl md:text-6xl font-bold text-zinc-800 tracking-tight">
          {location} Gezi ve Yaşam Rehberi
        </h1>
        <p className="mt-4 text-zinc-600 text-lg">
          Bölgenin en gözde mekanları, kültürel mirasları ve gizli kalmış güzellikleri.
        </p>
      </header>

      <article className="max-w-4xl mx-auto p-8 md:p-12 mt-6 bg-white shadow-sm leading-loose">
        <h2 className="text-3xl font-semibold mb-6 text-zinc-800">Tarihi Dokusu ve Modern Yaşam</h2>
        <p className="mb-6 text-lg text-zinc-700">
          {location}, tarihi zenginlikleri ve modern yaşamın dinamizmini mükemmel bir uyum içinde sunan eşsiz bölgelerden biridir. 
          Günün her saatinde canlı sokakları, şık butikleri ve sanatsal etkinlikleriyle ziyaretçilerine unutulmaz deneyimler yaşatır.
        </p>
        
        <h2 className="text-2xl font-semibold mt-10 mb-4 text-zinc-800">Gastronomi ve Eğlence Rehberi</h2>
        <p className="mb-6 text-lg text-zinc-700">
          Gurme restoranlardan yerel lezzet duraklarına kadar geniş bir yelpazeye sahip olan {location}, damak tadına düşkün olanlar için bir cennettir. 
          Akşam saatlerinde ise şehrin ışıkları eşliğinde elit mekanlarda günün yorgunluğunu atabilirsiniz. 
          Lüks otelleri ve üst düzey konaklama seçenekleri ile bölge, konfor arayanların bir numaralı tercihidir.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3 text-zinc-800">Gezilecek Yerler Listesi</h3>
        <ul className="list-disc pl-6 space-y-2 text-zinc-700">
          <li>Tarihi çarşılar ve antika dükkanları</li>
          <li>Sahil yürüyüş yolları ve parklar</li>
          <li>Modern sanat galerileri ve müzeler</li>
          <li>Lüks alışveriş merkezleri ve butikler</li>
        </ul>

        <div className="mt-12 p-6 bg-zinc-50 rounded border border-zinc-100 text-sm text-zinc-500">
          Bu makale {new Date().getFullYear()} turizm vizyonu çerçevesinde hazırlanmıştır. {location} bölgesindeki turistik mekanlar ve yaşam standartları hakkında bilgi vermek amacıyla yayınlanmıştır.
        </div>
      </article>

      <footer className="p-8 text-center text-zinc-500 text-sm border-t border-zinc-200 mt-12 bg-zinc-50">
        &copy; {new Date().getFullYear()} {location} Şehir İncelemeleri ve Yaşam Platformu. Tüm hakları saklıdır.
      </footer>
    </main>
  );
}
