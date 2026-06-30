import React from 'react';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Shield, Activity, Zap, Database, TerminalSquare } from 'lucide-react';

export const metadata = {
  title: 'God Mode | Master Control',
};

export default function GodModeDashboard() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 p-4 md:p-8 font-sans">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <Shield className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              God Mode
            </h1>
            <p className="text-zinc-400 text-sm mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Aktif & Merkezi Komuta Devrede
            </p>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-3">
          <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Database className="w-4 h-4" />
            DB Senkronizasyonu
          </button>
          <button className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white border border-purple-400/50 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
            <TerminalSquare className="w-4 h-4" />
            Hydra CLI Başlat
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        
        {/* ANA METRİKLER (Zustand Component Entegrasyonu) */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-zinc-200">
            <Activity className="w-5 h-5 text-emerald-400" />
            Canlı Telemetri
          </h2>
          <AnalyticsDashboard />
        </section>

        {/* HIZLI ERİŞİM KARTLARI */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-white">Keyword Matrix</h3>
            <p className="text-sm text-zinc-400 mt-2 mb-4">PostgreSQL'deki 35.000+ satırlık hacimli kelime veritabanını yönetin ve indeksleyin.</p>
            <div className="text-xs font-mono bg-black/50 p-2 rounded text-zinc-300">
              npm run hydra -- db:migrate
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-amber-500/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-medium text-white">SEO Sanitizer</h3>
            <p className="text-sm text-zinc-400 mt-2 mb-4">Otomatik MDX onarımı ve tipografi düzeltmeleri. Zod zırhı ile 500 hatalarını engeller.</p>
            <div className="text-xs font-mono bg-black/50 p-2 rounded text-zinc-300">
              npm run hydra -- seo:sanitize
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TerminalSquare className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-white">Swarm (Bot Ağı)</h3>
            <p className="text-sm text-zinc-400 mt-2 mb-4">GSC Indexing ve CTR bot ağlarını tek bir merkezden otonom olarak kontrol edin.</p>
            <div className="text-xs font-mono bg-black/50 p-2 rounded text-zinc-300">
              npm run hydra -- attack:swarm
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
