
import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';

const conn = new Client();
conn.on('ready', () => {
    console.log('🚀 SSH Ready, starting stream upload...');
    const localPath = path.join(process.cwd(), 'scratch', 'telegram_vitrin.zip');
    
    conn.exec('cat > /tmp/telegram_vitrin.zip', (err, stream) => {
        if (err) {
            console.error('❌ Exec error:', err);
            process.exit(1);
        }
        
        const readStream = fs.createReadStream(localPath);
        readStream.pipe(stream);
        
        stream.on('close', (code, signal) => {
            console.log('✅ Stream closed. Code:', code);
            conn.end();
        });

        stream.stderr.on('data', (data) => {
            console.error('STDERR:', data.toString());
        });
    });
}).on('error', (err) => {
    console.error('❌ Connection error:', err);
}).connect({
    host: '213.232.235.181',
    port: 22,
    username: 'root',
    password: '4TVuj7qiHMfh7CxH6K!'
});
