'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Lock,
  ArrowRight,
  RefreshCcw,
  Zap,
  Users,
  Settings,
  LayoutDashboard,
  FileText,
  LogOut,
  Plus,
  Search,
  Globe,
  Target,
  ArrowUpRight,
  Briefcase
} from 'lucide-react';

interface HQLead {
  id: string;
  status: string;
  cityName: string;
  districtName: string;
  category: string;
  claimerName?: string;
  source?: string;
  createdAt: string;
}

interface HQAd {
  id: string;
  name: string;
  phone: string;
  age: string;
  citySlugs: string[];
  tier: string;
}

interface HQContent {
  slug: string;
  content: string;
}

interface IndexStats {
  stats: {
    indexed: number;
    keys: number;
    quotaTotal: number;
  };
}

interface KeywordRecord {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface AdminStats {
  stats: {
    totalLeads: number;
    completed: number;
    revenue: number;
    activeAds: number;
  };
  regions: {
    name: string;
    count: number;
    revenue: number;
  }[];
  recentActions: {
    id: string;
    time: string;
    action: string;
    region: string;
    admin: string;
    amount?: number;
  }[];
}


/**
 * ELİT YÖNETİM MERKEZİ - Operasyonel Koordinatör
 * Telegram OTP Güvenlikli Üst Düzey Yönetim Paneli.
 */
export default function UniversalHQ() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [otp, setOtp] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<string>('stats');
  const [indexStats, setIndexStats] = useState<IndexStats | null>(null);
  const [keywordsData, setKeywordsData] = useState<{ keywords: KeywordRecord[] } | null>(null);
  const [data, setData] = useState<AdminStats | null>(null);
  const [ads, setAds] = useState<HQAd[]>([]);
  const [contents, setContents] = useState<HQContent[]>([]);
  const [leads, setLeads] = useState<HQLead[]>([]);
  const [loading, setLoading] = useState(false);


  const [editingContent, setEditingContent] = useState({ slug: '', content: '' });

  const [newAd, setNewAd] = useState({
    name: '',
    phone: '',
    age: '',
    citySlugs: '',
    tier: 'VIP'
  });

  // Consolidated Initialization Flow (React 19 / Next 16 Optimized)
  useEffect(() => {
    const initialize = async () => {
      try {
        const sessionRes = await fetch('/api/admin/auth/session', { credentials: 'include' });
        if (!sessionRes.ok) return;
        setIsAuthorized(true);
        setLoading(true);
        await Promise.all([
          fetchData(),
          fetchIndexStats(),
          fetchKeywords()
        ]);
      } finally {
        setLoading(false);
      }
    };
    initialize();

    const timer = setInterval(() => {
      if (!isAuthorized) return;
      fetchData();
      fetchIndexStats();
      fetchKeywords();
    }, 60000); // 1 minute interval for stats

    return () => clearInterval(timer);
  }, [isAuthorized]);


