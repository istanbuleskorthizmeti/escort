"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, RefreshCw, Shield, Globe, Lock, Mail, Database, Terminal as TerminalIcon } from "lucide-react";
import { fetchIntegrationAccounts, saveIntegrationAccount, deleteIntegrationAccount, checkAccountStatus } from "../actions";

const PLATFORMS = ["TUMBLR", "WORDPRESS", "PINTEREST", "MEDIUM", "SUBSTACK", "X"];

export default function IntegrationCenter() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Entegrasyon Merkezi hazır.", "[SYSTEM] Hesaplar veritabanından çekiliyor..."]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const loadAccounts = async () => {
    setIsLoading(true);
    const data = await fetchIntegrationAccounts();
    setAccounts(data);
    setIsLoading(false);
    addLog(`${data.length} adet hesap yüklendi.`);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      addLog(`Hesap kaydediliyor: ${data.username} (${data.platform})`);
      await saveIntegrationAccount({
        ...editingAccount,
        ...data,
        metadata: editingAccount?.metadata || {}
      });
      setShowModal(false);
      setEditingAccount(null);
      loadAccounts();
      addLog(`✅ Hesap başarıyla kaydedildi.`);
    } catch (err: any) {
      addLog(`❌ HATA: ${err.message}`);
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`${username} hesabını silmek istediğine emin misin?`)) return;
    try {
      addLog(`Hesap siliniyor: ${username}`);
      await deleteIntegrationAccount(id);
      loadAccounts();
      addLog(`🗑️ Hesap silindi.`);
    } catch (err: any) {
      addLog(`❌ SİLME HATASI: ${err.message}`);
    }
  };

  const handleCheck = async (id: string, username: string) => {
    addLog(`Durum kontrolü başlatıldı: ${username}`);
    const res = await checkAccountStatus(id);
    addLog(`🔍 Sonuç: ${username} -> ${res.status}`);
    loadAccounts();
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-4 md:p-8 selection:bg-rose-900">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="flex justify-between items-center border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              Integration <span className="text-rose-600">Hub</span>
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mt-1 font-mono">
              Centralized Account & API Management
            </p>
          </div>
          <button 
            onClick={() => { setEditingAccount(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(225,29,72,0.3)]"
          >
            <Plus size={16} /> HESAP EKLE
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ACCOUNTS LIST */}
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? (
              <div className="h-64 flex items-center justify-center border border-zinc-900 rounded-2xl bg-zinc-950/50">
                <RefreshCw className="animate-spin text-rose-600" />
              </div>
            ) : accounts.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center border border-zinc-900 rounded-2xl bg-zinc-950/50 text-zinc-500 uppercase text-xs tracking-widest">
                <Database className="mb-4 opacity-20" size={48} />
                Henüz hesap eklenmemiş
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.map(acc => (
                  <div key={acc.id} className="bg-zinc-950 border border-zinc-900 hover:border-rose-900/50 p-6 rounded-2xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity flex gap-2">
                       <button onClick={() => { setEditingAccount(acc); setShowModal(true); }} className="text-zinc-400 hover:text-white"><Shield size={14}/></button>
                       <button onClick={() => handleDelete(acc.id, acc.username)} className="text-zinc-600 hover:text-rose-500"><Trash2 size={14}/></button>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${
                        acc.status === 'ALIVE' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}>
                        {acc.platform.slice(0,2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-100 truncate w-32">{acc.username}</h3>
                        <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-mono">{acc.platform}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-[10px] font-mono text-zinc-500">
                      <div className="flex justify-between"><span>DURUM:</span> <span className={acc.status === 'ALIVE' ? 'text-emerald-500' : 'text-rose-500'}>{acc.status}</span></div>
                      <div className="flex justify-between"><span>LOKASYON:</span> <span>{acc.city || 'GLOBAL'}</span></div>
                      <div className="flex justify-between"><span>SON AKTİF:</span> <span>{acc.lastActive ? new Date(acc.lastActive).toLocaleDateString() : 'ASLA'}</span></div>
                    </div>

                    <button 
                      onClick={() => handleCheck(acc.id, acc.username)}
                      className="w-full mt-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 py-2 rounded-lg text-[9px] uppercase tracking-widest font-black transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={12} /> DURUM KONTROLÜ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LOGS PANEL */}
          <div className="lg:col-span-1 flex flex-col h-[calc(100vh-200px)]">
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 flex-1 flex flex-col shadow-2xl">
              <div className="flex items-center gap-2 mb-4 text-zinc-500">
                <TerminalIcon size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Global Activity Logs</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar font-mono text-[11px]">
                {logs.map((log, i) => (
                  <div key={i} className={`py-1 border-l-2 pl-3 ${
                    log.includes('✅') ? 'border-emerald-500 text-emerald-400' : 
                    log.includes('❌') ? 'border-rose-500 text-rose-400' : 
                    'border-zinc-800 text-zinc-500'
                  }`}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] w-full max-w-lg shadow-[0_0_100px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white mb-6">
              {editingAccount ? 'HESAP DÜZENLE' : 'YENİ HESAP EKLE'}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 uppercase font-bold ml-1">Platform</label>
                  <select name="platform" defaultValue={editingAccount?.platform || "TUMBLR"} className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-sm focus:border-rose-600 outline-none">
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 uppercase font-bold ml-1">Kullanıcı Adı</label>
                  <input name="username" defaultValue={editingAccount?.username} placeholder="Örn: vip_escort_77" className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-sm focus:border-rose-600 outline-none" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-500 uppercase font-bold ml-1">E-Posta (Opsiyonel)</label>
                <input name="email" type="email" defaultValue={editingAccount?.email} placeholder="hesap@mail.com" className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-sm focus:border-rose-600 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-zinc-500 uppercase font-bold ml-1">Kimlik Bilgileri (JSON / Cookie / API Key)</label>
                <textarea name="authPayload" defaultValue={editingAccount?.authPayload} placeholder='{"token": "xyz...", "cookies": "..."}' className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-sm focus:border-rose-600 outline-none h-32 font-mono" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 uppercase font-bold ml-1">Şehir</label>
                  <input name="city" defaultValue={editingAccount?.city} placeholder="istanbul" className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-sm focus:border-rose-600 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-zinc-500 uppercase font-bold ml-1">Proxy URL (Opsiyonel)</label>
                  <input name="proxyUrl" defaultValue={editingAccount?.proxyUrl} placeholder="http://user:pass@ip:port" className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-sm focus:border-rose-600 outline-none" />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">İPTAL</button>
                <button type="submit" className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(225,29,72,0.2)]">KAYDET</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
