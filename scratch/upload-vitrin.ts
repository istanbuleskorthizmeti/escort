
import { NodeSSH } from 'node-ssh';
import path from 'path';

async function upload() {
    const ssh = new NodeSSH();
    try {
        await ssh.connect({
            host: '213.232.235.181',
            username: 'root',
            password: '4TVuj7qiHMfh7CxH6K!'
        });

        const localPath = path.join(process.cwd(), 'scratch', 'telegram_vitrin.zip');
        const remotePath = '/root/hydra/telegram_vitrin.zip';

        console.log('🚀 Uploading telegram_vitrin.zip to server...');
        await ssh.putFile(localPath, remotePath);
        console.log('✅ Upload complete!');

        console.log('📦 Unzipping and preparing directory...');
        await ssh.execCommand('rm -rf /root/hydra/tmp/telegram_vitrin && mkdir -p /root/hydra/tmp/telegram_vitrin');
        await ssh.execCommand('unzip -o /root/hydra/telegram_vitrin.zip -d /root/hydra/tmp/telegram_vitrin');
        
        console.log('🧹 Cleaning up zip...');
        await ssh.execCommand('rm /root/hydra/telegram_vitrin.zip');

        ssh.dispose();
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

upload();
