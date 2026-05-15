import os from 'os';

/**
 * 🛡️ DRKCNAY OPSEC KILL SWITCH 🛡️
 * Bu modül, Black Hat SEO botlarının KESİNLİKLE kullanıcının lokal (ev/ofis) 
 * bilgisayarında çalışmasını engeller. Eğer kod uzaktaki bir sunucuda (Offshore VPS) 
 * çalışmıyorsa, kendini imha eder (process.exit).
 */
export function enforceOpsecOrDie() {
    // 1. Check if we are running on Windows (User's local machine)
    // Production servers are Linux (Ubuntu)
    if (os.platform() === 'win32') {
        console.error('\n🚨 [OPSEC FATAL ERROR] 🚨');
        console.error('KURAL İHLALİ TESPİT EDİLDİ: Bu bot lokal Windows makinesinde ÇALIŞTIRILAMAZ!');
        console.error('Lokal IP ifşa riski nedeniyle sistem kendini kilitledi.');
        console.error('Lütfen komutu sadece offshore Linux sunucusu üzerinden (SSH ile) çalıştırın.\n');
        process.exit(1);
    }

    // 2. Check if we are explicitly in development mode
    if (process.env.NODE_ENV === 'development' || !process.env.PRODUCTION_SERVER_IP) {
        console.error('\n🚨 [OPSEC FATAL ERROR] 🚨');
        console.error('KURAL İHLALİ TESPİT EDİLDİ: NODE_ENV development modunda botlar ateşlenemez!');
        process.exit(1);
    }
}
