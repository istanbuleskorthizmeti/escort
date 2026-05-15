'use client';

import React, { useEffect, useState } from 'react';
import { Shield, TrendingUp, Target, Loader2, RefreshCw } from 'lucide-react';

interface Competitor {
  domain: string;
  occurrenceCount: number;
  averagePosition: number;
}

interface SpyReport {
  timestamp: string;
  myAveragePosition: number;
  topCompetitors: Competitor[];
  keywordAnalysis: {
    query: string;
    myPosition: number;
    competitors: string[];
  }[];
}

export const CompetitorMatrix = () => {
  const [report, setReport] = useState<SpyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReport = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/admin/spy', {
        method: isRefresh ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: isRefresh ? JSON.stringify({ action: 'refresh' }) : undefined
      });
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      }
    } catch (error) {
      console.error('Spy Matrix Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-4 bg-zinc-900/50 border border-white/5 rounded-3xl animate-pulse">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Spy Matrix Verileri Çekiliyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-2">
            <Shield className="w-6 h-6 text-rose-600" />
            Casus Modülü: Rakip Matrisi
          </h2>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
            Top 10 Anahtar Kelimede Biz vs. Diğerleri
          </p>
        </div>
        <button 
          onClick={() => fetchReport(true)}
          disabled={refreshing}
          title="Verileri Yenile"
          className="p-3 bg-zinc-900 border border-white/10 rounded-xl hover:bg-zinc-800 transition-colors group"
        >
          <RefreshCw className={`w-5 h-5 text-amber-500 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Stats */}
        <div className="p-6 bg-zinc-900/80 border border-white/5 rounded-3xl backdrop-blur-xl">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-4 text-center">Ortalama Konumumuz</p>
          <div className="flex flex-col items-center">
            <span className="text-6xl font-black italic text-white tracking-tighter">
              { (Number(report?.myAveragePosition) || 0).toFixed(1) }
            </span>
            <div className="flex items-center gap-1 mt-2 text-emerald-500 font-bold text-xs uppercase">
              <TrendingUp className="w-4 h-4" />
              <span>Stabilite Yüksek</span>
            </div>
          </div>
        </div>

        {/* Competitor List */}
        <div className="md:col-span-2 p-6 bg-zinc-900/80 border border-white/5 rounded-3xl backdrop-blur-xl overflow-hidden">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-4">En Aktif Rakipler (Top 3 Dominansı)</p>
          <div className="space-y-4">
            {report?.topCompetitors.map((comp, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-zinc-500 group-hover:border-rose-600/50 transition-colors">
                    0{idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-200">{comp.domain}</p>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                      {comp.occurrenceCount} Kelimede İlk 3&apos;te
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-black text-white italic">Avg Pos: { (Number(comp.averagePosition) || 0).toFixed(1) }</p>
                    <div className="w-16 h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full bg-linear-to-r from-rose-600 to-rose-500 rounded-full ${
                            (Math.min(100, (10 / comp.averagePosition) * 10)) >= 100 ? 'w-full' :
                            (Math.min(100, (10 / comp.averagePosition) * 10)) >= 80 ? 'w-4/5' :
                            (Math.min(100, (10 / comp.averagePosition) * 10)) >= 60 ? 'w-3/5' :
                            (Math.min(100, (10 / comp.averagePosition) * 10)) >= 40 ? 'w-2/5' :
                            (Math.min(100, (10 / comp.averagePosition) * 10)) >= 20 ? 'w-1/5' : 'w-1'
                          }`}
                        />
                    </div>
                  </div>
                  <Target className="w-5 h-5 text-zinc-700 group-hover:text-rose-600 transition-colors cursor-help" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Keyword Analysis */}
      <div className="p-6 bg-black border border-white/5 rounded-3xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              <th className="pb-4 text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Anahtar Kelime</th>
              <th className="pb-4 text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] text-center">Konumumuz</th>
              <th className="pb-4 text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">SERP İlk 3 (Dominant)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {report?.keywordAnalysis.map((item, idx) => (
              <tr key={idx} className="group hover:bg-white/5 transition-colors">
                <td className="py-4">
                  <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{item.query}</span>
                </td>
                <td className="py-4 text-center">
                  <span className={`text-sm font-black italic ${item.myPosition <= 3 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {item.myPosition}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    {item.competitors.map((c, cIdx) => (
                      <span key={cIdx} className="px-2 py-1 bg-zinc-900 border border-white/10 rounded-md text-[10px] font-bold text-zinc-500 hover:text-rose-500 transition-colors cursor-default">
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
