import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function main() {
  const ssh = new NodeSSH();
  try {
    console.log(`Connecting to ${server.host}...`);
    await ssh.connect(server);
    console.log('✅ SSH Connected!');
    
    console.log('\n--- PM2 PROCESS DETAILS ---');
    const pm2Res = await ssh.execCommand('pm2 jlist'); // Get JSON list for detailed info
    try {
        const processes = JSON.parse(pm2Res.stdout);
        processes.forEach(p => {
            console.log(`Name: ${p.name}, Status: ${p.pm2_env.status}, CWD: ${p.pm2_env.pm_cwd}`);
        });
    } catch(e) {
        console.log('Could not parse PM2 output, trying standard list:');
        const listRes = await ssh.execCommand('pm2 list');
        console.log(listRes.stdout);
    }

    console.log('\n--- SCANNING FOR FOLDERS (vipescort / escortvip) ---');
    const findRes = await ssh.execCommand('find / -maxdepth 3 -name "*escort*" -type d 2>/dev/null');
    console.log('Folders found:', findRes.stdout);
    
    ssh.dispose();
  } catch (e) {
    console.error('❌ SSH Failed:', e.message);
  }
}

main();
