const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  console.log('📡 Web sunucusuna bağlanılıyor (213.232.235.181)...');
  try {
    await ssh.connect(config);
    console.log('✅ Bağlantı başarılı.\n');

    // 1. PM2 Süreçlerinin Durumu
    console.log('📊 [1] PM2 Servis Durumları:');
    const pm2List = await ssh.execCommand('pm2 list');
    console.log(pm2List.stdout || pm2List.stderr || 'PM2 aktif değil.');

    // 2. Next.js Uygulamasını Kurtarma (Restart)
    console.log('\n🔄 [2] Next.js Web Kümesi Yeniden Başlatılıyor (drkcnay-web-cluster)...');
    const pm2Restart = await ssh.execCommand('pm2 restart drkcnay-web-cluster || pm2 start ecosystem.config.js');
    console.log(pm2Restart.stdout || pm2Restart.stderr);

    // 3. Port Kontrolü
    console.log('\n🔌 [3] Aktif Dinlenen Portlar (3000, 3001, 80, 443):');
    const ports = await ssh.execCommand('ss -tulpn | grep -E "3000|3001|80|443" || netstat -tulpn | grep -E "3000|3001|80|443"');
    console.log(ports.stdout || ports.stderr || 'Eşleşen port bulunamadı.');

    // 4. PM2 Hata Günlükleri (Son 15 Satır)
    console.log('\n📝 [4] PM2 Son Hata Logları:');
    const pm2Logs = await ssh.execCommand('pm2 logs drkcnay-web-cluster --lines 15 --err --nostream');
    console.log(pm2Logs.stdout || pm2Logs.stderr || 'PM2 hata logu boş veya bulunamadı.');

    // 5. Nginx Hata Günlükleri (Son 10 Satır)
    console.log('\n🛑 [5] Nginx Son Hata Logları:');
    const nginxLogs = await ssh.execCommand('tail -n 10 /var/log/nginx/error.log');
    console.log(nginxLogs.stdout || nginxLogs.stderr || 'Nginx hata logu temiz.');

  } catch (err) {
    console.error('❌ Bağlantı veya işlem hatası:', err.message);
  } finally {
    ssh.dispose();
    console.log('\n🔌 Bağlantı kapatıldı.');
  }
}

run();
