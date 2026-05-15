
import { NodeSSH } from 'node-ssh';
import * as fs from 'fs';

async function deploy() {
    const ssh = new NodeSSH();
    try {
        await ssh.connect({
            host: '213.232.235.181',
            username: 'root',
            password: '4TVuj7qiHMfh7CxH6K!'
        });

        const config = fs.readFileSync('scratch/nginx-escortvip.conf', 'utf8');
        
        // Write via temp file to avoid shell escape hell
        await ssh.execCommand('cat > /tmp/nginx_escortvip.conf', { stdin: config });
        await ssh.execCommand('mv /tmp/nginx_escortvip.conf /etc/nginx/sites-available/escortvip');
        
        const testRes = await ssh.execCommand('nginx -t');
        console.log('Nginx Test:', testRes.stdout, testRes.stderr);
        
        if (testRes.code === 0) {
            await ssh.execCommand('systemctl reload nginx');
            console.log('✅ Nginx CDN Config Applied & Reloaded!');
        } else {
            console.error('❌ Nginx Config Test Failed!');
        }

        ssh.dispose();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

deploy();
