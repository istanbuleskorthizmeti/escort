'use client';

import React, { useEffect, useState } from 'react';
import { Target, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Proposal {
  url: string;
  currentPosition: number;
  impressions: number;
  clicks: number;
  reason: string;
  suggestedAction: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export default function PivotManager() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pivot');
      const data = await res.json();
      if (data.success) {
        setProposals(data.proposals);
      }
    } catch (error) {
      console.error('Pivot Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (url: string) => {
    try {
       const res = await fetch('/api/admin/pivot', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ action: 'approve', url })
       });
       const data = await res.json();
       if (data.success) {
         setProposals(prev => prev.map(p => p.url === url ? { ...p, status: 'approved' } : p));
       }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-8 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-end border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              Pivot Manager
            </h1>
            <p className="text-xs text-rose-500 font-bold uppercase tracking-widest mt-1">
              Oto-Pivot İyileştirme Önerileri (Sayfa 2 Analizi)
            </p>
          </div>
          <button 
            onClick={fetchProposals}
            className="text-[10px] bg-zinc-900 border border-white/10 px-4 py-2 font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            Listeyi Yenile
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-zinc-950 border border-white/5 rounded-3xl animate-pulse">
             <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
             <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Öneriler Yükleniyor...</p>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-24 bg-zinc-950 border border-white/5 rounded-3xl">
            <AlertCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Bekleyen iyileştirme önerisi bulunamadı.</p>
            <p className="text-zinc-700 text-[10px] mt-2 italic">Admin panelinden &quot;Analiz Başlat&quot; butonunu kullanarak yeni tarama yapabilirsiniz.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {proposals.map((p, idx) => (
              <div key={idx} className={`p-6 bg-zinc-950 border ${p.status === 'approved' ? 'border-emerald-900/50' : 'border-zinc-900'} rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all`}>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-rose-600/10 text-rose-500 px-2 py-0.5 rounded border border-rose-500/20 font-black uppercase">Konum: { (Number(p.currentPosition) || 0).toFixed(1) }</span>
                    <span className="text-xs font-bold text-zinc-300 break-all">{p.url}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    <span>Gösterim: {p.impressions}</span>
                    <span>Tıklama: {p.clicks}</span>
                    <span className="text-rose-500/80">Neden: {p.reason}</span>
                  </div>
                  <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                     <p className="text-[10px] text-rose-500 font-black uppercase mb-1 flex items-center gap-1">
                       <Target className="w-3 h-3" /> Öneri:
                     </p>
                     <p className="text-xs text-zinc-400 italic">&quot;{p.suggestedAction}&quot;</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {p.status === 'pending' ? (
                    <>
                       <button 
                        onClick={() => handleApprove(p.url)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-glow-emerald"
                       >
                         <CheckCircle className="w-4 h-4" /> Onayla
                       </button>
                       <button className="bg-zinc-900 hover:bg-zinc-800 text-zinc-500 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                         <XCircle className="w-4 h-4" /> Reddet
                       </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-500 font-black uppercase text-[10px] tracking-widest">
                       <CheckCircle className="w-4 h-4" />
                       Yayın Alındı
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
