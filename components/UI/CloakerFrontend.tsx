"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlayCircle, Lock, Eye, AlertTriangle, ShieldAlert, Terminal, 
  Search, Shield, Server, ArrowRight, Video, Flame, Film, UserCheck, 
  Smartphone, Activity, FileText, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { API_HQ_DOMAIN } from '@/config/domains';
import { getFleetConfig } from '@/config/honeypots';

interface CloakerFrontendProps {
  districtName: string;
  host: string;
}

export function CloakerFrontend({ districtName, host }: CloakerFrontendProps) {
  const loc = districtName === "İSTANBUL" ? "İSTANBUL" : districtName.replace(/[-\u2013\u2014]/g, ' ').toUpperCase();
  const fleetConfig = getFleetConfig(host);
  const isPanicOrTool = fleetConfig?.fleet === 'PANIC' || fleetConfig?.fleet === 'GREED' || fleetConfig?.fleet === 'DESPERATE';

  // State hooks for HACK/TOOL interactive diagnostic simulator
  const [inputValue, setInputValue] = useState('');
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Diagnostic steps simulation
  const runDiagnostic = () => {
    if (!inputValue.trim() || isRunningDiagnostic) return;
    setIsRunningDiagnostic(true);
    setDiagnosticLogs([]);
    setCurrentStep(0);

    const logTemplates = [
      `🔍 Target [${inputValue}] analysis requested...`,
      `🌐 Initiating secure tunnel over 31.97.79.34 node...`,
      `📦 Querying local ${loc} registry data indices...`,
      `⚠️ Potential match signatures detected in regional records...`,
      `🔐 Establishing SSL authentication with API HQ...`,
      `🚨 High-priority session active. Validation required for raw payload access.`
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < logTemplates.length) {
        setDiagnosticLogs(prev => [...prev, logTemplates[step]]);
        setCurrentStep(step + 1);
        step++;
      } else {
        clearInterval(interval);
        setIsRunningDiagnostic(false);
      }
    }, 1200);
  };

  // Fake Video Leak Grid Items
  const leakVideos = [
    { title: `🔞 ${loc} LİSE / ÜNİVERSİTE TELEGRAM GİZLİ SIZINTISI`, duration: "06:18", views: "340K", date: "Bugün" },
    { title: `🔞 SOSYAL MEDYA FENOMENİ ${loc} REZİDANS İFŞASI`, duration: "11:42", views: "210K", date: "Dün" },
    { title: `🔞 ${loc} ELİT VİLLA SKANDAL PARTİ KASETİ (TAM SÜRÜM)`, duration: "15:05", views: "198K", date: "2 gün önce" },
    { title: `🔞 TELEGRAM GRUPLARINDAN SIZAN YERLİ ARŞİV`, duration: "29:10", views: "560K", date: "3 gün önce" },
    { title: `🔞 ONLYFANS VIP VIP YAYINCISI CASUS KAMERA SIZINTISI`, duration: "08:24", views: "412K", date: "4 gün önce" },
    { title: `🔞 ${loc} OTEL ODASINDAN SIZDIRILAN YATAK KASETLERİ`, duration: "20:01", views: "320K", date: "5 gün önce" }
  ];

  // Dynamic comments feed
  const fakeComments = [
    { user: "Ahmet_34", text: "Link gerçekten çalışıyor beyler, sonunda kaporasız ve elden ödemeli model buldum.", time: "4 dk önce" },
    { user: "Hakan__TR", text: "Esenyurt tarafındakiler videoda çıkmış rezillik resmen ahahah.", time: "12 dk önce" },
    { user: "Caner1992", text: "Onlyfans videolarını tek tıkla açtı helal olsun siber hile.", time: "18 dk önce" }
  ];

  const renderTubeLayout = () => {
    return (
      <div className="w-full relative bg-zinc-950 min-h-screen text-white overflow-hidden py-16">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-950/20 blur-[130px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-rose-950/15 blur-[130px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-zinc-900 pb-8 mb-12 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-wider uppercase italic">
                  {fleetConfig?.domain.split('.')[0].toUpperCase()} <span className="text-red-500">TUBE</span>
                </h1>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  🛡️ VIP Camouflage Leak Network // Version 1.6
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800/80 px-6 py-2.5 rounded-full">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">
                {loc} BÖLGESİ AKTİF SIZINTI: 12 AYDA 14.8M İZLEME
              </span>
            </div>
          </div>

          {/* Warning Message Card */}
          <div className="bg-gradient-to-r from-red-950/40 to-black border border-red-800/20 rounded-[2rem] p-8 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-600/[0.02] -z-10 group-hover:opacity-100 transition-opacity" />
            <div className="w-16 h-16 rounded-full bg-red-900/20 border border-red-600/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-lg font-black text-red-500 uppercase tracking-widest mb-1.5 flex items-center justify-center md:justify-start gap-2">
                <Flame className="w-5 h-5 text-red-500" /> +18 YAŞ SINIRI VE DOĞRULAMA PROTOKOLÜ
              </h2>
              <p className="text-zinc-400 text-sm font-semibold max-w-4xl leading-relaxed">
                Bu sunucu, {loc} bölgesinden sızdırılan özel Telegram kanallarındaki kasetleri barındırmaktadır. 
                İçeriklerin silinmesini önlemek ve doğrulanmış VIP partnerler ağına katılmak için aşağıdaki linkler üzerinden ana portala geçiş yapın. 
                <span className="text-white underline decoration-red-500 underline-offset-4 ml-1">Kaporasız elden ödeme güvencesiyle</span> VIP modeller sizi bekliyor.
              </p>
            </div>
          </div>

          {/* Video Grid */}
          <h2 className="text-xl font-black uppercase tracking-wider italic mb-8 flex items-center gap-2 text-zinc-300">
            <Film className="w-5 h-5 text-red-500" /> SIZDIRILAN SON KASETLER
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {leakVideos.map((video, idx) => (
              <Link 
                href={API_HQ_DOMAIN} 
                key={idx} 
                className="group relative block overflow-hidden rounded-[2rem] border border-zinc-900 bg-zinc-950/50 hover:border-red-600/30 transition-all duration-500"
              >
                {/* Fake Thumbnail Wrapper */}
                <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black opacity-80 group-hover:scale-110 transition-transform duration-700 blur-sm"></div>
                  <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay"></div>
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-md border border-red-600/30 group-hover:border-red-500 transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                      <PlayCircle className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2 z-20">
                    <span className="bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">SANSÜRSÜZ</span>
                    <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-md">{video.duration}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-zinc-300 text-[9px] font-bold px-2.5 py-1 rounded-md z-20">
                    <Eye className="w-3 h-3 text-red-500" /> {video.views}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="text-base font-black text-white group-hover:text-red-500 transition-colors italic uppercase tracking-tight mb-3 line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between border-t border-zinc-900 pt-4 mt-2">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-bold">
                      <Lock className="w-3.5 h-3.5 text-red-600" /> VİDEOYU AÇ
                    </div>
                    <span className="text-[10px] text-zinc-600 font-bold uppercase">{video.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Comments and Funnel Split Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Realtime Comments Log */}
            <div className="lg:col-span-5 bg-zinc-950/40 border border-zinc-900 rounded-[2rem] p-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-red-500" /> SİSTEM YORUMLARI
              </h3>
              
              <div className="flex flex-col gap-6">
                {fakeComments.map((c, i) => (
                  <div key={i} className="border-b border-zinc-900 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-white">{c.user}</span>
                      <span className="text-[9px] text-zinc-600 font-bold uppercase">{c.time}</span>
                    </div>
                    <p className="text-zinc-400 text-xs font-medium leading-relaxed">
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Redirect Funnel */}
            <div className="lg:col-span-7 bg-gradient-to-br from-red-950/20 via-zinc-950 to-black border border-red-950/60 rounded-[2.5rem] p-10 flex flex-col justify-center text-center lg:text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-900/5 blur-[80px] rounded-full -z-10 pointer-events-none" />
              
              <h3 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none mb-6">
                BU SAHTE DÜNYADAN ÇIK, <br/>
                <span className="text-red-500">GERÇEK VIP HİZMETLE TANIŞ!</span>
              </h3>
              <p className="text-zinc-400 text-sm md:text-base font-semibold leading-relaxed mb-8 max-w-xl">
                Sadece izlemek yetmez. İstanbul'un en prestijli, %100 doğrulanmış, kaporasız ve elden ödemeli model kadrolarıyla bu gece unutulmaz bir buluşma yaşayın.
              </p>
              
              <Link 
                href={API_HQ_DOMAIN}
                className="w-full md:w-fit bg-red-600 text-white font-black uppercase tracking-[0.2em] px-8 py-4.5 rounded-2xl hover:bg-white hover:text-black transition-all duration-300 shadow-[0_10px_30px_rgba(220,38,38,0.3)] text-center text-xs"
              >
                VIP KATALOĞA GİR VE ARAMA YAP →
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderToolLayout = () => {
    return (
      <div className="w-full relative bg-zinc-950 min-h-screen text-zinc-100 overflow-hidden py-16 font-mono">
        {/* Neon Hack / Cyber Grid Backgrounds */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-950/20 blur-[130px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4">
          
          {/* Cyber Terminal Title */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-widest text-white uppercase">
                  {fleetConfig?.domain.split('.')[0].toUpperCase()} MODULE
                </h1>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                  🔒 DEEPSEC DEPLOYMENT PORTAL // 31.97.79.34
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/20 px-4 py-1.5 rounded-md">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[10px] text-emerald-400 font-bold tracking-widest">HQ STATE: ACTIVE</span>
            </div>
          </div>

          {/* Interactive Diagnostic Container */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] blur-xl rounded-full -z-10 pointer-events-none" />
            
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-4">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>SORGULAMA SİMÜLATÖRÜ & DOĞRULAMA SİSTEMİ</span>
            </div>

            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6">
              {loc} BÖLGESİ GÜVENLİK VE SORGULAMA KONSOLU
            </h2>

            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              Bu modül, {loc} bölgesindeki aktif veritabanları ile doğrudan senkronize çalışır. 
              Sorgulamak istediğiniz hedef kimlik, plaka veya telefon numarasını girip analiz işlemini başlatın.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Örn: 34XYZ123 veya Telefon Numarası..."
                disabled={isRunningDiagnostic}
                className="flex-1 bg-zinc-900/50 border border-zinc-800 focus:border-emerald-500/50 rounded-xl px-4 py-3.5 text-sm outline-none text-white placeholder-zinc-600 font-mono transition-colors disabled:opacity-50"
              />
              <button 
                onClick={runDiagnostic}
                disabled={isRunningDiagnostic || !inputValue.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase text-xs tracking-widest px-8 py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                {isRunningDiagnostic ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" /> ANALİZ EDİLİYOR
                  </>
                ) : (
                  <>
                    SORGULA <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Diagnostic Logs Render */}
            {(diagnosticLogs.length > 0 || isRunningDiagnostic) && (
              <div className="bg-black/80 border border-zinc-900 rounded-xl p-4 font-mono text-[11px] text-zinc-400 flex flex-col gap-2.5 max-h-48 overflow-y-auto mb-6">
                {diagnosticLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2 animate-fade-in">
                    <span className="text-emerald-500 select-none">{'>'}</span>
                    <span>{log}</span>
                  </div>
                ))}
                {isRunningDiagnostic && (
                  <div className="flex items-center gap-1.5 text-emerald-400 animate-pulse">
                    <span className="animate-ping w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span>Processing local cluster queries...</span>
                  </div>
                )}
              </div>
            )}

            {/* Diagnostic Completed Notification */}
            {currentStep >= 6 && !isRunningDiagnostic && (
              <div className="border border-emerald-500/20 bg-emerald-950/20 rounded-xl p-5 mb-6 animate-fade-in flex flex-col md:flex-row items-center gap-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 shrink-0" />
                <div className="flex-1">
                  <h4 className="text-emerald-400 text-xs font-black uppercase tracking-wider mb-1">ANALİZ TAMAMLANDI</h4>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    Sorguladığınız hedefe ait veriler şifreli olarak API HQ veritabanında listelendi. Sonuçları görüntülemek ve yetkilendirmeyi tamamlamak için aşağıdaki butondan VIP panele giriş yapın.
                  </p>
                </div>
                <Link 
                  href={API_HQ_DOMAIN}
                  className="bg-emerald-400 hover:bg-emerald-300 text-black font-black uppercase text-[10px] tracking-widest px-6 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  SONUÇLARI GÖR
                </Link>
              </div>
            )}

          </div>

          {/* Quick System Stats Widget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
              <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold mb-2">
                <span>TUNNEL STATUS</span>
                <Server className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-sm font-bold text-white">SECURE ROUTE</div>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
              <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold mb-2">
                <span>VERIFICATION LEVEL</span>
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-sm font-bold text-white">C-LEVEL PRESTIGE</div>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
              <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold mb-2">
                <span>DEVICE BOUND</span>
                <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-sm font-bold text-white">MOBILE CAMOUFLAGE</div>
            </div>
          </div>

          {/* DeepSec Cyber Funnel */}
          <div className="bg-gradient-to-r from-zinc-950 via-emerald-950/10 to-zinc-950 border border-zinc-800 rounded-3xl p-8 text-center md:text-left relative overflow-hidden group">
            <h3 className="text-white text-base font-bold uppercase tracking-wider mb-3 flex items-center justify-center md:justify-start gap-2">
              ⚠️ YÖNLENDİRME PROTOKOLÜ ETKİN
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6 max-w-xl">
              Bu arayüzün dışındaki tüm raw kaynaklar ve sorgu çıktıları, VIP partner ağımızda barındırılmaktadır. 
              Gereksiz siber kontrolleri atlamak ve doğrudan elit eşlikçi rehberine ulaşmak için aşağıdaki güvenli kapıyı kullanın.
            </p>
            <Link 
              href={API_HQ_DOMAIN}
              className="inline-flex items-center gap-2 bg-emerald-500 text-black font-black uppercase text-[10px] tracking-widest px-8 py-4 rounded-xl hover:bg-white transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              VIP PORTALA GEÇİŞ YAP <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    );
  };

  return isPanicOrTool ? renderToolLayout() : renderTubeLayout();
}
