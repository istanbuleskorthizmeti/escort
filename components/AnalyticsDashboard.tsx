import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { useEffect } from 'react';
import { LineChart, BarChart, Users, Eye, MousePointerClick, BarChart3 } from 'lucide-react';
import clsx from 'clsx';

export default function AnalyticsDashboard() {
  const { visitors, pageViews, ctr, impressions, isLoading, error, fetchData } = useAnalyticsStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
        <p className="font-bold">Sistem Hatası</p>
        <p>{error}</p>
      </div>
    );
  }

  const stats = [
    { label: 'Toplam Ziyaretçi (GA4)', value: visitors.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Sayfa Görüntüleme', value: pageViews.toLocaleString(), icon: Eye, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Tıklama Oranı (CTR)', value: `%${ctr}`, icon: MousePointerClick, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Arama Gösterimleri (GSC)', value: impressions.toLocaleString(), icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="w-full space-y-6 p-6 rounded-2xl bg-zinc-950/50 border border-white/5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Sistem Metrikleri
          </h2>
          <p className="text-zinc-400 text-sm mt-1">Google Analytics & Search Console Canlı Verileri</p>
        </div>
        <button 
          onClick={() => fetchData()}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <LineChart className="w-4 h-4" />
          )}
          Senkronize Et
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i}
              className={clsx(
                "p-4 rounded-xl border border-white/5 bg-white/5 relative overflow-hidden group",
                isLoading && "animate-pulse"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
                <div className={clsx("p-2 rounded-lg", stat.bg)}>
                  <Icon className={clsx("w-4 h-4", stat.color)} />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {isLoading ? '...' : stat.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