  const requestOTP = async () => {
    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin/auth/otp', { method: 'POST' });
      if (res.ok) {
        setStep('verify');
      } else {
        const errData = await res.json();
        alert(`Hata: ${errData.error || 'Kod gönderilemedi'}`);
      }
    } catch (e) {
      console.error(e);
      alert("Sunucuya bağlanılamadı. İnternet bağlantınızı veya sistem durumunu kontrol edin.");
    }
    setAuthLoading(false);
  };

  const verifyOTP = async () => {
    setAuthLoading(true);
    try {
      const res = await fetch('/api/admin/auth/otp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otp })
      });
      if (res.ok) {
          setIsAuthorized(true);
          await Promise.all([
            fetchData(),
            fetchIndexStats(),
            fetchKeywords()
          ]);
      } else {
          const errData = await res.json();
          alert(`Hata: ${errData.error || 'Geçersiz Kod!'}`);
      }
    } catch (e) {
      console.error(e);
      alert("Doğrulama sırasında bir ağ hatası oluştu.");
    }
    setAuthLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
        const [statsRes, adsRes, contentRes, leadsRes] = await Promise.all([
            fetch('/api/admin/stats'),
            fetch('/api/admin/ads'),
            fetch('/api/admin/content'),
            fetch('/api/admin/leads')
        ]);
        setData(await statsRes.json());
        setAds(await adsRes.json());
        setContents(await contentRes.json());
        setLeads(await leadsRes.json());
    } catch (e) {
        console.error(e);
    }
    setLoading(false);
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/leads', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
          fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchIndexStats = async () => {
    const res = await fetch('/api/admin/indexing');
    if (res.ok) setIndexStats(await res.json());
  };

  const fetchKeywords = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/keywords');
    if (res.ok) setKeywordsData(await res.json());
    setLoading(false);
  };

  const triggerIndexing = async () => {
    if (!confirm("Tüm sitemap linklerini Google'a bildirme işlemini başlatmak istiyor musunuz? (Arka planda çalışır)")) return;
    const res = await fetch('/api/admin/indexing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'trigger_index' })
    });
    if (res.ok) {
        alert("İşlem Başlatıldı. Telegram üzerinden rapor paylaşılacaktır.");
    }
  };

  const handleSaveContent = async () => {
    if (!editingContent.slug) return;
    const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingContent)
    });
    if (res.ok) {
        fetchData();
        alert("İçerik Başarıyla Güncellendi");
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...newAd,
            citySlugs: newAd.citySlugs.split(',').map(s => s.trim())
        })
    });
    if (res.ok) {
        fetchData();
        setNewAd({ name: '', phone: '', age: '', citySlugs: '', tier: 'VIP' });
    }
  };

  const deleteAd = async (id: string) => {
    if (!confirm("Reklamı silmek istediğine emin misin?")) return;
    await fetch('/api/admin/ads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    fetchData();
  };

  // Polling removed as it is now integrated into the consolidated initialization effect


  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-12 rounded-[3.5rem] text-center space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-600/10 blur-3xl rounded-full"></div>
          <div className="w-24 h-24 bg-rose-600/20 rounded-full flex items-center justify-center mx-auto border border-rose-600/30">
            <Lock className="w-10 h-10 text-rose-600" />
          </div>
          <div>
            <h1 className="text-4xl font-black italic text-white tracking-widest uppercase mb-3">ELİT YÖNETİM</h1>
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">OTP GÜVENLİKLİ ÖZEL BÖLÜM</p>
          </div>

          {step === 'request' ? (
            <button 
              onClick={requestOTP}
              disabled={authLoading}
              className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-3xl font-black italic uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
            >
              {authLoading ? 'Gönderiliyor...' : 'Telegram OTP Gönder'} <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="space-y-6">
               <input 
                type="text" 
                title="OTP Kodu"
                aria-label="Telegram üzerinden gönderilen 6 haneli doğrulama kodu"
                placeholder="6 HANELİ KOD" 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center text-3xl text-rose-500 font-black tracking-[0.8em] focus:border-rose-600 transition-all outline-none"
              />

              <button 
                onClick={verifyOTP}
                disabled={authLoading}
                className="w-full py-5 bg-white text-black rounded-3xl font-black italic uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                {authLoading ? 'Doğrulanıyor...' : 'Erişim İzin Ver'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased flex">
      {/* Sidebar Navigation */}
      <aside className="w-80 border-r border-zinc-900 bg-zinc-950 p-10 flex flex-col justify-between shrink-0">
         <div className="space-y-12">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
               </div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">ELİT PANEL</h2>
            </div>

            <nav className="space-y-4">
               {[
                 { id: 'stats', icon: LayoutDashboard, label: 'Dashboard' },
                 { id: 'leads', icon: Briefcase, label: 'VIP Talepler' },
                 { id: 'ads', icon: Users, label: 'Reklam Yönetimi' },
                 { id: 'content', icon: FileText, label: 'İçerik Yönetimi' },
                 { id: 'visibility', icon: Search, label: 'Görünürlük' },
                 { id: 'radar', icon: Target, label: 'Kelime Radarı' },
                 { id: 'logs', icon: Activity, label: 'Canlı Akış' },
                 { id: 'settings', icon: Settings, label: 'Ayarlar' },
               ].map((item) => (
                 <button
                   key={item.id}
                   onClick={() => setActiveTab(item.id as any)}
                   className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-rose-600 text-white shadow-glow' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'}`}
                 >
                   <item.icon className="w-5 h-5" />
                   {item.label}
                 </button>
               ))}
            </nav>
         </div>

         <button 
          onClick={async () => {
            await fetch('/api/admin/auth/session', { method: 'DELETE' });
            setIsAuthorized(false);
          }}
          className="flex items-center gap-4 px-6 py-4 text-zinc-500 hover:text-rose-600 transition-colors font-black text-xs uppercase tracking-widest"
         >
            <LogOut className="w-5 h-5" /> Güvenli Çıkış
         </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 md:p-20 overflow-y-auto">
         <header className="flex items-center justify-between mb-16">
            <div>
               <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">Komuta Merkezi</h1>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Güvenli Bağlantı: AKTİF</span>
               </div>
            </div>
            
            <button 
                onClick={fetchData}
                className={`p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-rose-600 transition-all ${loading ? 'animate-spin text-rose-500' : 'text-zinc-400'}`}
              >
                <RefreshCcw className="w-6 h-6" />
            </button>
         </header>

         {activeTab === 'stats' && data && (
            <div className="space-y-12 animate-fade-in">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    { label: 'Gelen Talepler', val: data.stats.totalLeads, icon: Activity, color: 'text-zinc-100' },
                    { label: 'Başarılı Seans', val: data.stats.completed, icon: CheckCircle2, color: 'text-emerald-500' },
                    { label: 'Tahsilat (TL)', val: data.stats.revenue.toLocaleString(), icon: TrendingUp, color: 'text-rose-600' },
                    { label: 'Aktif İlan', val: data.stats.activeAds, icon: Users, color: 'text-amber-500' },
                  ].map((s, i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] relative overflow-hidden group">
                       <s.icon className="w-10 h-10 absolute -bottom-2 -right-2 text-zinc-900 group-hover:text-rose-600/10 transition-colors" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">{s.label}</span>
                       <h3 className={`text-4xl font-black italic ${s.color}`}>{s.val}</h3>
                    </div>
                  ))}
               </div>

               <div className="bg-zinc-950 border border-zinc-900 p-10 rounded-[3rem]">
                  <h3 className="text-xl font-black italic uppercase tracking-widest mb-10 flex items-center gap-4">
                    <BarChart3 className="w-6 h-6 text-rose-600" /> Bölge Verimlilik Matrisi
                  </h3>
                  <div className="space-y-8">
                    {data.regions.slice(0, 10).map((r, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-zinc-400">{r.name}</span>
                          <span className="text-rose-600">{r.count} Op / {r.revenue.toLocaleString()} TL</span>
                        </div>
                        <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden">
                           <div className="h-full bg-linear-to-r from-rose-700 to-rose-400 rounded-full" style={{ width: `${(Math.min(r.count, 50) / 50) * 100}%` }} />
                        </div>
                      </div>
                    ))}

                  </div>
               </div>
            </div>
         )}

         {activeTab === 'content' && (
            <div className="space-y-12 animate-fade-in">
               <div className="bg-zinc-950 border border-zinc-900 p-10 rounded-[3rem] space-y-8">
                  <h3 className="text-xl font-black italic uppercase tracking-widest">Master Content Architect</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Lokasyon Slug (örn: istanbul-besiktas)</label>
                        <input value={editingContent.slug} onChange={e => setEditingContent({...editingContent, slug: e.target.value})} className="w-full bg-zinc-900 p-5 rounded-2xl border border-zinc-800 outline-none focus:border-rose-600" />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Eylem</label>
                        <button onClick={handleSaveContent} className="w-full py-5 bg-rose-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-rose-500 transition-colors">Değişiklikleri Kaydet</button>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label htmlFor="master-content" className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Özel İçerik (HTML/Markdown)</label>
                     <textarea id="master-content" title="İçerik Editörü" aria-label="Sayfa içeriğini düzenleme alanı" value={editingContent.content} onChange={e => setEditingContent({...editingContent, content: e.target.value})} className="w-full h-80 bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-800 outline-none focus:border-rose-600 font-medium leading-relaxed" />
                  </div>

               </div>

               <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-zinc-900/50 border-b border-zinc-900">
                        <tr>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Slug</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Eylem</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-900">
                        {contents.map((c) => (
                           <tr key={c.slug} className="hover:bg-white/5 transition-colors">
                              <td className="p-8 font-black italic">{c.slug}</td>
                              <td className="p-8 text-right">
                                 <button onClick={() => setEditingContent({ slug: c.slug, content: c.content })} className="text-rose-600 font-black uppercase text-xs">Düzenle</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

          {activeTab === 'leads' && (
            <div className="space-y-12 animate-fade-in">
               <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden">
                  <div className="p-10 border-b border-zinc-900 flex items-center justify-between">
                     <h3 className="text-xl font-black italic uppercase tracking-widest flex items-center gap-4">
                        <Briefcase className="w-6 h-6 text-rose-600" /> Lead Pipeline (CRM)
                     </h3>
                  </div>
                  <table className="w-full text-left">
                     <thead className="bg-zinc-900/50 border-b border-zinc-900">
                        <tr>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Tarih</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Lokasyon</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Kategori</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Kaynak / Sahiplenen</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Durum</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Aksiyon</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-900">
                        {leads.map((lead) => (
                           <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-8 font-medium text-xs text-zinc-400">
                                {new Date(lead.createdAt).toLocaleString('tr-TR')}
                              </td>
                              <td className="p-8 text-[11px] font-bold text-zinc-100 uppercase tracking-widest">
                                {lead.cityName} / {lead.districtName}
                              </td>
                              <td className="p-8 text-rose-500 font-bold text-xs">{lead.category}</td>
                              <td className="p-8 text-[10px]">
                                <div className="text-zinc-500">{lead.source || 'Website'}</div>
                                {lead.claimerName && <div className="text-amber-500 font-bold mt-1">@{lead.claimerName}</div>}
                              </td>
                              <td className="p-8">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black ${
                                  lead.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-500 border border-emerald-900' :
                                  lead.status === 'IN_SESSION' ? 'bg-blue-950 text-blue-500 border border-blue-900' :
                                  lead.status === 'CANCELLED' ? 'bg-red-950 text-red-500 border border-red-900' :
                                  'bg-zinc-900 text-zinc-300 border border-zinc-700'
                                }`}>
                                  {lead.status}
                                </span>
                              </td>
                              <td className="p-8 text-right">
                                <select 
                                  value={lead.status}
                                  onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                  className="bg-black border border-zinc-800 text-xs font-bold text-zinc-300 rounded-lg p-2 outline-none"
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="CLAIMED">CLAIMED</option>
                                  <option value="LOCATION_SENT">LOCATION_SENT</option>
                                  <option value="IN_SESSION">IN_SESSION</option>
                                  <option value="PAYMENT_RECEIVED">PAYMENT_RECEIVED</option>
                                  <option value="COMPLETED">COMPLETED</option>
                                  <option value="CANCELLED">CANCELLED</option>
                                  <option value="EXTERNAL_HUB">EXTERNAL_HUB</option>
                                </select>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-12 animate-fade-in">
               <form onSubmit={handleCreateAd} className="bg-zinc-950 border border-zinc-900 p-10 rounded-[3rem] grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3 mb-4">
                     <h3 className="text-xl font-black italic uppercase tracking-widest flex items-center gap-4">
                        <Plus className="w-6 h-6 text-rose-600" /> Yeni Premium İlan Ekle
                     </h3>
                  </div>
                  <input required placeholder="Adı Soyadı" value={newAd.name} onChange={e => setNewAd({...newAd, name: e.target.value})} className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 outline-none focus:border-rose-600" />
                  <input required placeholder="Tel (905xx)" value={newAd.phone} onChange={e => setNewAd({...newAd, phone: e.target.value})} className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 outline-none focus:border-rose-600" />
                  <input required placeholder="Yaş" value={newAd.age} onChange={e => setNewAd({...newAd, age: e.target.value})} className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 outline-none focus:border-rose-600" />
                  <input required placeholder="Şehirler (virgülle ayır: istanbul,ankara)" value={newAd.citySlugs} onChange={e => setNewAd({...newAd, citySlugs: e.target.value})} className="md:col-span-2 bg-zinc-900 p-5 rounded-2xl border border-zinc-800 outline-none focus:border-rose-600" />
                  <select title="İlan Segmenti" aria-label="Reklam paketi seçimi" value={newAd.tier} onChange={e => setNewAd({...newAd, tier: e.target.value})} className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 outline-none">

                     <option value="VIP">VIP</option>
                     <option value="Elite">Elite</option>
                     <option value="Supreme">Supreme</option>
                  </select>
                  <button title="İlan Ekle" aria-label="Yeni ilanı veritabanına kaydet" className="md:col-span-3 py-5 bg-rose-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-rose-500 transition-colors shadow-glow">
                     İlanı Yayına Al
                  </button>

               </form>

               <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-zinc-900/50 border-b border-zinc-900">
                        <tr>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">İsim</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Telefon</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Bölgeler</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Segment</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Eylem</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-900">
                        {ads.map((ad) => (
                           <tr key={ad.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-8 font-black italic">{ad.name}</td>
                              <td className="p-8 text-zinc-400 font-medium">{ad.phone}</td>
                              <td className="p-8 text-[10px] font-black text-rose-600">{ad.citySlugs.join(', ')}</td>
                              <td className="p-8">
                                 <span className="px-3 py-1 bg-rose-950 text-rose-500 rounded-full text-[10px] font-black border border-rose-900">{ad.tier}</span>
                              </td>
                              <td className="p-8 text-right">
                                 <button title="İlanı Sil" aria-label="Bu ilan kaydını tamamen sil" onClick={() => deleteAd(ad.id)} className="p-3 bg-zinc-900 rounded-xl text-zinc-500 hover:text-rose-600 hover:border-rose-600 border border-transparent transition-all">
                                    <XCircle className="w-5 h-5" />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

         {activeTab === 'visibility' && indexStats && (
            <div className="space-y-12 animate-fade-in">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem]">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">İndekslenen Toplam URL</span>
                     <h3 className="text-4xl font-black italic text-rose-600">{indexStats.stats.indexed}</h3>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem]">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Aktif Servis Anahtarı</span>
                     <h3 className="text-4xl font-black italic text-zinc-100">{indexStats.stats.keys}</h3>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem]">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Günlük Bildirim Kotası</span>
                     <h3 className="text-4xl font-black italic text-emerald-500">{indexStats.stats.quotaTotal}</h3>
                  </div>
               </div>

               <div className="bg-zinc-950 border border-zinc-900 p-10 rounded-[3rem] space-y-8">
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="text-xl font-black italic uppercase tracking-widest">Google AEO Motoru</h3>
                        <p className="text-zinc-500 text-xs mt-2">Tüm sitemap linklerini (970+ ilçe) Google Indexing API üzerinden sıraya al.</p>
                     </div>
                     <button 
                        onClick={triggerIndexing}
                        className="px-8 py-4 bg-rose-600 text-white font-black italic uppercase tracking-widest rounded-2xl flex items-center gap-3 hover:bg-rose-500 shadow-glow transition-all"
                     >
                        <Globe className="w-5 h-5" /> Şimdi Bildirime Başla
                     </button>
                  </div>

                  <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                     <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                        <strong className="text-rose-500 uppercase">Önemli Not:</strong> Her servis anahtarı günlük 200 gönderim hakkına sahiptir. 
                        970 ilçenin tamamının taranması için sisteme en az 5 adet 'google-key-x.json' dosyası eklemeniz önerilir. 
                        İşlem bittiğinde Telegram grubunuza rapor gönderilecektir.
                     </p>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'radar' && keywordsData && (
            <div className="space-y-12 animate-fade-in">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem]">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Toplam Tıklama (28G)</span>
                     <h3 className="text-4xl font-black italic text-zinc-100">
                        {keywordsData.keywords.reduce((a, b) => a + Number(b.clicks), 0).toLocaleString()}
                     </h3>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem]">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Toplam Gösterim</span>
                     <h3 className="text-4xl font-black italic text-zinc-100">
                        {(Number(keywordsData.keywords.reduce((a: any, b: any) => a + b.impressions, 0) / 1000) || 0).toFixed(1)}K
                     </h3>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem]">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Ortalama Pozisyon</span>
                     <h3 className="text-4xl font-black italic text-rose-600">
                        {(Number(keywordsData.keywords.reduce((a: any, b: any) => a + b.position, 0) / (keywordsData.keywords.length || 1)) || 0).toFixed(1)}
                     </h3>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem]">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Aktif Kelime Sayısı</span>
                     <h3 className="text-4xl font-black italic text-emerald-500">{keywordsData.keywords.length}</h3>
                  </div>

               </div>

               <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden">
                  <div className="p-10 border-b border-zinc-900 flex items-center justify-between">
                     <h3 className="text-xl font-black italic uppercase tracking-widest flex items-center gap-4">
                        <Target className="w-6 h-6 text-rose-600" /> Anahtar Kelime Matrisi
                     </h3>
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Google Search Console: Real-Time</span>
                  </div>
                  <table className="w-full text-left">
                     <thead className="bg-zinc-900/50 border-b border-zinc-900">
                        <tr>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Sorgu / Anahtar Kelime</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Pozisyon</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Tık</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Gösterim</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">CTR</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-900">
                        {keywordsData.keywords.slice(0, 50).map((k, i) => (
                           <tr key={i} className="hover:bg-white/5 transition-colors group">
                              <td className="p-8 font-black italic text-zinc-100 group-hover:text-rose-500 transition-colors uppercase">{k.query}</td>
                              <td className="p-8">
                                 <div className="flex items-center gap-2">
                                    <span className={`text-lg font-black ${k.position <= 3 ? 'text-emerald-500' : k.position <= 10 ? 'text-amber-500' : 'text-zinc-500'}`}>
                                       #{(Number(k.position) || 0).toFixed(1)}
                                    </span>
                                    {k.position <= 3 && <ArrowUpRight className="w-4 h-4 text-emerald-500 animate-pulse" />}
                                 </div>
                              </td>
                              <td className="p-8 font-bold text-zinc-400">{k.clicks}</td>
                              <td className="p-8 font-bold text-zinc-400">{k.impressions.toLocaleString()}</td>
                              <td className="p-8 font-black text-xs text-rose-600">{(Number(k.ctr * 100) || 0).toFixed(1)}%</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {activeTab === 'logs' && data && (
            <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 font-mono space-y-4 max-h-[70vh] overflow-y-auto animate-fade-in">
                {data.recentActions.map((log) => (
                    <div key={log.id} className="flex gap-6 text-sm border-l-2 border-rose-600 pl-6 py-2 hover:bg-white/5 transition-colors group">
                       <span className="text-zinc-700 shrink-0">[{log.time}]</span>
                       <span className="text-emerald-500 font-bold shrink-0">{log.action}</span>
                       <span className="text-zinc-400">{log.region} bölgesinde {log.admin} tarafından gerçekleştirildi.</span>
                       {log.amount && <span className="text-amber-500 ml-auto font-black">{log.amount} TL</span>}
                    </div>
                ))}
            </div>
         )}

         {activeTab === 'settings' && (
             <div className="bg-zinc-950 border border-zinc-900 p-10 rounded-[3rem] space-y-8 animate-fade-in">
                <h3 className="text-xl font-black italic uppercase tracking-widest">Global Sistem Ayarları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label htmlFor="wa-number" className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Ana WhatsApp Numarası</label>
                      <input id="wa-number" title="WhatsApp Numarası" className="w-full bg-zinc-900 p-5 rounded-2xl border border-zinc-800 outline-none" defaultValue="90501xxx" />
                   </div>
                   <div className="space-y-4">
                      <label htmlFor="tg-handle" className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Telegram Manager Handle</label>
                      <input id="tg-handle" title="Telegram Kullanıcı Adı" className="w-full bg-zinc-900 p-5 rounded-2xl border border-zinc-800 outline-none" defaultValue="@DRKCNAY_ceo" />
                   </div>
                </div>
                <button title="Ayarları Kaydet" aria-label="Tüm sistem ayarlarını veritabanına kaydet" className="px-10 py-5 bg-zinc-100 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all">
                    Değişiklikleri Kaydet
                </button>
             </div>
         )}

      </main>
    </div>
  );
}
