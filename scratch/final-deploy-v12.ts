
import { NodeSSH } from 'node-ssh';
import * as fs from 'fs';
import * as path from 'path';

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;
    const files = fs.readdirSync(dirPath);
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (!/\.(png|jpg|jpeg|gif|webp|ico|svg|woff|woff2|zip|pdf|sql|tar|gz)$/i.test(file)) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
}

async function deploy() {
    const ssh = new NodeSSH();
    try {
        await ssh.connect({
            host: '213.232.235.181',
            username: 'root',
            password: '4TVuj7qiHMfh7CxH6K!'
        });

        console.log('🧹 AGGRESSIVE CLEANUP...');
        await ssh.execCommand('pm2 stop all');
        await ssh.execCommand('rm -rf /root/hydra/.next /root/hydra/dist /root/hydra/node_modules/.cache');

        console.log('📦 Syncing ALL lib/, components/, app/, and PRISMA...');
        const libFiles = getAllFiles('lib');
        const compFiles = getAllFiles('components');
        const appFiles = getAllFiles('app');
        const prismaFiles = getAllFiles('prisma');
        const rootFiles = ['middleware.ts', 'next.config.ts', 'tailwind.config.ts', 'package.json'];

        const allFiles = [...libFiles, ...compFiles, ...appFiles, ...prismaFiles, ...rootFiles];

        for (const localFile of allFiles) {
            if (!fs.existsSync(localFile)) continue;
            const remoteFile = path.join('/root/hydra', localFile).replace(/\\/g, '/');
            const content = fs.readFileSync(localFile, 'utf8');
            
            await ssh.execCommand(`mkdir -p ${path.dirname(remoteFile)}`);
            await ssh.execCommand(`cat > ${remoteFile}`, { stdin: content });
        }

        console.log(`✅ Total Files Uploaded: ${allFiles.length}`);

        console.log('🔄 Syncing Database Schema...');
        await ssh.execCommand('npx prisma db push --accept-data-loss', { cwd: '/root/hydra' });
        await ssh.execCommand('npx prisma generate', { cwd: '/root/hydra' });

        console.log('🚀 Starting ULTIMATE Remote Build (V12 - NUCLEAR CLEAN)...');
        const buildRes = await ssh.execCommand('npm run build', { cwd: '/root/hydra' });
        
        if (buildRes.code === 0) {
            console.log('♻️ Restarting Hydra via PM2...');
            await ssh.execCommand('pm2 restart all');
            console.log('🌟 HYDRA ULTIMATE DOMINATION ONLINE!');
        } else {
            console.error('❌ Build Failed!');
            console.error(buildRes.stderr);
            await ssh.execCommand('pm2 start all');
        }

        ssh.dispose();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

deploy();
