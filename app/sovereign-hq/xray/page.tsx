"use client";

import { useState } from "react";

interface SpamAnalysisResult {
  url?: string;
  totalCharacters: number;
  wordCount: number;
  h1: string;
  metaDescription: string;
  blackHatMetrics: {
    hiddenElementsCount: number;
    keywordStuffingScore: number;
  };
  whiteHatMetrics: {
    eeatLogisticsScore: number;
  };
  finalSpamProbability: number;
  verdict: 'SAFE_WHITE_HAT' | 'SUSPICIOUS' | 'TOXIC_BLACK_HAT';
}

export default function XRayPage() {
  const [htmlInput, setHtmlInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<SpamAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!htmlInput) {
      setError("Lütfen taratmak için HTML kaynak kodunu yapıştırın.");
      return;
    }

    setIsScanning(true);
    setError(null);
    setReport(null);

    try {
      const res = await fetch("/api/admin/spy/xray", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent: htmlInput, targetUrl: urlInput })
      });

      const data = await res.json();
      
      if (data.success) {
        setReport(data.report);
      } else {
        setError(data.error || "Bilinmeyen bir hata oluştu.");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsScanning(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'SAFE_WHITE_HAT': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'SUSPICIOUS': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'TOXIC_BLACK_HAT': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-zinc-400 bg-zinc-800 border-zinc-700';
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans overflow-y-auto p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
          
          <header className="border-b border-zinc-800 pb-6">
            <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2 text-[#ff8600]">
              X-Ray <span className="text-white">Spam Scorer</span>
            </h1>
            <p className="text-zinc-400 text-sm">
              Rakip sitelerin (veya kendi sayfalarımızın) Puppeteer çıktısını veya ham HTML kodunu buraya yapıştırarak Google SpamBrain simülasyonundan geçirin.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* INPUT SECTION */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Hedef URL (Opsiyonel)</label>
                <input 
                  type="text" 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://rakip-site.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm focus:border-[#ff8600] focus:ring-1 focus:ring-[#ff8600] outline-hidden transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">HTML Kaynak Kodu</label>
                <textarea 
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                  placeholder="<!DOCTYPE html><html>..."
                  className="w-full h-96 bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs font-mono text-zinc-400 focus:border-[#ff8600] focus:ring-1 focus:ring-[#ff8600] outline-hidden transition-all resize-none"
                />
              </div>

              <button 
                onClick={handleScan}
                disabled={isScanning}
                className="w-full bg-[#ff8600] text-black font-black uppercase tracking-widest py-4 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
              >
                {isScanning ? "Analiz Ediliyor (Cheerio Motoru)..." : "HTML'i X-Ray ile Tara"}
              </button>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* RESULTS SECTION */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/50 pointer-events-none" />
              
              {!report ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4 relative z-10 min-h-[400px]">
                  <span className="text-4xl">🔬</span>
                  <p className="text-sm font-medium">Analiz sonucu bekleniyor...</p>
                </div>
              ) : (
                <div className="relative z-10 space-y-6">
                  {/* VERDICT HERO */}
                  <div className={`p-6 rounded-xl border ${getVerdictColor(report.verdict)} text-center`}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Sistem Kararı</p>
                    <h2 className="text-2xl font-black tracking-tight">{report.verdict.replace(/_/g, ' ')}</h2>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <span className="text-4xl font-black">{report.finalSpamProbability}%</span>
                      <span className="text-sm font-medium opacity-70 uppercase tracking-widest mt-2">Spam Olasılığı</span>
                    </div>
                  </div>

                  {/* METADATA */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/50 p-4 rounded-lg border border-zinc-800">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Sayfa H1</p>
                      <p className="text-sm font-medium truncate" title={report.h1}>{report.h1}</p>
                    </div>
                    <div className="bg-black/50 p-4 rounded-lg border border-zinc-800">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Toplam Kelime</p>
                      <p className="text-xl font-black text-white">{report.wordCount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* DETAILED SCORES */}
                  <div className="space-y-4 pt-4 border-t border-zinc-800">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Detaylı Metrikler</h3>
                    
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <span className="text-rose-500">🕵️</span>
                        <span className="text-sm text-zinc-300">Gizli Element Sayısı (Cloaking)</span>
                      </div>
                      <span className="font-bold text-white">{report.blackHatMetrics.hiddenElementsCount} adet</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <span className="text-amber-500">🔥</span>
                        <span className="text-sm text-zinc-300">Keyword Stuffing Skoru</span>
                      </div>
                      <span className="font-bold text-white">{report.blackHatMetrics.keywordStuffingScore}/100</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400">💎</span>
                        <span className="text-sm text-zinc-300">EEAT & Lojistik Skoru (Kamuflaj)</span>
                      </div>
                      <span className="font-bold text-white">{report.whiteHatMetrics.eeatLogisticsScore}/100</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-600 pt-4 text-center">
                    Analiz edilen URL: {report.url || 'Belirtilmedi'}
                  </div>
                </div>
              )}
            </div>

          </div>
      </div>
    </div>
  );
}
