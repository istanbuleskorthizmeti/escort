
import { NodeSSH } from 'node-ssh';
import * as fs from 'fs';
import * as path from 'path';

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
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

        console.log('📦 Gathering all files from lib/ and components/SEO/...');
        const libFiles = getAllFiles('lib');
        const compFiles = getAllFiles('components/SEO');
        const appFiles = [
            'app/page.tsx',
            'app/[...slug]/page.tsx'
        ];

        const allFiles = [...libFiles, ...compFiles, ...appFiles];

        for (const localFile of allFiles) {
            const remoteFile = path.join('/root/hydra', localFile).replace(/\\/g, '/');
            const content = fs.readFileSync(localFile, 'utf8'); 
            
            // Ensure remote directory exists
            await ssh.execCommand(`mkdir -p ${path.dirname(remoteFile)}`);
            await ssh.execCommand(`cat > ${remoteFile}`, { stdin: content });
            console.log(`✅ Uploaded: ${localFile}`);
        }

        console.log('🚀 Starting TOTAL Remote Build (V4)...');
        const buildRes = await ssh.execCommand('npm run build', { cwd: '/root/hydra' });
        
        console.log('--- Build Output ---');
        console.log(buildRes.stdout);
        console.error('--- Build Errors ---');
        console.error(buildRes.stderr);

        if (buildRes.code === 0) {
            console.log('♻️ Restarting Hydra via PM2...');
            await ssh.execCommand('pm2 restart all');
            console.log('🌟 HYDRA TOTAL DOMINATION ONLINE!');
        } else {
            console.error('❌ Build Failed!');
        }

        ssh.dispose();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

deploy();
