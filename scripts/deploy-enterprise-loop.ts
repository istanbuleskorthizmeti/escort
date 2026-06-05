import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '34.185.231.84',
  username: 'onurk',
  privateKey: fs.readFileSync(path.join(process.env.USERPROFILE || 'C:\\Users\\onurk', '.ssh', 'google_compute_engine'), 'utf8')
};

async function run() {
  try {
    console.log('📡 Connecting to GCP Server 34.185.231.84...');
    await ssh.connect(config);
    console.log('✅ Connected to SSH.');

    // Read the local scripts/google-enterprise-integration.ts file
    const localScriptPath = path.join(process.cwd(), 'scripts', 'google-enterprise-integration.ts');
    const scriptContent = fs.readFileSync(localScriptPath, 'utf8');

    // Replace relative paths or imports if necessary for the server context
    // The server project is at /root/esc or /home/onurk/esc
    const remoteScriptPath = '/root/esc/scripts/google-enterprise-integration.ts';

    console.log('📤 Uploading google-enterprise-integration.ts to remote server...');
    const base64Code = Buffer.from(scriptContent).toString('base64');
    
    // Write via sudo to ensure access to /root/esc/scripts
    await ssh.execCommand(`sudo mkdir -p /root/esc/scripts`);
    await ssh.execCommand(`echo "${base64Code}" | base64 -d | sudo tee ${remoteScriptPath} > /dev/null`);
    console.log('✅ Upload complete.');

    console.log('⚙️ Executing Google Enterprise Loop script on remote server...');
    const execRes = await ssh.execCommand(`sudo npx tsx ${remoteScriptPath}`);
    
    console.log('--- STDOUT ---');
    console.log(execRes.stdout);
    console.log('--- STDERR ---');
    console.log(execRes.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ Deployment / Execution failed:', err.message);
    ssh.dispose();
  }
}

run();
