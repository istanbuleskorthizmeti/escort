
import { NodeSSH } from 'node-ssh';
import * as fs from 'fs';
import * as path from 'path';

async function deploy() {
    const ssh = new NodeSSH();
    try {
        await ssh.connect({
            host: '213.232.235.181',
            username: 'root',
            password: '4TVuj7qiHMfh7CxH6K!'
        });

        // 1. Files to upload (Direct Mapping)
        const filesToUpload = [
            { local: 'lib/vitrin-images.ts', remote: '/root/hydra/lib/vitrin-images.ts' },
            { local: 'app/page.tsx', remote: '/root/hydra/app/page.tsx' },
            { local: 'app/[...slug]/page.tsx', remote: '/root/hydra/app/[...slug]/page.tsx' },
            { local: 'components/SEO/DorukVitrin.tsx', remote: '/root/hydra/components/SEO/DorukVitrin.tsx' },
            { local: 'components/SEO/IstanbulConquestMatrix.tsx', remote: '/root/hydra/components/SEO/IstanbulConquestMatrix.tsx' },
            { local: 'components/SEO/SEOContentEngine.tsx', remote: '/root/hydra/components/SEO/SEOContentEngine.tsx' },
            { local: 'components/SEO/UltraFooter.tsx', remote: '/root/hydra/components/SEO/UltraFooter.tsx' },
            { local: 'components/SEO/VIPEventHub.tsx', remote: '/root/hydra/components/SEO/VIPEventHub.tsx' },
            { local: 'components/SEO/MathematicalSEO.tsx', remote: '/root/hydra/components/SEO/MathematicalSEO.tsx' }
        ];

        for (const file of filesToUpload) {
            const content = fs.readFileSync(file.local, 'utf8');
            await ssh.execCommand(`cat > ${file.remote}`, { stdin: content });
            console.log(`✅ Uploaded: ${file.local}`);
        }

        console.log('🚀 Starting Remote Build (This may take a while)...');
        const buildRes = await ssh.execCommand('npm run build', { cwd: '/root/hydra' });
        
        console.log('--- Build Output ---');
        console.log(buildRes.stdout);
        console.error('--- Build Errors ---');
        console.error(buildRes.stderr);

        if (buildRes.code === 0) {
            console.log('♻️ Restarting Hydra via PM2...');
            await ssh.execCommand('pm2 restart all');
            console.log('🌟 HYDRA DOMINATION ONLINE!');
        } else {
            console.error('❌ Build Failed!');
        }

        ssh.dispose();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

deploy();
