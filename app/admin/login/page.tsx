"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Send, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"send" | "verify">("send");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSendOtp() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/otp", {
        method: "POST",
        body: JSON.stringify({ action: "send" }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("verify");
      } else {
        setError(data.error || "Kod gönderilemedi.");
      }
    } catch (e) {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/otp", {
        method: "POST",
        body: JSON.stringify({ action: "verify", code: otp }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/admin"), 1500);
      } else {
        setError(data.error || "Geçersiz kod.");
      }
    } catch (e) {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 selection:bg-rose-600 selection:text-white">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-900/5 blur-[100px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-zinc-950/80 backdrop-blur-3xl border border-zinc-900 p-10 rounded-[3rem] shadow-2xl space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-600/10 rounded-full border border-rose-600/20 mb-2">
              <Shield className="w-10 h-10 text-rose-600" />
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              DRKCNAY <span className="text-rose-600">ELITE</span>
            </h1>
            <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase italic bg-zinc-900/50 py-2 rounded-full border border-zinc-800">
              Access Controller v6.2
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "send" ? (
              <motion.div 
                key="send"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-900 text-center">
                  <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                    Yönetim paneline erişmek için Telegram grubuna gönderilecek olan OTP kodunu doğrulamanız gerekmektedir.
                  </p>
                </div>
                
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white py-5 rounded-2xl font-black italic uppercase tracking-widest shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? "GÖNDERİLİYOR..." : (
                    <>
                      KOD GÖNDER <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="verify"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-zinc-500 uppercase italic ml-4">
                    TELEGRAM KODU
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      maxLength={6}
                      placeholder="______"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full bg-zinc-950 border border-zinc-900 focus:border-rose-600 rounded-2xl py-5 px-6 text-center text-3xl font-black tracking-[0.5em] text-white outline-hidden transition-all placeholder:opacity-20"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                      <Lock className="w-5 h-5 text-zinc-700" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length < 6}
                  className="w-full bg-white hover:bg-zinc-200 disabled:opacity-30 text-black py-5 rounded-2xl font-black italic uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  {loading ? "DOĞRULANIYOR..." : (
                    <>
                      ERİŞİM SAĞLA <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <button 
                  onClick={() => setStep("send")}
                  className="w-full text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-rose-600 transition-colors"
                >
                  YENİ KOD GÖNDER
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-950/20 border border-rose-900/30 p-4 rounded-xl flex items-center gap-3 text-rose-500 text-xs font-bold"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl flex items-center gap-3 text-emerald-500 text-xs font-bold"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                ERİŞİM YETKİSİ ONAYLANDI. YÖNLENDİRİLİYORSUNUZ...
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Footer */}
        <div className="mt-10 text-center space-y-2">
          <p className="text-[9px] font-black tracking-[0.5em] text-zinc-800 uppercase italic">
            ENCRYPTED SESSION // BIOMETRIC BYPASS DISABLED
          </p>
          <p className="text-[9px] font-black tracking-[0.5em] text-zinc-800 uppercase italic">
            ESTABLISHED 2026 // DRKCNAY HUB
          </p>
        </div>
      </motion.div>
    </div>
  );
}
