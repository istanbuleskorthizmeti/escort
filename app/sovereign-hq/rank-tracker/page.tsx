"use client";

import React, { useState } from "react";
import { Search, Loader2, Target, Globe, Play, Shuffle } from "lucide-react";
import { cities } from "@/lib/locations";
import { useAppStore } from "@/lib/store";
import { RankTrackerTable } from "@/components/Admin/RankTrackerTable";
import { CompetitorMatrix } from "@/components/Admin/CompetitorMatrix";

// ⚡ VIP: Kuantum SEO Tracker Interface

interface RankResult {
  keyword: string;
  rank: number | "100+";
  url: string;
  topCompetitors: string[];
  status: "idle" | "loading" | "success" | "error";
  locationContext?: string;
}

export default function RankTrackerPage() {
  const { rankResults: results, setRankResults: setResults, isScanning, setIsScanning, updateRankResult } = useAppStore();
  const [targetDomain, setTargetDomain] = useState("istanbulescort.blog");
  const [baseKeywords, setBaseKeywords] = useState("escort, elit partner, görüşme, iletişim");
  const [auditUrl, setAuditUrl] = useState("https://istanbulescort.blog/ankara/cankaya");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<null | {
    success: boolean;
    extractedKeywords: string[];
    metrics: { wordCount: number; h2Count: number };
  }>(null);

  // OTO-KEŞİF (Auto-Discovery): Rastgele 10 ilçe ve baz kelimeleri birleştirerek en iyi aranma potansiyeli olan kombinasyonları oluşturur.
  const generateAutonomousKeywords = () => {
    const allDistricts: { city: string; district: string }[] = [];
    
    Object.values(cities).forEach(city => {
      city.districts.forEach(district => {
        allDistricts.push({ city: city.name, district: district.name.replace(" VIP", "") });
      });
    });

    // Shuffle and pick top 5 for demo to prevent spamming Google and getting blocked instantly
    const shuffled = allDistricts.sort(() => 0.5 - Math.random()).slice(0, 5);
    const bases = baseKeywords.split(",").map(k => k.trim()).filter(Boolean);

    const generated: RankResult[] = [];

    shuffled.forEach(loc => {
      bases.forEach(base => {
        // e.g. "Ankara Çankaya escort", "İzmir Bornova elit partner"
        generated.push({
          keyword: `${loc.city} ${loc.district} ${base}`.toLowerCase(),
          rank: -1,
          url: "",
          topCompetitors: [],
          status: "idle",
          locationContext: `${loc.city} / ${loc.district}`
        });
      });
    });

    setResults(generated);
  };

  const auditTargetUrl = async () => {
    if (!auditUrl) return;
    setIsAuditing(true);
    setAuditResult(null);
    try {
      const res = await fetch("/api/seo/audit-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: auditUrl })
      });
      const data = await res.json();
      if (data.success) {
        setAuditResult(data);
        if (data.extractedKeywords?.length > 0) {
           setBaseKeywords(data.extractedKeywords.join(", "));
        }
      }
    } catch(err) {
      console.error(err);
    }
    setIsAuditing(false);
  };

  const startScan = async () => {
    if (results.length === 0) return;
    setIsScanning(true);

    for (let i = 0; i < results.length; i++) {
      // Setup loading state for current item
      updateRankResult(i, { status: "loading" });

      try {
        const res = await fetch("/api/seo/rank-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword: results[i].keyword, targetDomain })
        });
        
        const data = await res.json();
        
        if (data.success) {
          updateRankResult(i, {
            status: "success",
            rank: data.rank,
            url: data.url,
            topCompetitors: data.topCompetitors
          });
        } else {
          updateRankResult(i, { status: "error" });
        }
      } catch (err) {
        console.error("Scan error:", err);
        updateRankResult(i, { status: "error" });
      }

      // 3 second delay between requests to simulate human behavior and avoid trigger 429
      await new Promise(r => setTimeout(r, 3000));
    }

    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-6 pt-24 pb-32">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <Globe className="w-8 h-8 text-amber-500" />
              Kuantum Sıra Bulucu <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">BETA</span>
            </h1>
            <p className="text-zinc-500 mt-2 text-sm max-w-xl">
              Türkiye çapında tüm lokasyon veri ağacını tarayarak platformun görünürlüğünü, arama motoru sıralamalarını ve rakipleri canlı analiz eder. &quot;VIP&quot; Otonom Keşif aktif.
            </p>
          </div>
        </div>

        {/* System Analyzer */}
        <div className="p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md mb-6 space-y-4">
           <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-500" /> Sistem Sayfası Analizörü (Keyword Extraction)
            </h3>
            <p className="text-xs text-zinc-500">Hedef URL&apos;yi tarayarak iç seo optimizasyonlarını bulur ve hedef arama motoru kelimelerini &quot;Otonom Üreteci&quot; için otomatik hazırlar.</p>
            <div className="flex gap-4">
              <input 
                  type="text" 
                  value={auditUrl}
                  onChange={(e) => setAuditUrl(e.target.value)}
                  className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-colors"
                  placeholder="https://istanbulescort.blog/ankara/cankaya"
              />
              <button 
                onClick={auditTargetUrl}
                disabled={isAuditing}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                {isAuditing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sayfayı Analiz Et"}
              </button>
            </div>
            {auditResult && (
              <div className="mt-4 p-4 border border-blue-500/20 bg-blue-500/5 rounded-xl text-sm space-y-2">
                 <p className="text-zinc-400">Bulunan Otonom Kelimeler (Rank Tracker&apos;a aktarıldı):</p>
                 <div className="flex flex-wrap gap-2">
                    {auditResult.extractedKeywords.map((kw: string, idx: number) => (
                      <span key={idx} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30 text-xs font-medium">{kw}</span>
                    ))}
                 </div>
                 <div className="flex gap-4 mt-2 text-xs text-zinc-500">
                   <span>Kelime Sayısı: {auditResult.metrics.wordCount}</span>
                   <span>H2 Etiketleri: {auditResult.metrics.h2Count}</span>
                 </div>
              </div>
            )}
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-md space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-500" /> Hedef Yapılandırması
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-500 font-medium tracking-wider uppercase mb-1 block">Hedef Domain / Kelime</label>
                <input 
                  type="text" 
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-500/50 transition-colors"
                  placeholder="escortvip"
                />
              </div>
              <div>
                <label htmlFor="baseKeywords" className="text-xs text-zinc-500 font-medium tracking-wider uppercase mb-1 block">Türetilecek Baz Kelimeler (Virgülle ayırın)</label>
                 <input 
                  type="text" 
                  id="baseKeywords"
                  value={baseKeywords}
                  onChange={(e) => setBaseKeywords(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-500/50 transition-colors"
                  placeholder="Kelime 1, Kelime 2..."
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-md flex flex-col justify-center space-y-4">
            <button 
              onClick={generateAutonomousKeywords}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all"
              disabled={isScanning}
            >
              <Shuffle className="w-4 h-4" /> Kelimeleri Otonom Üret (Rastgele Şehir/İlçe)
            </button>
            <button 
              onClick={startScan}
              disabled={results.length === 0 || isScanning}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black px-6 py-3 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isScanning ? "Tarama Yapılıyor (Anti-Bot Koruması Aktif)..." : "Uzay Taramasını Başlat"}
            </button>
          </div>
        </div>

        {/* Spy Mode Matrix */}
        <div className="mt-12 mb-24">
          <CompetitorMatrix />
        </div>

        {/* Results Table */}
        <RankTrackerTable />
      </div>
    </div>
  );
}
