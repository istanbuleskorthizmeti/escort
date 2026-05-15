import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function searchSeoPrefix() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Global "seo_" Prefix Search: Searching for the missing archive...');
    
    const res = await ssh.execCommand('find / -iname "seo_*" 2>/dev/null | wc -l');
    console.log(`Total "seo_" files found globally: ${res.stdout.trim()}`);

    if (parseInt(res.stdout.trim()) > 1000) {
       console.log('💎 BINGO! Found a large collection of "seo_" files.');
       const folders = await ssh.execCommand('find / -iname "seo_*" 2>/dev/null | cut -d/ -f1-4 | sort | uniq -c | sort -nr | head -n 10');
       console.log('Location of these files:');
       console.log(folders.stdout);
    } else {
       console.log('⚠️ No large collection found with "seo_" prefix.');
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

searchSeoPrefix();
