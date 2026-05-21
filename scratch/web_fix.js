const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  console.log('📡 Web sunucusuna bağlanılıyor (213.232.235.181) ve kurtarma başlatılıyor...');
  try {
    await ssh.connect(config);
    console.log('✅ SSH bağlantısı kuruldu.\n');

    // 1. Node yolunu ve çevre değişkenlerini kontrol et
    console.log('🔍 [1] Node.js konumu ve PATH bilgisi sorgulanıyor...');
    const whichNode = await ssh.execCommand('which node');
    console.log('Node konumu:', whichNode.stdout.trim() || 'Bulunamadı');

    const nodePathDetails = await ssh.execCommand('ls -l $(which node)');
    console.log('Dosya İzinleri (ls -l):', nodePathDetails.stdout.trim() || nodePathDetails.stderr.trim());

    const echoPath = await ssh.execCommand('echo $PATH');
    console.log('PATH Değişkeni:', echoPath.stdout.trim());

    // 2. İzinleri Düzeltmeyi Dene (Chmod +x ve sahiplik kontrolü)
    console.log('\n🛠️ [2] Node.js çalıştırma izinleri sıfırlanıyor...');
    const nodeBin = whichNode.stdout.trim();
    if (nodeBin) {
      const chmodRes = await ssh.execCommand(`chmod +x ${nodeBin}`);
      console.log('chmod +x sonucu:', chmodRes.stdout || chmodRes.stderr || 'Tamamlandı.');
    } else {
      console.log('⚠️ Node.js ikili dosyası `which node` ile bulunamadığı için chmod uygulanamadı.');
    }

    // NVM (Node Version Manager) kontrolü
    console.log('\n🔍 [3] NVM / Alternatif Node yolları taranıyor...');
    const findNode = await ssh.execCommand('find /root/.nvm/ -type f -name "node" 2>/dev/null || find /usr/ -type f -name "node" 2>/dev/null');
    console.log('Bulunan Node yolları:\n', findNode.stdout || 'NVM veya alternatif yol bulunamadı.');

    const foundPaths = findNode.stdout.trim().split('\n').filter(Boolean);
    for (const p of foundPaths) {
      console.log(`Node dosyası izinleri düzeltiliyor: ${p}`);
      await ssh.execCommand(`chmod +x "${p}"`);
    }

    // 3. PM2 Yeniden Çalıştırma Denemesi (Sourced environment)
    console.log('\n🔄 [4] Çevre değişkenleri yüklenerek PM2 listesi sorgulanıyor...');
    const pm2Res = await ssh.execCommand('export PATH=$PATH:/usr/local/bin:/usr/bin && source ~/.bashrc 2>/dev/null; pm2 list');
    console.log('PM2 Listesi:\n', pm2Res.stdout || pm2Res.stderr);

    console.log('\n🔄 [5] Next.js uygulamasını yeniden başlatmayı deniyoruz...');
    const pm2Restart = await ssh.execCommand('export PATH=$PATH:/usr/local/bin:/usr/bin && source ~/.bashrc 2>/dev/null; pm2 restart drkcnay-web-cluster || pm2 start ecosystem.config.js');
    console.log('PM2 Restart Sonucu:\n', pm2Restart.stdout || pm2Restart.stderr);

  } catch (err) {
    console.error('❌ Hata oluştu:', err.message);
  } finally {
    ssh.dispose();
    console.log('\n🔌 Bağlantı kapatıldı.');
  }
}

run();
