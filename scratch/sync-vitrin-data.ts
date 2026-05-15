
import { NodeSSH } from 'node-ssh';
import * as fs from 'fs';
import * as path from 'path';

async function sync() {
    const ssh = new NodeSSH();
    try {
        await ssh.connect({
            host: '213.232.235.181',
            username: 'root',
            password: '4TVuj7qiHMfh7CxH6K!'
        });

        console.log('🔄 Syncing Vitrin Data from Server...');
        const res = await ssh.execCommand('cat /root/hydra/tmp/elite_vitrin_data.json');
        
        if (!res.stdout || res.stdout === '[]') {
            console.log('⚠️ Vitrin data is empty or not found.');
            ssh.dispose();
            return;
        }

        const data = JSON.parse(res.stdout);
        console.log(`✅ Loaded ${data.length} Elite Assets.`);

        const content = `export const vitrinImages = ${JSON.stringify(data, null, 2)};\n`;
        
        const targetPath = path.join(process.cwd(), 'lib', 'vitrin-images.ts');
        fs.writeFileSync(targetPath, content);
        console.log(`🚀 Updated local ${targetPath}`);

        ssh.dispose();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

sync();
