'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Lock, Server } from 'lucide-react';
import { useState, useEffect } from 'react';

export function GodModeCopyright() {
  const currentYear = new Date().getFullYear();
  const [ipAddress, setIpAddress] = useState('IP_SECURE');

  useEffect(() => {
    // Fake IP resolution effect for intimidation
    const ipFragments = Array.from({ length: 4 }, () => Math.floor(Math.random() * 255));
    setIpAddress(`${ipFragments[0]}.${ipFragments[1]}.***.***`);
  }, []);

  return (
    <div className="w-full bg-black border-t border-zinc-900 mt-20 relative overflow-hidden group">
      {/* Background Matrix/Pulse Effect */}
      <div className="absolute inset-0 bg-linear-to-r from-red-900/10 via-black to-red-900/10 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Section 1: Security Notice */}
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-2 text-red-500">
              <Shield className="w-6 h-6 animate-pulse" />
              <h3 className="font-bold text-lg tracking-widest uppercase">Ultra Güvenlik</h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Bu platform <span className="text-red-400 font-bold">DRKCNAY Elite Network</span> tarafından %100 gizlilik standartları ile korunmaktadır. Tüm işlemler 256-bit şifreleme ve zero-log mimarisi ile güvence altındadır.
            </p>
          </div>

          {/* Section 2: DMCA Warning */}
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-lg tracking-widest uppercase">DMCA Koruması</h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Görsel veya metin içeriklerinin izinsiz kullanımı, <span className="text-white font-bold tracking-wider">DMCA Takedown</span> sistemi ile anında raporlanır. Rakip analiz botları ve scraperlar engellenmektedir.
            </p>
          </div>

          {/* Section 3: Connection Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-2 text-green-500">
              <Server className="w-6 h-6" />
              <h3 className="font-bold text-lg tracking-widest uppercase">Bağlantı Durumu</h3>
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 font-mono text-xs text-green-400">
              <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2">
                <span>Standart:</span>
                <span>TLS 1.3 / E2EE</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2 mb-2">
                <span>Şifreleme:</span>
                <span>AES-256 GCM Aktif</span>
              </div>
              <div className="flex justify-between">
                <span>Bağlantı:</span>
                <span className="animate-pulse text-rose-600 font-bold uppercase">Güvenli Elit Node</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Line */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12 pt-6 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-400"
        >
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Lock className="w-4 h-4" aria-hidden="true" />
            <span>&copy; {currentYear} DRKCNAY Elite Alt Alan Adı Matrisi. Tüm hakları saklıdır.</span>
          </div>
          <div className="flex gap-4 font-mono uppercase tracking-widest">
            <a href="https://vipescorthizmeti.com" className="hover:text-red-500 cursor-crosshair transition-colors text-zinc-300">DRKCNAY ELITE HQ</a>
            <span className="hover:text-zinc-100 cursor-crosshair transition-colors">GİZLİLİK</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
